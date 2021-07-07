import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import {of, Subject, throwError} from 'rxjs';
// @ts-ignore
import {concat, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {
  AttachmentResponse,
  WorkflowStateEnum,
  ProjectWorkflowStateChangeRequest, SubmissionService
} from "core/api";

import {ProjectResponse, ProjectService, SpatialFeaturePublicResponse} from 'core/api';
import { KeycloakService } from 'core/services/keycloak.service';
import { User } from 'core/services/user';
import { ModalService } from 'core/services/modal.service';
import * as moment from 'moment';
import {AttachmentResolverSvc} from "../../../core/services/AttachmentResolverSvc";


@Component({
  selector: 'app-application-detail',
  templateUrl: './fom-detail.component.html',
  styleUrls: ['./fom-detail.component.scss']
})
export class FomDetailComponent implements OnInit, OnDestroy {
  public isPublishing = false;
  public isDeleting = false;
  public isFinalizing = false;
  public isRefreshing = false;
  public application: ProjectResponse = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public project: ProjectResponse = null;
  public spatialDetail: SpatialFeaturePublicResponse[];
  public isProjectActive = false;
  public attachments: AttachmentResponse[] = [];
  public user: User;
  public daysRemaining: number = null;
  private workflowStateChangeRequest: ProjectWorkflowStateChangeRequest = <ProjectWorkflowStateChangeRequest>{};
  private now = new Date();
  private today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalSvc: ModalService,
    public projectService: ProjectService, // also used in template
    private submissionSvc: SubmissionService,
    private keycloakService: KeycloakService,
    public attachmentResolverSvc: AttachmentResolverSvc
  ) {
    this.user = this.keycloakService.getUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // get data from route resolver
    this.route.data
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: { application: ProjectResponse, spatialDetail: Array<SpatialFeaturePublicResponse> }) => {
      if (data.application) {
        this.project = data.application;
        if (this.project.workflowState['code'] === 'INITIAL') {
          this.isProjectActive = true;
        }
      } else {
        alert("Uh-oh, couldn't load fom");
        // application not found --> navigate back to search
        this.router.navigate(['/search']);
      }

      this.spatialDetail = data.spatialDetail;
      this.calculateDaysRemaining();
      this.attachmentResolverSvc.getAttachments(this.project.id)
        .then( (result) => {
          this.attachments = result;
        }).catch((error) => {
        console.log('Error: ', error);
      });
    });

    this.verifyPublishingReady();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
          return this.onSuccess();
        }).catch( (error) => {
          console.log('Error:', error);
        })
      }
    })
  }

  onSuccess() {
    this.router.navigate([`a/${this.project.id}`])
      .then( () => {
        window.location.reload();
      })
  }

  deleteFOM() {
    const dialogRef = this.modalSvc.openDialog({
      data: {
        message: `You are about to withdraw FOM with id ${this.project.id}. Are you sure?`,
        title: 'Withdraw FOM',
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}, cancel: { text: 'cancel' }}
      }
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isDeleting = true;
        this.projectService.projectControllerRemove(this.project.id)
        .subscribe(
          ()=> {
            this.isDeleting = false;
            this.router.navigate(['/search']); // Delete successfully, back to search.
          },
          (error) => {
            this.isDeleting = false;
            console.error(error);
          }
        );
      }
    })
  }

  finalizeFOM() {
    const dialogRef = this.modalSvc.openDialog({
      data: {
        message: `You are about to finalize FOM with id ${this.project.id}. Are you sure?`,
        title: 'Finalize FOM',
        width: '340px',
        height: '200px',
        buttons: {confirm: {text: 'OK'}, cancel: { text: 'cancel' }}
      }
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isFinalizing = true;
        this.projectService.projectControllerStateChange(
            this.project.id, 
            {
              workflowStateCode: WorkflowStateEnum.Finalized, 
              revisionCount: this.project.revisionCount
            }
        )
        .subscribe(
          (result)=> {
            this.isFinalizing = false;
            this.onSuccess();
          },
          (error) => {
            this.isFinalizing = false;
            console.error(error);
          }
        );
      }
    })
  }

  private calculateDaysRemaining(){
    this.daysRemaining =
      moment(this.project.commentingClosedDate).diff(moment(this.today), 'days');
    if(this.daysRemaining < 0){
      this.daysRemaining = 0;
    }
  }

  public verifyPublishingReady(){
      return this.project.commentingOpenDate && this.spatialDetail
        && this.spatialDetail.length > 0
        && this.project.workflowState.code === WorkflowStateEnum.Initial;

  }

  public async publishFOM(){
    if(moment(this.project.commentingOpenDate).diff(moment(this.today), 'days') < 1){
      this.modalSvc.openDialog({
        data: {
          message: 'Comment Start Date must be at least one day after "Publish" is pushed.',
          title: '',
          width: '340px',
          height: '200px',
          buttons: {confirm: {text: 'OK'}}
        }
      })
    }else {
      this.workflowStateChangeRequest.workflowStateCode = WorkflowStateEnum.Published;
      this.workflowStateChangeRequest.revisionCount = this.project.revisionCount;

      const result = await this.projectService.projectControllerStateChange(this.project.id, this.workflowStateChangeRequest).pipe(tap(obs => console.log(obs))).toPromise()
      const {id} = result;
      if (!id) {
      }
      this.onSuccess()
    }

  }


  /**
    INITIAL: holder can withdraw.
    PUBLISH/COMMENT_OPEN: no actions.
    COMMENT_CLOSED/FINALIZED/EXPIRED: gov
  */
  public canWithdraw() {
    const workflowStateCode = this.project.workflowState.code;
    if (WorkflowStateEnum.Initial === workflowStateCode) {
      return this.user.isAuthorizedForClientId(this.project.forestClient.id);
    }
    else if (!this.user.isMinistry) {
      return false;
    }

    return [WorkflowStateEnum.CommentClosed, WorkflowStateEnum.Finalized, WorkflowStateEnum.Expired]
            .includes(workflowStateCode as WorkflowStateEnum);
  }

  public canFinalize() {
    return this.project.workflowState.code === WorkflowStateEnum.CommentClosed;
  }

  public canAccessComments(): boolean {
    const userCanView = this.user.isMinistry || this.user.isAuthorizedForClientId(this.project.forestClient.id);
    return userCanView && (this.project.workflowState.code !== WorkflowStateEnum.Initial 
                        && this.project.workflowState.code !== WorkflowStateEnum.Published);
  }

  public canAccessInteractions(): boolean {
    return this.canAccessComments(); // same as comments for access/viewing.
  }

  public isSubmissionAllowed(){
    return this.project.workflowState.code === WorkflowStateEnum.Initial
      || this.project.workflowState.code === WorkflowStateEnum.CommentClosed ;
  }

  /*
  * Only allows Supporting_Doc to be deleted in the defined states
  */
  public isDeleteAttachmentAllowed(attachment: AttachmentResponse) {
    return this.attachmentResolverSvc.isDeleteAttachmentAllowed(this.project.workflowState.code, attachment);
  }

}
