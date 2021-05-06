import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import {of, Subject, throwError} from 'rxjs';
// @ts-ignore
import {concat, mergeMap, takeUntil} from 'rxjs/operators';

import {ConfirmComponent} from 'app/confirm/confirm.component';
// import {Application} from 'core/models/application';
import {PublicComment} from 'core/models/publiccomment';

import {ProjectDto, ProjectService} from 'core/api';


@Component({
  selector: 'app-application-detail',
  templateUrl: './fom-detail.component.html',
  styleUrls: ['./fom-detail.component.scss']
})
export class FomDetailComponent implements OnInit, OnDestroy {
  public isPublishing = false;
  public isUnpublishing = false;
  public isDeleting = false;
  public isRefreshing = false;
  public application: ProjectDto = null;
  public publicComment: PublicComment = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public project: ProjectDto = null;
  // public forestClient: any = null;
  // public district: any = null;
  // public forestClient: ForestClientDto = null;
  public isProjectActive = false;
  public numberComments = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    // private dialogService: DialogService,
    public projectService: ProjectService // also used in template
  ) {
  }

  ngOnInit() {
    // get data from route resolver
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: { application: ProjectDto }) => {
      if (data.application) {
        this.project = data.application;
        // console.log('projectDTO: '+ JSON.stringify(data.application));
        // console.log('projecForestClien: '+ JSON.stringify(data.application.district));
        // this.forestClient = data.application.forestClient;
        // this.district = data.application.district;
        if (this.project.workflowState['code'] === 'INITIAL') {
          this.isProjectActive = true;
        }
        this.fetchingAllPublicComments();
        console.log('fom detail: ' + this.project.workflowStateCode['code']);
      } else {
        alert("Uh-oh, couldn't load fom");
        // application not found --> navigate back to search
        this.router.navigate(['/search']);
      }
    });
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public deleteApplication() {
    /* if (this.application.meta.numComments > 0) {
      this.dialogService
        .addDialog(
          ConfirmComponent,
          {
            title: 'Cannot Delete Application',
            message: 'An application with submitted comments cannot be deleted.',
            okOnly: true
          },
          {
            backdropColor: 'rgba(0, 0, 0, 0.5)'
          }
        )
        .pipe(takeUntil(this.ngUnsubscribe));
      return;
    }

    if (this.application.meta.isPublished) {
      this.dialogService
        .addDialog(
          ConfirmComponent,
          {
            title: 'Cannot Delete Application',
            message: 'Please unpublish application first.',
            okOnly: true
          },
          {
            backdropColor: 'rgba(0, 0, 0, 0.5)'
          }
        )
        .pipe(takeUntil(this.ngUnsubscribe));
      return;
    } */

    // this.dialogService
    //   .addDialog(
    //     ConfirmComponent,
    //     {
    //       title: 'Confirm Deletion',
    //       message: 'Do you really want to delete this application?',
    //       okOnly: false
    //     },
    //     {
    //       backdropColor: 'rgba(0, 0, 0, 0.5)'
    //     }
    //   )
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(isConfirmed => {
    //     if (isConfirmed) {
    //       this.internalDeleteApplication();
    //     }
    //   });
  }

  private internalDeleteApplication() {
    this.isDeleting = true;

    let observables = of(null);

    /*
    // delete comment period
    if (this.application.meta.currentPeriod) {
      observables = observables.pipe(concat(this.commentPeriodService.delete(this.application.meta.currentPeriod)));
    }

    // delete decision documents
    if (this.application.meta.decision && this.application.meta.decision.meta.documents) {
      for (const doc of this.application.meta.decision.meta.documents) {
        observables = observables.pipe(concat(this.documentService.delete(doc)));
      }
    }

    // delete decision
    if (this.application.meta.decision) {
      observables = observables.pipe(concat(this.decisionService.delete(this.application.meta.decision)));
    }

    // delete application documents
    if (this.application.meta.documents) {
      for (const doc of this.application.meta.documents) {
        observables = observables.pipe(concat(this.documentService.delete(doc)));
      }
    }

    // delete features
    observables = observables.pipe(concat(this.featureService.deleteByApplicationId(this.application._id)));

    // delete application
    // do this last in case of prior failures
    observables = observables.pipe(concat(this.projectService.delete(this.application)));
    */

    observables.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        // onNext
        // do nothing here - see onCompleted() function below
      },
      error => {
        this.isDeleting = false;
        console.log('error =', error);
        alert("Uh-oh, couldn't delete application");
        // TODO: should fully reload application here so we have latest non-deleted objects
      },
      () => {
        // onCompleted
        this.isDeleting = false;
        // delete succeeded --> navigate back to search
        this.router.navigate(['/search']);
      }
    );
  }

  /**
   * Refreshes the application meta and features with the latest data from Tantalis.
   *
   * @memberof ApplicationDetailComponent
   */
  public refreshApplication() {
    this.isRefreshing = true;
    /* this.api
      .refreshApplication(this.application)
      .pipe(
        // Now that the application is refreshed, fetch it with all of its new data and features.
        // Also fetch the documents, comment periods, and decisions so we don't have to manually merge them over from
        // the current this.application.
        mergeMap(updatedApplicationAndFeatures => {
          if (updatedApplicationAndFeatures) {
            return this.projectService.getById(updatedApplicationAndFeatures.application._id, {
              getFeatures: true,
              getDocuments: true,
              getCurrentPeriod: true,
              getDecision: true
            });
          } else {
            return throwError('Refresh application request returned invalid response.');
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        refreshedApplication => {
          if (refreshedApplication) {
            // update the application with the latest data
            this.application = refreshedApplication;
          }
        },
        error => {
          this.isRefreshing = false;
          console.log('error =', error);
          alert("Uh-oh, couldn't update application");
        },
        () => {
          this.isRefreshing = false;
          this.snackBarRef = this.snackBar.open('Application refreshed...', null, { duration: 2000 });
        }
      ); */
  }

  public publishApplication() {
    if (!this.application.description) {
      // this.dialogService
      //   .addDialog(
      //     ConfirmComponent,
      //     {
      //       title: 'Cannot Publish Application',
      //       message: 'A description for this application is required to publish.',
      //       okOnly: true
      //     },
      //     {
      //       backdropColor: 'rgba(0, 0, 0, 0.5)'
      //     }
      //   )
      //   .pipe(takeUntil(this.ngUnsubscribe));
      // return;
    }

    // this.dialogService
    //   .addDialog(
    //     ConfirmComponent,
    //     {
    //       title: 'Confirm Publish',
    //       message: 'Publishing this application will make it visible to the public. Are you sure you want to proceed?',
    //       okOnly: false
    //     },
    //     {
    //       backdropColor: 'rgba(0, 0, 0, 0.5)'
    //     }
    //   )
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(isConfirmed => {
    //     if (isConfirmed) {
    //       this.internalPublishApplication();
    //     }
    //   });

    return; // TODO - Marcelo
  }

  private internalPublishApplication() {
    this.isPublishing = true;

    let observables = of(null);

    // publish comment period
    /* if (this.application.meta.currentPeriod && !this.application.meta.currentPeriod.meta.isPublished) {
      observables = observables.pipe(concat(this.commentPeriodService.publish(this.application.meta.currentPeriod)));
    }

    // publish decision documents
    if (this.application.meta.decision && this.application.meta.decision.meta.documents) {
      for (const doc of this.application.meta.decision.meta.documents) {
        if (!doc.meta.isPublished) {
          observables = observables.pipe(concat(this.documentService.publish(doc)));
        }
      }
    }

    // publish decision
    if (this.application.meta.decision && !this.application.meta.decision.meta.isPublished) {
      observables = observables.pipe(concat(this.decisionService.publish(this.application.meta.decision)));
    }

    // publish application documents
    if (this.application.meta.documents) {
      for (const doc of this.application.meta.documents) {
        if (!doc.meta.isPublished) {
          observables = observables.pipe(concat(this.documentService.publish(doc)));
        }
      }
    }

    // publish application
    // do this last in case of prior failures
    if (!this.application.meta.isPublished) {
      observables = observables.pipe(concat(this.projectService.publish(this.application)));
    }

    // finally, save publish date (first time only)
    if (!this.application.publishDate) {
      this.application.publishDate = new Date(); // now
      observables = observables.pipe(concat(this.projectService.save(this.application)));
    } */

    observables.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        // onNext
        // do nothing here - see onCompleted() function below
      },
      error => {
        this.isPublishing = false;
        console.log('error =', error);
        alert("Uh-oh, couldn't publish application");
        // TODO: should fully reload application here so we have latest isPublished flags for objects
      },
      () => {
        // onCompleted
        this.snackBarRef = this.snackBar.open('Application published...', null, {duration: 2000});
        // reload all data
        /* this.projectService
          .getById(this.application.id, {
            getFeatures: true,
            getDocuments: true,
            getCurrentPeriod: true,
            getDecision: true
          })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (application: ProjectDto) => {
              this.isPublishing = false;
              this.application = application;
            },
            error => {
              this.isPublishing = false;
              console.log('error =', error);
              alert("Uh-oh, couldn't reload application");
            }
          ); */
      }
    );
  }

  public unPublishApplication() {
    this.isUnpublishing = true;

    let observables = of(null);

    /*
    // unpublish comment period
    if (this.application.meta.currentPeriod && this.application.meta.currentPeriod.meta.isPublished) {
      observables = observables.pipe(concat(this.commentPeriodService.unPublish(this.application.meta.currentPeriod)));
    }

    // unpublish decision documents
    if (this.application.meta.decision && this.application.meta.decision.meta.documents) {
      for (const doc of this.application.meta.decision.meta.documents) {
        if (doc.meta.isPublished) {
          observables = observables.pipe(concat(this.documentService.unPublish(doc)));
        }
      }
    }

    // unpublish decision
    if (this.application.meta.decision && this.application.meta.decision.meta.isPublished) {
      observables = observables.pipe(concat(this.decisionService.0unPublish(this.application.meta.decision)));
    }

    // unpublish application documents
    if (this.application.meta.documents) {
      for (const doc of this.application.meta.documents) {
        if (doc.meta.isPublished) {
          observables = observables.pipe(concat(this.documentService.unPublish(doc)));
        }
      }
    }

    // unpublish application
    // do this last in case of prior failures
    if (this.application.meta.isPublished) {
      observables = observables.pipe(concat(this.projectService.unPublish(this.application)));
    }
    */

    observables.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        // onNext
        // do nothing here - see onCompleted() function below
      },
      error => {
        this.isUnpublishing = false;
        console.log('error =', error);
        alert("Uh-oh, couldn't unpublish application");
        // TODO: should fully reload application here so we have latest isPublished flags for objects
      },
      () => {
        // onCompleted
        this.snackBarRef = this.snackBar.open('Application unpublished...', null, {duration: 2000});
        // reload all data
        this.projectService
          .projectControllerFindOne(this.application.id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            // @ts-ignore
            (application: Application) => {
              this.isUnpublishing = false;
              // this.application = application;
            },
            error => {
              this.isUnpublishing = false;
              console.log('error =', error);
              alert("Uh-oh, couldn't reload application");
            }
          );
      }
    );
  }

  public fetchingAllPublicComments() {
    /* this.searchPublicCommentService.getPublicCommentsByProjectId(this.project.id)
    .subscribe(
      publicComments => {
        publicComments.forEach(publicComment => {
          this.numberComments ++;
          this.publicComment = publicComment;
        });

      },
      error => {
        console.log('error =', error);
      }); */
  }
}
