// import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';

import {
  DistrictResponse,
  ProjectResponse,
  ProjectService,
  ForestClientResponse,
  ForestClientService,
  ProjectCreateRequest, ProjectUpdateRequest
} from 'core/api';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomAddEditForm} from './fom-add-edit.form';
import {StateService} from 'core/services/state.service';
import {ModalService} from 'core/services/modal.service';
import {WorkflowStateEnum} from "core/api/model/workflowStateEnum";
import {toNumber} from "ngx-bootstrap/timepicker/timepicker.utils";

export type ApplicationPageType = 'create' | 'edit';

@Component({
  selector: 'app-application-add-edit',
  templateUrl: './fom-add-edit.component.html',
  styleUrls: ['./fom-add-edit.component.scss'],
  providers: [DatePipe]
})
export class FomAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  fg: RxFormGroup;
// test = this.fg.get('')
  state: ApplicationPageType;
  originalProjectResponse: ProjectResponse;

  get isCreate() {
    return this.state === 'create';
  }
  districts: DistrictResponse[] = this.stateSvc.getCodeTable('district');
  forestClients: ForestClientResponse[] = [];
  public project: ProjectResponse = null;
  public startDate: NgbDateStruct = null;
  public endDate: NgbDateStruct = null;
  public fomSupportingDocuments: File[] = [];
  public initialPublicDocument: File[] = [];
  private scrollToFragment: string = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public districtIdSelect: any = null;
  public forestClientSelect: any = null;
  files: any[] = [];
  publicNoticeDocument: any;

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
    private datePipe: DatePipe,
    private  forestSvc: ForestClientService
  ) { }

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
    const routerFragment = this.isCreate ? ['/search'] : ['/a', this.originalProjectResponse.id]

    this.router.navigate(routerFragment);

  }

  ngOnInit() {

    this.route.url.pipe(takeUntil(this.ngUnsubscribe), switchMap(url => {
        this.state = url[1].path === 'create' ? 'create' : 'edit';
        return this.isCreate ? of(new FomAddEditForm()) : this.projectSvc.projectControllerFindOne(this.route.snapshot.params.appId);
      }
    )).subscribe((data: ProjectResponse) => {
      if (!this.isCreate) {
        this.originalProjectResponse = data as ProjectResponse;
        if (data.district){
          this.districtIdSelect = this.originalProjectResponse.district.id;
        }

        this.forestClientSelect = this.originalProjectResponse.forestClient.id;
      }
      console.log('ngOnInint is create')
      const form = new FomAddEditForm(data);
      this.fg = <RxFormGroup>this.formBuilder.formGroup(form);
      // console.log('ProjectResponse: ', this.fg.value as ProjectResponse);

      // Converting commentingOpenDate date to 'yyyy-MM-dd'
      let datePipe = this.datePipe.transform(this.fg.value.commentingOpenDate,'yyyy-MM-dd');
      this.fg.get('commentingOpenDate').setValue(datePipe);
      // Converting commentingClosedDate date to 'yyyy-MM-dd'
      datePipe = this.datePipe.transform(this.fg.value.commentingClosedDate,'yyyy-MM-dd');
      this.fg.get('commentingClosedDate').setValue(datePipe);

      this.fg.get('district').setValue(this.districtIdSelect);

      // this.fg.get('workflowState').setValue(WorkflowStateEnum.INITIAL);

      this.loadForestClients().then( (result) => {
        this.forestClients = result;
      }).catch((error)=> {
        console.log('Error: ', error)
      });
    });
  }

  async loadForestClients (): Promise<ForestClientResponse[]> {
   return await this.forestSvc.forestClientControllerFind().toPromise()
}

  addNewFiles(newFiles: any[]) {
    this.files.push(newFiles);
    // console.log('Inserted files on parent: ' + this.files.length);
  }

  addNewPublicNoticeDocument(newDocument: any) {
    this.publicNoticeDocument = newDocument;
    // console.log('public notice', this.publicNoticeDocument);
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

  validate() {
    if (!this.fg.valid) {
      this.fg.markAllAsTouched();
      this.fg.updateValueAndValidity({onlySelf: false, emitEvent: true});
      this.modalSvc.openDialog({
        data: {
          message: 'You missed some information. ',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })

    }
    console.log('inside validate: ', this.fg);
    return this.fg.valid;
  }

  async submit() {
    this.validate();
    if (!this.fg.valid) return;
    if (this.stateSvc.loading) return;
    let projectCreate = this.fg.value as ProjectCreateRequest
    projectCreate['districtId'] = this.districtIdSelect;
    projectCreate.forestClientNumber = this.fg.get('forestClient').value;

      console.log('projectCreate: ', projectCreate)
    const result = await this.projectSvc.projectControllerCreate(projectCreate).pipe(tap(obs => console.log(obs))).toPromise()
    const {id} = result;
    if (!id) {
    }
    this.onSuccess(id)
  }

  onSuccess(id: number) {
    this.router.navigate([`a/${id}`])

  }


  async saveApplication() {
    const {id, forestClient, workflowState, ...rest} = this.originalProjectResponse;
    // console.log('inside save: ', this.fg)
    let projectUpdateRequest = {...rest, ...this.fg.value}
    projectUpdateRequest['districtId'] = projectUpdateRequest.district;

    console.log('Trying to save projectUpdateRequest: ', JSON.stringify(projectUpdateRequest))
    if(!projectUpdateRequest.description) {
      console.log('inside if');
      return;
    }else {
        console.log('outside if',projectUpdateRequest.description )
    }

    this.validate();
    if (!this.fg.valid) return;
    try {
      const result = await this.projectSvc.projectControllerUpdate(id, projectUpdateRequest).pipe(tap(obs => console.log(obs))).toPromise();
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
    this.fg.get('district').setValue(parseInt(e.target.value));
    this.districtIdSelect = parseInt(e.target.value);
  }

  changeForestClientId(e) {
    this.fg.get('forestClient').setValue(e.target.value);
  }
}
