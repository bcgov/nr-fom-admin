// import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import * as moment from 'moment';

import {
  DistrictResponse,
  ProjectResponse,
  ProjectService,
  ForestClientResponse,
  ForestClientService,
  AttachmentService,
  ProjectCreateRequest, WorkflowStateEnum, AttachmentResponse
} from 'core/api';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomAddEditForm} from './fom-add-edit.form';
import {StateService} from 'core/services/state.service';
import {ModalService} from 'core/services/modal.service';
import {AttachmentUploadService} from "../../../core/utils/attachmentUploadService";
import { AttachmentTypeEnum } from "../../../core/models/attachmentTypeEnum";
import {User} from "../../../core/services/user";
import {KeycloakService} from "../../../core/services/keycloak.service";
import {AttachmentResolverSvc} from "../../../core/services/AttachmentResolverSvc";

export type ApplicationPageType = 'create' | 'edit';

@Component({
  selector: 'app-application-add-edit',
  templateUrl: './fom-add-edit.component.html',
  styleUrls: ['./fom-add-edit.component.scss'],
  providers: [DatePipe]
})
export class FomAddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  fg: RxFormGroup;
  state: ApplicationPageType;
  originalProjectResponse: ProjectResponse;

  get isCreate() {
    return this.state === 'create';
  }
  districts: DistrictResponse[] = this.stateSvc.getCodeTable('district');
  forestClients: ForestClientResponse[] = [];
  // public project: ProjectResponse = null;
  public supportingDocuments: any[] = [];
  public initialPublicDocument: any[] = [];
  private scrollToFragment: string = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public districtIdSelect: any = null;
  public forestClientSelect: any = null;
  public isPublishState: boolean = false;
  files: any[] = [];
  publicNoticeContent: any;
  supportingDocContent: any;
  public isSubmitSaveClicked = false;
  public descriptionValue: string = null;
  public user: User;
  public attachments: AttachmentResponse[] = [];
  public attachmentsInitialNotice: AttachmentResponse[] = [];
  public isDeleting = false;
  public fileTypesParentInitial: string[] =
    ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff',
      'image/x-tiff', 'application/pdf']

  public fileTypesParentSupporting: string[] =
    ['application/pdf', 'image/jpg', 'image/jpeg', 'text/csv', 'image/png', 'text/plain',
     'application/rtf', 'image/tiff', 'application/msword',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

  get isLoading() {
    return this.stateSvc.loading;
  }

  // Access to XMLHttpRequest at 'localhost:3333/api/project' from origin 'http://localhost:4200' has been blocked by
  // CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension,
  // chrome-untrusted, https.

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private projectSvc: ProjectService,
    public attachmentResolverSvc: AttachmentResolverSvc,
    private attachmentUploadSvc: AttachmentUploadService,
    private formBuilder: RxFormBuilder,
    public stateSvc: StateService,
    private modalSvc: ModalService,
    private datePipe: DatePipe,
    private  forestSvc: ForestClientService,
    private keycloakService: KeycloakService,
  ) {
    this.user = this.keycloakService.getUser();
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
        if (data.district) {
          this.districtIdSelect = this.originalProjectResponse.district.id;
        }

        this.forestClientSelect = this.originalProjectResponse.forestClient.id;

        this.isPublishState = this.originalProjectResponse.workflowState.code === WorkflowStateEnum.Published;

        this.attachmentResolverSvc.getAttachments(this.originalProjectResponse.id)
          .then( (result) => {
            for(const attachmentResponse of result ) {
              if(attachmentResponse.attachmentType.code === AttachmentTypeEnum.PUBLIC_NOTICE)
                this.attachmentsInitialNotice.push(attachmentResponse);
              else
                this.attachments.push(attachmentResponse);
            }
          }).catch((error) => {
          console.log('Error: ', error);
        });
      }
      const form = new FomAddEditForm(data);
      this.fg = <RxFormGroup>this.formBuilder.formGroup(form);

      // Converting commentingOpenDate date to 'yyyy-MM-dd'
      let datePipe = this.datePipe.transform(this.fg.value.commentingOpenDate,'yyyy-MM-dd');
      this.fg.get('commentingOpenDate').setValue(datePipe);
      // Converting commentingClosedDate date to 'yyyy-MM-dd'
      datePipe = this.datePipe.transform(this.fg.value.commentingClosedDate,'yyyy-MM-dd');
      this.fg.get('commentingClosedDate').setValue(datePipe);

      this.fg.get('district').setValue(this.districtIdSelect);
        if(data.description) {
        this.descriptionValue = data.description;
      }

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

  addNewFileInitialPublic(newFiles: any[]) {
    this.initialPublicDocument.push(newFiles);
  }

  addNewFileSupporting(newFiles: any[]) {
    this.supportingDocuments.push(newFiles);
  }

  getContentFileFromUpload(fileContent: any) {
    this.publicNoticeContent = fileContent;
    try {
      // this.originalSubmissionRequest.jsonSpatialSubmission = JSON.parse(this.contentFile);
      console.log('inside getContenFileParent: ', this.publicNoticeContent)
    }catch (e) {
      this.modalSvc.openDialog({
        data: {
          message: 'Your file is broken. Please review the Geo Spatial data',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
    }
    // this.fg.get('jsonSpatialSubmission').setValue(this.originalSubmissionRequest.jsonSpatialSubmission);
  }

  getContentFileSupportingDoc(fileContent: any) {
    this.supportingDocContent = fileContent;
    try {
      // this.originalSubmissionRequest.jsonSpatialSubmission = JSON.parse(this.contentFile);
      console.log('inside getContenFileParent: ', this.publicNoticeContent)
    }catch (e) {
      this.modalSvc.openDialog({
        data: {
          message: 'Your file is broken. Please review the Geo Spatial data',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
    }
    // this.fg.get('jsonSpatialSubmission').setValue(this.originalSubmissionRequest.jsonSpatialSubmission);
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

  validate() {
    if (!this.fg.valid) {
      this.fg.markAllAsTouched();
      this.fg.updateValueAndValidity({onlySelf: false, emitEvent: true});
      this.modalSvc.openDialog({
        data: {
          message: 'Please review the highlighted fields ',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
    }


    return this.fg.valid;
  }

  async submit() {
    this.isSubmitSaveClicked = true;
    this.validate();
    if (!this.fg.valid) return;
    if (this.stateSvc.loading) return;
    let projectCreate = this.fg.value as ProjectCreateRequest
    projectCreate['districtId'] = this.districtIdSelect;
    projectCreate.forestClientNumber = this.fg.get('forestClient').value;

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
    this.isSubmitSaveClicked = true;
    if(!this.descriptionValue){
      this.fg.get('description').setErrors({incorrect: true})
      console.log('saving desc: ', this.descriptionValue)
    }
    this.validate();
    const {id, forestClient, workflowState, ...rest} = this.originalProjectResponse;
    let projectUpdateRequest = {...rest, ...this.fg.value}
    projectUpdateRequest['districtId'] = projectUpdateRequest.district;

    if (!this.fg.valid) return;
    try {
      const result = await this.projectSvc.projectControllerUpdate(id, projectUpdateRequest).pipe(tap(obs => console.log(obs))).toPromise();

      let resultAttachment: Observable<any>;
      let file: any = null;
      let fileContent: any = null;

      if(this.initialPublicDocument.length > 0){
        file = this.initialPublicDocument[0];
        fileContent = new Blob([this.publicNoticeContent], {type: file.type});

        resultAttachment = await this.attachmentUploadSvc
          .attachmentCreate(file, fileContent, id,
            AttachmentTypeEnum.PUBLIC_NOTICE).pipe(tap(obs => console.log(obs))).toPromise();

      }

      if (this.supportingDocuments.length > 0){
        file = this.supportingDocuments[0];
        fileContent = new Blob([this.supportingDocContent], {type: file.type});
        resultAttachment = await this.attachmentUploadSvc
          .attachmentCreate(file, fileContent, id,
            AttachmentTypeEnum.SUPPORTING_DOC).pipe(tap(obs => console.log(obs))).toPromise();
      }

      if (result) {
      // if (resultAttachment) {
        return this.onSuccess(id);
      }
      this.modalSvc.openDialog({
        data: {
          message: 'There was an error with the request please try again',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
    } catch (err) {
      // console.log(err)
    }

  }

  changeDistrictId(e) {
    this.fg.get('district').setValue(parseInt(e.target.value));
    this.districtIdSelect = parseInt(e.target.value);
  }

  changeForestClientId(e) {
    this.fg.get('forestClient').setValue(e.target.value);
    this.forestClientSelect = parseInt(e.target.value);
  }

  changeDescription(e) {
    this.descriptionValue = e.target.value;
    if(!this.descriptionValue && !this.isCreate){
      this.fg.get('description').setErrors({incorrect: true})
    }
  }

  /*
  * Closed Date cannot be shortened if FOM status is in 'Commenting Open", unless
  * the user is Ministry.
  */
  validateClosedDate(value: Date): void {
    if ( this.originalProjectResponse.workflowState.code === WorkflowStateEnum.CommentOpen
      && !this.user.isMinistry) {
      let date = value.toISOString();
      let result = moment(date)
        .diff(moment(this.originalProjectResponse.commentingClosedDate), 'days');
      if (result < 0 ) {
        this.modalSvc.openDialog({
          data: {
            message: 'Closed Date cannot be shortened when FOM is in "Commenting Open" state',
            title: '',
            width: '340px',
            height: '200px',
            buttons: {confirm: {text: 'OK'}}
          }
        })
        this.fg.get('commentingClosedDate').setValue(this.originalProjectResponse.commentingClosedDate);
      }
    }
  }

  public isCreateAttachmentAllowed() {
    return this.originalProjectResponse.workflowState.code === WorkflowStateEnum.Initial
    || this.originalProjectResponse.workflowState.code === WorkflowStateEnum.CommentOpen
    || this.originalProjectResponse.workflowState.code === WorkflowStateEnum.CommentClosed
  }

  public deleteAttachment(id: number) {
    const dialogRef = this.modalSvc.openDialog({
      data: {
        message: `You are about to delete this attachment. Are you sure?`,
        title: 'Delete Attachment',
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}, cancel: { text: 'cancel' }}
      }
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        let result = this.attachmentResolverSvc.attachmentControllerRemove(id);
        result.then( () => {
          return this.onSuccessAttachment(this.originalProjectResponse.id);
        }).catch( (error) => {
          console.log('Error:', error);
        })
      }
    })
  }

  onSuccessAttachment(id: number) {
    this.router.navigate([`a/${id}/edit`])
      .then( () => {
        window.location.reload();
      })

  }

  /*
* Only allows Supporting_Doc to be deleted in the defined states
*/
  public isDeleteAttachmentAllowed(attachment: AttachmentResponse) {
    return this.attachmentResolverSvc.isDeleteAttachmentAllowed(this.originalProjectResponse.workflowState.code, attachment);
  }


}
