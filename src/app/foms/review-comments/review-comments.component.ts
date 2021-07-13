import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {ProjectResponse, ProjectService, PublicCommentAdminResponse, SpatialFeaturePublicResponse, SpatialFeatureService, SpatialObjectCodeEnum} from 'core/api';
import {
  PublicCommentService,
  PublicCommentAdminUpdateRequest
} from 'core/api';
import {ModalService} from 'core/services/modal.service';
import {StateService} from 'core/services/state.service';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { takeUntil } from 'rxjs/operators';
import { KeycloakService } from 'core/services/keycloak.service';
import { User } from 'core/services/user';
import * as _ from 'lodash';
import { COMMENT_SCOPE_CODE, ConstantUtils } from 'core/utils/constants/constantUtils';

export const ERROR_DIALOG = {
  width: '340px',
  height: '200px',
  buttons: {
    cancel: {
      text: 'Close'
    }
  }
};

type CommentScopeOpt = {
  commentScopeCode: COMMENT_SCOPE_CODE,
  desc: string,
  name: string, 
  scopeId: number
};

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.scss']
})
export class ReviewCommentsComponent implements OnInit, OnDestroy {

  @ViewChild('commentListScrollContainer', {read: ElementRef})
  public commentListScrollContainer: ElementRef;
  @ViewChild('commentDetailForm') 
  commentDetailForm: CommentDetailComponent;

  public responseCodes = this.stateSvc.getCodeTable('responseCode')
  public commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');
  public loading = false;
  public projectId: number;
  public project: ProjectResponse;
  public selectedItem: PublicCommentAdminResponse;
  public user: User;
  public commentScopeOpts :Array<CommentScopeOpt> = [];
  public selectedScope: CommentScopeOpt;

  public publicComments$: Observable<PublicCommentAdminResponse[]>;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private commentSaved$ = new Subject(); // To notify when 'save' happen.

  constructor(
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private commentSvc: PublicCommentService,
    private stateSvc: StateService,
    private projectSvc: ProjectService,
    private spatialFeatureService: SpatialFeatureService,
    private keycloakService: KeycloakService
  ) {
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    if (this.commentListScrollContainer && this.commentListScrollContainer.nativeElement) {
      this.commentListScrollContainer.nativeElement.scrollTop = 0;
    }
    
    this.projectId = this.route.snapshot.params.appId;
    this.projectSvc.projectControllerFindOne(this.projectId).toPromise()
        .then((result) => {this.project = result;});

    this.publicComments$ = this.getProjectComments();

    this.commentSaved$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.publicComments$ = this.getProjectComments();
    });

    this.spatialFeatureService.spatialFeatureControllerGetForProject(this.projectId)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe((spatialDetails) => {
          this.buildCommentScopeOptions(spatialDetails);
    });

  }

  getProjectComments() {
    return this.commentSvc.publicCommentControllerFind(this.projectId);
  }

  // TODO: work in progress
  getProjectCommentsFilterByScope(scope: CommentScopeOpt):PublicCommentAdminResponse[] {
    let fPublicComments: PublicCommentAdminResponse[];
    this.getProjectComments().subscribe((comments)=> {
      fPublicComments = comments.filter((comment) => {
        if (!scope || scope.commentScopeCode == null) {
          return true; // No filtering on scope. everything.
        }
        else if (scope.commentScopeCode === COMMENT_SCOPE_CODE.OVERALL) {
          return comment.commentScope.code === scope.commentScopeCode;
        }
        return comment.commentScope.code === scope.commentScopeCode &&
                ((comment.scopeCutBlockId && comment.scopeCutBlockId == scope.scopeId) ||
                (comment.scopeRoadSectionId && comment.scopeCutBlockId == scope.scopeId));
      });
    },
    (error) => {
      console.error(error);
    });
    return fPublicComments;
  }

  /**
   * @param item item to be set to child component.
   * @param pos scroll position (from the list). When user clicks, no need to save it, only until user click 'save' then 
   *            the saveComment() method will call this to update again the selected item and set selected item to child
   *            component and at the same time passing 'pos' to scroll to correct position for the list. Will need 
   *            setTimeout to delay scrolling after view is good.
   */
  onReviewItemClicked(item: PublicCommentAdminResponse, pos: number) {
    this.selectedItem = item;
    this.commentDetailForm.selectedComment = item;
    if (pos) {
      // !! important to wait or will not see the effect.
      setTimeout(() => {
        this.commentListScrollContainer.nativeElement.scrollTop = pos;
      }, 150);
    }
  }

  canReplyComment() {
    const userCanModify = this.user.isAuthorizedForClientId(this.project.forestClient.id);
    return userCanModify && (this.project.workflowState['code'] === 'COMMENT_OPEN'
                            || this.project.workflowState['code'] === 'COMMENT_CLOSED');
  }

  async saveComment(update: PublicCommentAdminUpdateRequest, selectedComment: PublicCommentAdminResponse) {
    if (!this.canReplyComment()) {
      return;
    }
    const {id} = selectedComment;
    update.revisionCount = selectedComment.revisionCount;

    try {
      this.loading = true;
      const result = await this.commentSvc.publicCommentControllerUpdate(id, update).toPromise();
      if (result) {
        // scroll position, important to get it first!!
        const pos = this.commentListScrollContainer.nativeElement.scrollTop;

        // Comment is saved successfully, so triggering service to retrieve comment list 
        // from backend for consistent state of the list at frontend.
        this.commentSaved$.next();
        this.selectedItem = result; // updated selected.
        this.loading = false;
        setTimeout(() => {
          this.onReviewItemClicked(this.selectedItem, pos);
        }, 300);

      } else {
        this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Failed to update', title: ''}})
        this.loading = false;
      }
    } catch (err) {
      console.error("Failed to update.", err)
      this.loading = false;
    }
  }

  // TODO: work in progress
  onScopeOptionChanged(selection: CommentScopeOpt) {
    this.getProjectCommentsFilterByScope(selection);
  }

  private buildCommentScopeOptions(spatialDetails: SpatialFeaturePublicResponse[]) {
    this.commentScopeOpts = [];
    // Comment Scope select options
    const allOpt = {commentScopeCode: null, desc: 'All', name: null, scopeId: null} as CommentScopeOpt;
    const overallOpt = {
      commentScopeCode: ConstantUtils.getCommentScopeCodeOrDesc(null, true), 
      desc: ConstantUtils.getCommentScopeCodeOrDesc(null, false), 
      name: null, 
      scopeId: null} as CommentScopeOpt;     
    this.commentScopeOpts.push(allOpt);
    this.commentScopeOpts.push(overallOpt);
    this.selectedScope = allOpt;

    if (spatialDetails) {
      spatialDetails
        .filter((detail) => {
          return ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType, true);// filter out rention_area.
        })
        .forEach((detail) => {
        this.commentScopeOpts.push({commentScopeCode: ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType, true), 
                                desc: ConstantUtils.getCommentScopeCodeOrDesc(detail.featureType, false),
                                name: detail.name, 
                                scopeId: detail.featureId} as CommentScopeOpt);
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

