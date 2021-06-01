import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {PublicCommentAdminResponse} from 'core/api';
import {
  ProjectResponse,
  ProjectService,
  PublicCommentService,
  PublicCommentAdminUpdateRequest
} from 'core/api';
import {FormControl} from '@angular/forms';
import * as R from 'remeda'
import {ModalService} from 'core/services/modal.service';
import {StateService} from 'core/services/state.service';

type SortKeysType = keyof Pick<PublicCommentAdminResponse, 'createTimestamp' | 'name'>
type SortDirType = 'asc' | 'desc'

class SortKey {
  innerHTML: string;
  value: SortKeysType;
  dir: SortDirType
}


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
  readonly PAGE_SIZE = 20;

  @ViewChild('commentListScrollContainer', {read: ElementRef})
  public commentListScrollContainer: ElementRef; // TODO: Something is up with this...

  comment: PublicCommentAdminResponse;

  readonly sortKeys: SortKey[] = [
    {innerHTML: 'Oldest', value: 'createTimestamp', dir: 'desc'},
    {innerHTML: 'Newest', value: 'createTimestamp', dir: 'asc'},
    {innerHTML: 'Name (A-Z)', value: 'name', dir: 'desc'},
    {innerHTML: 'Name (Z-A)', value: 'name', dir: 'asc'}
  ];
  sortControl: FormControl = new FormControl(this.sortKeys[1]);

  data$: Observable<{ project: ProjectResponse, comments: PublicCommentAdminResponse[]; }>

  responseCodes = this.stateSvc.getCodeTable('responseCode')

  commentsList: PublicCommentAdminResponse[];

  results$: Observable<PublicCommentAdminResponse[]> = this.sortControl.valueChanges.pipe(startWith(this.sortKeys[1].value), map(dir => {

    return dir.dir === 'asc' ? R.sortBy(this.comments, (item) => item[dir.value]) : R.reverse(R.sortBy(this.comments, (item) => item[dir.value]));

  }))

  public loading = false;
  public project: ProjectResponse = null;
  public comments: PublicCommentAdminResponse[] = [];
  public publicComments: PublicCommentAdminResponse[] = [];
  public alerts: string[] = [];
  public currentComment: Comment;
  public currentPublicComment: PublicCommentAdminResponse;


  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectSvc: ProjectService,
    private modalSvc: ModalService,
    private commentSvc: PublicCommentService,
    private stateSvc: StateService
  ) {
  }

  ngOnInit() {
    if (this.commentListScrollContainer && this.commentListScrollContainer.nativeElement) {
      this.commentListScrollContainer.nativeElement.scrollTop = 0;
    }
    const {appId: projectId} = this.route.snapshot.params;

    this.data$ = forkJoin(this.projectSvc.projectControllerFindOne(projectId),
      this.commentSvc.publicCommentControllerFind(projectId))
      .pipe(takeUntil(this.ngUnsubscribe), map(result => {

      const [project, comments] = result;

      this.comments = comments;

      if (!project) {
        const ref = this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Home', title: ''}});

        ref.afterClosed().subscribe(() => this.router.navigate(['admin/search']))
      }

      return {project, comments}
    }))
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
      const result = await this.commentSvc.publicCommentControllerUpdate(id, update).toPromise()
      if (result) {
        this.modalSvc.openSnackBar({message: 'Comment saved', button: 'OK'})
        this.sortControl.setValue(this.sortControl.value)
      } else {
        this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Failed to update', title: ''}})
      }
    } catch (err) {

    }

  }


}
