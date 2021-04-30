// import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
// import {NgForm} from '@angular/forms';
// import { Location } from '@angular/common';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import * as _ from 'lodash';

// import {ConfirmComponent} from 'app/confirm/confirm.component';
import {Document} from 'core/models/document';
import {DistrictDto, ProjectDto, ProjectService, ForestClientDto} from 'core/api';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomAddEditSubmissionForm} from './fom-add-edit.submission.form';
import {StateService} from 'core/services/state.service';
import {ModalService} from 'core/services/modal.service';

export type ApplicationPageType = 'create' | 'edit';

@Component({
  selector: 'app-fom-submission',
  templateUrl: './fom-submission.component.html',
  styleUrls: ['./fom-submission.component.scss'],
  providers: [DatePipe]
})
export class FomSubmissionComponent implements OnInit, AfterViewInit, OnDestroy {
  fg: RxFormGroup;
// test = this.fg.get('')
  originalApplication: ProjectDto;

  districts: DistrictDto[] = this.stateSvc.getCodeTable('district');
  forestClients: ForestClientDto[] = [];
  public project: ProjectDto = null;
  public startDate: NgbDateStruct = null;
  public endDate: NgbDateStruct = null;
  public applicationFiles: File[] = [];
  private scrollToFragment: string = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public districtIdSelect: any = null;
  public forestClientSelect: any = null;

  get isLoading() {
    return this.stateSvc.loading;
  }

  // Access to XMLHttpRequest at 'localhost:3333/api/project' from origin 'http://localhost:4200' has been blocked by
  // CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension,
  // chrome-untrusted, https.

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private location: Location,
    public snackBar: MatSnackBar,
    private projectSvc: ProjectService,
    private formBuilder: RxFormBuilder,
    private stateSvc: StateService,
    private modalSvc: ModalService,
    private datePipe: DatePipe
  ) {
    const atco: ForestClientDto = {
      id: 1065,
      revisionCount: 1,
      createTimestamp: '2021-04-28',
      createUser: 'postgres',
      updateTimestamp: '2021-04-28',
      updateUser: 'postgres',
      name: 'ATCO LUMBER LTD.'
    }

    const canadianForest: ForestClientDto = {
      id: 1271,
      revisionCount: 1,
      createTimestamp: '2021-04-28',
      createUser: 'postgres',
      updateTimestamp: '2021-04-28',
      updateUser: 'postgres',
      name: 'CANADIAN FOREST PRODUCTS LTD.'
    }

    const interfor: ForestClientDto = {
      id: 2176,
      revisionCount: 1,
      createTimestamp: '2021-04-28',
      createUser: 'postgres',
      updateTimestamp: '2021-04-28',
      updateUser: 'postgres',
      name: 'INTERFOR CORPORATION'
    }

    const tolko: ForestClientDto = {
      id: 147603,
      revisionCount: 1,
      createTimestamp: '2021-04-28',
      createUser: 'postgres',
      updateTimestamp: '2021-04-28',
      updateUser: 'postgres',
      name: 'TOLKO INDUSTRIES LTD.'
    }

    const westFraser: ForestClientDto = {
      id: 142662,
      revisionCount: 1,
      createTimestamp: '2021-04-28',
      createUser: 'postgres',
      updateTimestamp: '2021-04-28',
      updateUser: 'postgres',
      name: 'WEST FRASER MILLS LTD'
    }
    this.forestClients.push(atco);
    this.forestClients.push(canadianForest);
    this.forestClients.push(interfor);
    this.forestClients.push(tolko);
    this.forestClients.push(westFraser);
  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.fg) {
      return true;
    }

    // allow synchronous navigation if everything is OK
    if (!this.fg.dirty && !this.fg.isModified) {
      return true;
    }

    return false;
  }

  public cancelChanges() {
    // this.location.back(); // FAILS WHEN CANCEL IS CANCELLED (DUE TO DIRTY FORM OR UNSAVED DOCUMENTS) MULTIPLE TIMES
    const routerFragment = ['/a', this.originalApplication.id]

    this.router.navigate(routerFragment);

  }

  ngOnInit() {

    this.route.url.pipe(takeUntil(this.ngUnsubscribe), switchMap(url => {
        // this.state = url[1].path === 'create' ? 'create' : 'edit'
        return this.projectSvc.projectControllerFindOne(this.route.snapshot.params.appId);
      }
    )).subscribe((data: ProjectDto) => {
      this.originalApplication = data as ProjectDto;
      const form = new FomAddEditSubmissionForm(data);
      this.fg = <RxFormGroup>this.formBuilder.formGroup(form);
      this.districtIdSelect = this.originalApplication.districtId;
      this.forestClientSelect = this.originalApplication.forestClientNumber;

      // Converting commentingOpenDate date to 'yyyy-MM-dd'
      let datePipe = this.datePipe.transform(this.fg.value.commentingOpenDate,'yyyy-MM-dd');
      this.fg.get('commentingOpenDate').setValue(datePipe);
      // Converting commentingClosedDate date to 'yyyy-MM-dd'
      datePipe = this.datePipe.transform(this.fg.value.commentingClosedDate,'yyyy-MM-dd');
      this.fg.get('commentingClosedDate').setValue(datePipe);
    });
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
    return date ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  // @ts-ignore
  private static ngbDateToDate(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  // used in template
  public isValidDate(date: NgbDateStruct): boolean {
    return date && !isNaN(date.year) && !isNaN(date.month) && !isNaN(date.day);
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
            this.snackBarRef = this.snackBar.open("Can't add duplicate file", null, {duration: 2000});
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

  // this is part 1 of saving an application and all its objects
  // (multi-part due to dependencies)

  validate() {
    if (!this.fg.valid) {
      this.fg.markAllAsTouched();
      this.fg.updateValueAndValidity({onlySelf: false, emitEvent: true});
      this.modalSvc.openDialog({
        data: {
          message: 'Invalid inputs',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
      console.log(this.fg)
    }
    return this.fg.valid;
  }

  async submit() {
    this.validate();
    if (!this.fg.valid) return;
    if (this.stateSvc.loading) return;
    const result = await this.projectSvc.projectControllerCreate(this.fg.value as ProjectDto).pipe(tap(obs => console.log(obs))).toPromise()
    const {id} = result;
    if (!id) {
    }
    this.onSuccess(id)
  }

  onSuccess(id: number) {
    this.router.navigate([`a/${id}`])

  }


  async saveApplication() {
    const {id, district, forestClient, workflowState, ...rest} = this.originalApplication;

    const updateDto = {...rest, ...this.fg.value}
    try {
      const result = await this.projectSvc.projectControllerUpdate(id, updateDto as ProjectDto).pipe(tap(obs => console.log(obs))).toPromise();
      console.log(result);
      if (result) return this.onSuccess(id);
      this.modalSvc.openDialog({
        data: {
          message: 'There was an error with the request please try again',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })


      // this.onSuccess( id )
      // console.log( this.application );
    } catch (err) {

    }

  }

  changeDistrictId(e) {
    this.fg.get('districtId').setValue(e.target.value);
  }

  changeForestClientId(e) {
    this.fg.get('forestClientNumber').setValue(e.target.value);
  }
}
