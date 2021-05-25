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
import {
  ProjectDto,
  ProjectService,
  SpatialObjectCodeEnum,
  SubmissionDto,
  SubmissionTypeCodeEnum
} from 'core/api';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomSubmissionForm} from './fom-submission.form';
import {StateService} from 'core/services/state.service';
import {ModalService} from 'core/services/modal.service';
import {SubmissionService} from 'core/api';

// import {UploadBoxComponent} from "../../../core/components/file-upload-box/file-upload-box.component";

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
  project: ProjectDto;

  public submissionDto:  SubmissionDto;
  public applicationFiles: File[] = [];
  private scrollToFragment: string = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  files: any[] = [];
  public geoTypeValues: String[] = [];
  contentFile: string;

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
    private submissionSvc: SubmissionService,
    // private uploadBox: UploadBoxComponent
  ) {  }

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
    const routerFragment = ['/a', this.project.id]

    this.router.navigate(routerFragment);

  }

  ngOnInit() {
   this.geoTypeValues = Object.values(SpatialObjectCodeEnum);
    this.route.url.pipe(takeUntil(this.ngUnsubscribe), switchMap(url => {
        // this.state = url[1].path === 'create' ? 'create' : 'edit'
        return this.projectSvc.projectControllerFindOne(this.route.snapshot.params.appId);
      }
    )).subscribe((data: ProjectDto) => {
      this.project = data as ProjectDto;
      this.submissionDto = <SubmissionDto> {
        projectId: data.id,
        submissionTypeCode: SubmissionTypeCodeEnum.Proposed,
        spatialObjectCode: SpatialObjectCodeEnum.CutBlock,
        jsonSpatialSubmission: Object
      }
      const form = new FomSubmissionForm(this.submissionDto);
      this.fg = <RxFormGroup>this.formBuilder.formGroup(form);
      this.fg.get('projectId').setValue(this.submissionDto.projectId);
      this.fg.get('submissionTypeCode').setValue(this.submissionDto.submissionTypeCode);
      // this.fg.get('spatialObjectCode').setValue(this.submissionDto.spatialObjectCode);
      console.log('submissionDto: ' + this.fg.get('projectId').value);
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


  addNewFiles(newFiles: any[]) {
    console.log('addNewFiles:', newFiles);
    this.files.push(newFiles);
  }

  getContentFileFromUpload(fileContent: string) {
    this.contentFile = fileContent;
    try {
      this.submissionDto.jsonSpatialSubmission = JSON.parse(this.contentFile);
    }catch (e) {
      // TODO - Show the proper popup message
      throw new Error(e);
    }
    this.fg.get('jsonSpatialSubmission').setValue(this.submissionDto.jsonSpatialSubmission);
    // console.log('inside getContent: ', fileContent);
    // console.log('inside getContent: ', JSON.stringify(this.submissionDto));
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
    // console.log('project', this.fg.get('projectId').value)
    // console.log('submissionTypeCode', this.fg.get('submissionTypeCode').value)
    // console.log('spatialObjectCode', this.fg.get('spatialObjectCode').value)
    // console.log('spatialSub', this.fg.get('jsonSpatialSubmission').value)

    // this.validate();
    // if (!this.fg.valid) return;
    // if (this.stateSvc.loading) return;
    // const result = await this.projectSvc.projectControllerCreate(this.fg.value as ProjectDto).pipe(tap(obs => console.log(obs))).toPromise()
    // TODO: We need go improve this as it's returning null
    const result = await this.submissionSvc.submissionControllerProcessSpatialSubmission(this.fg.value as SubmissionDto).toPromise();
    console.log('result: ', result)
    // const {id} = result;
    // if (!id) {
    // }
     this.onSuccess(this.submissionDto.projectId);
  }

  onSuccess(id: number) {
    this.router.navigate([`a/${id}`])

  }


  async saveApplication() {
    console.log('inside save')
    const {id, district, forestClient, workflowState, ...rest} = this.project;

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


  changeGeoType(e) {
    this.fg.get('spatialObjectCode').setValue(e.target.value);
  }
}
