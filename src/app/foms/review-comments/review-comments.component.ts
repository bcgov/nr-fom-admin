import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {ProjectResponse, ProjectService, PublicCommentAdminResponse} from 'core/api';
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

// TODO: Not sure why we use this for error message...
export const ERROR_DIALOG = {
  // title: 'The requested project does not exist.',
  // message: 'Please try again.',
  width: '340px',
  height: '200px',
  buttons: {
    cancel: {
      text: 'Close'
    }
  }
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
  public loading = false;
  public projectId: number;
  public project: ProjectResponse;
  public selectedItem: PublicCommentAdminResponse;
  public user: User;
  
  public data$: Observable<PublicCommentAdminResponse[]>;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private commentSaved$ = new Subject(); // To notify when 'save' happen.

  constructor(
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private commentSvc: PublicCommentService,
    private stateSvc: StateService,
    private projectSvc: ProjectService,
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

    this.data$ = this.getProjectComments();

    this.commentSaved$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.data$ = this.getProjectComments();
    });
  }

  getProjectComments() {
    return this.commentSvc.publicCommentControllerFind(this.projectId);
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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


}
