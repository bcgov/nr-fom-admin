import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractionResponse, InteractionService, ProjectResponse } from 'core/api';
import { ModalService } from 'core/services/modal.service';
import { StateService } from 'core/services/state.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InteractionDetailComponent } from './interaction-detail/interaction-detail.component';
import { InteractionRequest } from './interaction-detail/interaction-detail.form';

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
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.scss']
})
export class InteractionsComponent implements OnInit {

  @ViewChild('interactionDetailForm') 
  interactionDetailForm: InteractionDetailComponent;
  @ViewChild('interactionListScrollContainer', {read: ElementRef})
  public interactionListScrollContainer: ElementRef;
  
  projectId: number;
  project: ProjectResponse;
  selectedItem: InteractionResponse;
  loading = false;

  data$: Observable<InteractionResponse[]>;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private interactionSaved$ = new Subject(); // To notify when 'save' happen.

  constructor(    
    private route: ActivatedRoute,
    private interactionSvc: InteractionService,
    private modalSvc: ModalService,
    private stateSvc: StateService) 
  { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.appId;
    this.data$ = this.getProjectInteractions();

    this.interactionSaved$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.data$ = this.getProjectInteractions();
    });

    this.route.data
        .subscribe((data: { project: ProjectResponse}) => {
          this.project = data.project;
        });
  }

  getProjectInteractions() {
    return this.interactionSvc.interactionControllerFind(this.projectId);
  }

  onInteractionItemClicked(item: InteractionResponse, pos: number) {
    this.selectedItem = item;
    this.interactionDetailForm.selectedInteraction = item;
    if (pos) {
      // !! important to wait or will not see the effect.
      setTimeout(() => {
        this.interactionListScrollContainer.nativeElement.scrollTop = pos;
      }, 150);
    }
  }

  addEmptyInteractionDetail() {
    this.selectedItem = null;
    this.interactionDetailForm.selectedInteraction = {} as InteractionResponse;
  }

  async saveInteraction(saveReq: InteractionRequest, selectedInteraction: InteractionResponse) {
    const {id} = selectedInteraction;
    const resultPromise = this.prepareSaveRequest(id, this.projectId, saveReq, selectedInteraction);
    resultPromise
      .then((result) => this.handelSaveSuccess(result))
      .catch((err) => this.handelSaveError(err));
  }

  private prepareSaveRequest(id: number, projectId: number, saveReq: InteractionRequest, selectedInteraction: InteractionResponse)
          : Promise<InteractionResponse> {
    let resultPromise: Promise<InteractionResponse>;
    if (!id) {
      resultPromise = this.interactionSvc.interactionControllerCreate(saveReq.fileContent, projectId,
        saveReq.stakeholder,
        saveReq.communicationDate,
        saveReq.communicationDetails,
        saveReq.filename).toPromise();
    }
    else {
      saveReq.revisionCount = selectedInteraction.revisionCount;
      const id = selectedInteraction.id;
      resultPromise = this.interactionSvc.interactionControllerUpdate(id, saveReq.fileContent,
        this.projectId,
        saveReq.stakeholder,
        saveReq.communicationDate,
        saveReq.communicationDetails,
        saveReq.revisionCount,
        saveReq.filename).toPromise();
    }
    return resultPromise;
  }

  private handelSaveSuccess(result: any) {
    const pos = this.interactionListScrollContainer.nativeElement.scrollTop;
    this.interactionSaved$.next();
    this.selectedItem = result; // updated selected.
    this.loading = false;
    setTimeout(() => {
      this.onInteractionItemClicked(this.selectedItem, pos);
    }, 300);
  }

  private handelSaveError(err: any) {
    // disable below, let interceptor to show error for now.
    // this.modalSvc.openDialog({data: {...ERROR_DIALOG, message: 'Failed to update', title: ''}})
    console.error('Failed to save', err);
    this.loading = false;
  }

}