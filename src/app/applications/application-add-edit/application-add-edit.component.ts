import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
// import { Location } from '@angular/common';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, concat, tap, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfirmComponent } from 'app/confirm/confirm.component';
import { Document } from 'core/models/document';
import { Decision } from 'core/models/decision';
import { ProjectDto, ProjectService } from 'core/api';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ApplicationAddEditForm } from './application-add-edit.form';
import { StateService } from 'core/services/state.service';

export type ApplicationPageType = 'create' | 'edit';




@Component({
  selector: 'app-application-add-edit',
  templateUrl: './application-add-edit.component.html',
  styleUrls: ['./application-add-edit.component.scss']
})
export class ApplicationAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild( 'applicationForm' ) applicationForm: NgForm;
  applicationFormGroup: FormGroup;

  state: ApplicationPageType;
  get isCreate() {
    return this.state === 'create'
  }
  private scrollToFragment: string = null;
  public isSubmitSaveClicked = false;
  public isSubmitting = false;
  public isSaving = false;
  public application: Partial<ProjectDto> = {
    name: '',
    description: '',
    commentingOpenDate: new Date().toISOString(),
    commentingClosedDate:new Date().toISOString(),
    fspId: 0,
    districtId: 0,
    forestClientNumber: '1011',
    workflowStateCode: 'INITIAL',

  };

  public project: ProjectDto = null;
  public startDate: NgbDateStruct = null;
  public endDate: NgbDateStruct = null;
  public delta: number; // # days (including today)
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private docsToDelete: Document[] = [];
  private decisionToDelete: Decision = null;
  public applicationFiles: File[] = [];
  public decisionFiles: File[] = [];

  // Access to XMLHttpRequest at 'localhost:3333/api/project' from origin 'http://localhost:4200' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, chrome-untrusted, https.

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private location: Location,
    public snackBar: MatSnackBar,
    private projectSvc: ProjectService,
    private formBuilder: RxFormBuilder,
    private stateSvc: StateService,
  ) {
    // if we have an URL fragment, save it for future scrolling
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = router.parseUrl(router.url);
        this.scrollToFragment = (url && url.fragment) || null;
      }
    });
  }

  // check for unsaved changes before closing (or reloading) current tab/window
  @HostListener('window:beforeunload', ['$event'])
  public handleBeforeUnload(event) {
    if (!this.applicationForm) {
      event.returnValue = true; // no form means page error -- allow unload
    }

    // display browser alert if needed
    if (this.applicationForm.dirty || this.anyUnsavedItems()) {
      event.returnValue = true;
    }
  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.applicationForm) {
      return true; // no form means page error -- allow deactivate
    }

    // allow synchronous navigation if everything is OK
    if (!this.applicationForm.dirty && !this.anyUnsavedItems()) {
      return true;
    }

    return true; // TODO - Marcelo

    // otherwise prompt the user with observable (asynchronous) dialog
    // return this.dialogService
    //   .addDialog(
    //     ConfirmComponent,
    //     {
    //       title: 'Unsaved Changes',
    //       message: 'Click OK to discard your changes or Cancel to return to the application.',
    //       okOnly: true // TODO - added this to remove compilation errors but I don't really know what it means
    //     },
    //     {
    //       backdropColor: 'rgba(0, 0, 0, 0.5)'
    //     }
    //   )
    //   .pipe(takeUntil(this.ngUnsubscribe));
  }

  // this is needed because we don't have a form control that is marked as dirty
  private anyUnsavedItems(): boolean {
    // look for application documents not yet uploaded to db
    // TODO: Make sure application.meta exists!
    /*
    if (!this.application.meta) return false;

    if (this.application.meta.documents) {
      for (const doc of this.application.meta.documents) {
        if (!doc._id) {
          return true;
        }
      }
    }

    // look for decision documents not yet uploaded to db
    if (this.application.meta.decision && this.application.meta.decision.meta.documents) {
      for (const doc of this.application.meta.decision.meta.documents) {
        if (!doc._id) {
          return true;
        }
      }
    }
    */

    // look for application or decision documents not yet removed from db
    if (this.docsToDelete && this.docsToDelete.length > 0) {
      return true;
    }

    // look for decision not yet removed from db
    if (this.decisionToDelete) {
      return true;
    }

    return false; // no unsaved items
  }

  public cancelChanges() {
    // this.location.back(); // FAILS WHEN CANCEL IS CANCELLED (DUE TO DIRTY FORM OR UNSAVED DOCUMENTS) MULTIPLE TIMES

    if (this.application.id) {
      // go to details page
      this.router.navigate(['/a', this.application.id]);
    } else {
      // go to search page
      this.router.navigate(['/search']);
    }
  }

  ngOnInit() {

    this.route.url.pipe( switchMap( url => {
      this.state = url[ 1 ].path === 'create' ? 'create' : 'edit'

      return this.isCreate ? of(this.application) : this.projectSvc.projectControllerFindOne( this.route.snapshot.params.appId ) ;
    }
    )).subscribe( ( data  ) => {

      this.application = data;
      const form = new ApplicationAddEditForm(data)
      this.applicationFormGroup = this.formBuilder.formGroup(form)
    } );
  }

  ngAfterViewInit() {
    // if requested, scroll to specified section
    if (this.scrollToFragment) {
      // ensure element exists
      const element = document.getElementById(this.scrollToFragment);
      if (element) {
        element.scrollIntoView();
      }
    }
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // @ts-ignore
  private static dateToNgbDate(date: Date): NgbDateStruct {
    return date ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
  }

  // @ts-ignore
  private static ngbDateToDate(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  // used in template
  public isValidDate(date: NgbDateStruct): boolean {
    return date && !isNaN(date.year) && !isNaN(date.month) && !isNaN(date.day);
  }

  public onStartDateChg(startDate: NgbDateStruct) {
    if (startDate !== null) {
      // this.application.meta.currentPeriod.startDate = this.ngbDateToDate(startDate);
      // to set dates, we also need delta
      if (this.delta) {
        this.setDates(true, false, false);
      }
    }
  }

  public onDeltaChg(delta: number) {
    if (delta !== null) {
      this.delta = delta;
      // to set dates, we also need start date
      /* if (this.application.meta.currentPeriod.startDate) {
        this.setDates(false, true, false);
      } */
    }
  }

  public onEndDateChg(endDate: NgbDateStruct) {
    if (endDate !== null) {
      // this.application.meta.currentPeriod.endDate = this.ngbDateToDate(endDate);
      // to set dates, we also need start date
      // if (this.application.meta.currentPeriod.startDate) {
        this.setDates(false, false, true);
      // }
    }
  }

  private setDates(start?: boolean, delta?: boolean, end?: boolean) {
    if (start) {
      // when start changes, adjust end accordingly
      /* this.application.meta.currentPeriod.endDate = new Date(this.application.meta.currentPeriod.startDate);
      this.application.meta.currentPeriod.endDate.setDate(
        this.application.meta.currentPeriod.startDate.getDate() + this.delta - 1
      );
      this.endDate = this.dateToNgbDate(this.application.meta.currentPeriod.endDate); */
    } else if (delta) {
      // when delta changes, adjust end accordingly
      /* this.application.meta.currentPeriod.endDate = new Date(this.application.meta.currentPeriod.startDate);
      this.application.meta.currentPeriod.endDate.setDate(
        this.application.meta.currentPeriod.startDate.getDate() + this.delta - 1
      );
      this.endDate = this.dateToNgbDate(this.application.meta.currentPeriod.endDate);
      */
    } else if (end) {
      // when end changes, adjust delta accordingly
      // use moment to handle Daylight Saving Time changes
      /* this.delta =
        moment(this.application.meta.currentPeriod.endDate).diff(
          moment(this.application.meta.currentPeriod.startDate),
          'days'
        ) + 1; */
    }
  }

  public addDecision() {
    // this.application.meta.decision = new Decision();
  }

  public deleteDecision() {
    /* if (this.application.meta.decision) {
      // stage decision documents to delete
      if (this.application.meta.decision.meta.documents) {
        for (const doc of this.application.meta.decision.meta.documents) {
          this.deleteDocument(doc, this.application.meta.decision.meta.documents);
        }
      }

      // if decision exists in db, stage it for deletion
      if (this.application.meta.decision._id) {
        this.decisionToDelete = this.application.meta.decision;
      }

      this.application.meta.decision = null;
    } */
  }

  // add application or decision documents
  public addDocuments(files: FileList, documents: Document[]) {
    if (files && documents) {
      // safety check
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          // ensure file is not already in the list
          if (_.find(documents, doc => doc.documentFileName === files[i].name)) {
            this.snackBarRef = this.snackBar.open("Can't add duplicate file", null, { duration: 2000 });
            continue;
          }

          const formData = new FormData();
          formData.append('displayName', files[i].name);
          formData.append('upfile', files[i]);

          const document = new Document();
          document['formData'] = formData; // temporary
          document.documentFileName = files[i].name;

          // save document for upload to db when application is added or saved
          documents.push(document);
        }
      }
    }
  }

  // delete application or decision document
  public deleteDocument(doc: Document, documents: Document[]) {
    if (doc && documents) {
      // safety check
      // remove doc from current list
      _.remove(documents, item => item.documentFileName === doc.documentFileName);

      if (doc._id) {
        // save document for removal from db when application is saved
        this.docsToDelete.push(doc);
      }
    }
  }


  // this is part 1 of saving an application and all its objects
  // (multi-part due to dependencies)

  async submit() {
    if ( this.stateSvc.loading ) return;
    const result = await this.projectSvc.projectControllerCreate( this.applicationFormGroup.value as ProjectDto ).pipe( tap( obs => console.log( obs ) ) ).toPromise()
    const { id } = result;
    if ( !id ) { }
    this.onSuccess(id)
  }

  onSuccess( id: number ) {
        this.router.navigate([`a/${id}`])

  }


  async saveApplication() {
    const { id, district, forestClient, workflowState, ...rest } = this.application;

    const updateDto = {...rest, ...this.applicationFormGroup.value}
    try {
      const result = await this.projectSvc.projectControllerUpdate( id, updateDto as ProjectDto ).pipe( tap( obs => console.log( obs ) ) ).toPromise();
      console.log( result );
      // this.onSuccess( id )
      console.log( this.application );
    }
    catch ( err ) {

    }

  }

}
