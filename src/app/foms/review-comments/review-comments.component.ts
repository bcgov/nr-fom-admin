import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {PublicCommentAdminResponse} from 'core/api';
import {
  PublicCommentService,
  PublicCommentAdminUpdateRequest
} from 'core/api';
import {ModalService} from 'core/services/modal.service';
import {StateService} from 'core/services/state.service';

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
  public commentListScrollContainer: ElementRef; // TODO: Something is up with this...
 
  public responseCodes = this.stateSvc.getCodeTable('responseCode')
  public loading = false;
  public projectId: number;

  public data$: Observable<PublicCommentAdminResponse[]>;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private commentSaved$ = new Subject(); // To notify when 'save' happen.

  constructor(
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private commentSvc: PublicCommentService,
    private stateSvc: StateService
  ) {
  }

  ngOnInit() {
    if (this.commentListScrollContainer && this.commentListScrollContainer.nativeElement) {
      this.commentListScrollContainer.nativeElement.scrollTop = 0;
    }
    
    this.projectId = this.route.snapshot.params.appId;
    this.data$ = this.getProjectComments();

    this.commentSaved$.subscribe(() => {
      this.data$ = this.getProjectComments();
    });
  }

  getProjectComments() {
    return this.commentSvc.publicCommentControllerFind(this.projectId);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async saveComment(update: PublicCommentAdminUpdateRequest, selectedComment: PublicCommentAdminResponse) {
    const {id} = selectedComment;
    update.revisionCount = selectedComment.revisionCount;

    // TODO: error handling seems not quite right, need to revise it later.
    try {
      this.loading = true;
      const result = await this.commentSvc.publicCommentControllerUpdate(id, update).toPromise()
      if (result) {
        const sbRef = this.modalSvc.openSnackBar({message: 'Comment saved', button: 'OK'});
        sbRef.onAction().subscribe(() => {
          // Comment is saved successfully, so triggering service to retrieve comment list 
          // from backend for consistent state of the list at frontend.
          this.commentSaved$.next();
          this.loading = false;
        });
      } else {
        this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Failed to update', title: ''}})
        this.loading = false;
      }
    } catch (err) {
      this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Failed to update', title: ''}})
      this.loading = false;
    }
  }


}
