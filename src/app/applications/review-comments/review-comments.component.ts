import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { map, mergeMap, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';

import { Application } from 'core/models/application';
import { Comment } from 'core/models/comment';
import { commentStubArray } from '../stubs/comment-stub';
import { singleApplicationStub } from '../stubs/application-stub';
import { Project } from 'core/models/project';
import { PublicComment } from 'core/models/publiccomment';
import { ProjectDto, ProjectService, PublicCommentsService } from 'core/api';
import { FormControl } from '@angular/forms';
import * as R from 'remeda'

type SortKeysType = keyof Pick<PublicComment, 'createTimestamp' | 'name'>
type SortDirType = 'asc' | 'desc'
class SortKey {
  innerHTML: string;
  value: SortKeysType;
  dir: SortDirType
}



@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.scss']
})
export class ReviewCommentsComponent implements OnInit, OnDestroy {
  readonly PAGE_SIZE = 20;

  @ViewChild('commentListScrollContainer', { read: ElementRef })
  public commentListScrollContainer: ElementRef; // TODO: Something is up with this...

  comment: PublicComment;

  readonly sortKeys: SortKey[] = [
    { innerHTML: 'Oldest', value: 'createTimestamp' , dir: 'desc' },
    { innerHTML: 'Newest', value: 'createTimestamp', dir: 'asc' },
    { innerHTML: 'Name (A-Z)', value: 'name', dir: 'desc' },
    { innerHTML: 'Name (Z-A)', value: 'name', dir: 'asc' }
  ];
  sortControl: FormControl =  new FormControl( [ this.sortKeys[ 1 ] ] );

  data$: Observable<{ project: ProjectDto, comments: PublicComment[]; }>

  currIndex = 0;
  commentsList: PublicComment[];


  changeIndex( index: number ) {
    this.currIndex = index;
    const chunkedComments = R.chunk( this.comments, this.PAGE_SIZE );
    this.commentsList = chunkedComments[ index - 1 ];

  }

  results$: Observable<PublicComment[]> = this.sortControl.valueChanges.pipe( startWith( this.sortKeys[ 1 ].value ), map( dir => {

return  dir.dir === 'asc' ?  R.sortBy( this.comments, (item) => item[dir.value] ) : R.reverse( R.sortBy( this.comments, (item) => item[dir.value] ));

  } ) )

  public loading = false;
  public application: Application = null;
  public project: Project = null;
  public comments: PublicComment[] = [];
  public publicComments: PublicComment[] = [];
  public alerts: string[] = [];
  public currentComment: Comment;
  public currentPublicComment: PublicComment;
  public pageCount = 1; // in case getCount() fails
  public pageNum = 1; // first page
  public sortBy = this.sortKeys[1].value; // initial sort is by descending date
  // see official solution:
  // https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
  // or http://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectSvc: ProjectService,
    private commentsSvc: PublicCommentsService
  ) {}

  ngOnInit() {
    if (this.commentListScrollContainer && this.commentListScrollContainer.nativeElement) {
      this.commentListScrollContainer.nativeElement.scrollTop = 0;
    }
    // this.comments = commentStubArray;
    // this.application = singleApplicationStub;
    // get data from route resolver
    const { appId } = this.route.snapshot.params;


    this.data$ = forkJoin( this.projectSvc.projectControllerFindOne( appId ), this.commentsSvc.
      publicCommentsControllerFindByProjectId( appId ) ).pipe( takeUntil( this.ngUnsubscribe ), map( result => {

        const [ project, comments ] = result;

        this.comments = comments;

        return {project, comments}
    } ) )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  prevPage() {
    this.pageNum--;
    // this.getData();
  }

  nextPage() {
    this.pageNum++;
    // this.getData();
  }



}
