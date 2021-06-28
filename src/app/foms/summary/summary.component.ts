import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractionResponse, InteractionService, ProjectResponse, ProjectService, PublicCommentAdminResponse, PublicCommentService, SpatialFeaturePublicResponse, SpatialFeatureService } from 'core/api';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  projectId: number;
  project: ProjectResponse;
  projectReqError: boolean;
  publicComments: PublicCommentAdminResponse[];
  publicCommentsReqError: boolean;
  spatialDetail: SpatialFeaturePublicResponse[];
  spatialDetailReqError: boolean;
  interactions: InteractionResponse[]
  interactionsReqError: boolean;

  constructor(    
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private commentSvc: PublicCommentService,
    private spatialFeatureSvc: SpatialFeatureService,
    private interactionSvc: InteractionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.params.appId;
    this.getProject(this.projectId); 
    this.getpublicComments(this.projectId);
    this.getSpatialDetails(this.projectId);
    this.getProjectInteractions(this.projectId);
  }

  private async getProject(projectId: number) {
    this.projectSvc.projectControllerFindOne(projectId).toPromise()
        .then(
          (result) => {this.project = result;},
          (error) => {
            console.error(`Error retrieving Project for Summary Report:`, error);
            this.project = undefined;
            this.projectReqError = true;
          }
        );
  }

  private async getpublicComments(projectId: number) {
    this.commentSvc.publicCommentControllerFind(projectId).toPromise()
        .then(
          (result) => {this.publicComments = result;},
          (error) => {
            console.error(`Error retrieving Public Comments for Summary Report:`, error);
            this.publicComments = undefined;
            this.publicCommentsReqError = true;
          }
        );
  }

  private async getSpatialDetails(projectId: number) {
    this.spatialFeatureSvc.spatialFeatureControllerGetForProject(projectId).toPromise()
    .then(
      (result) => {this.spatialDetail = result;},
      (error) => {
        console.error(`Error retrieving Spatil Details for Summary Report:`, error);
        this.spatialDetail = undefined;
        this.spatialDetailReqError = true;
      }
    );
  }

  private async getProjectInteractions(projectId: number) {
    this.interactionSvc.interactionControllerFind(projectId).toPromise()
    .then(
      (result) => {this.interactions = result;},
      (error) => {
        console.error(`Error retrieving Project Interactions for Summary Report:`, error);
        this.interactions = undefined;
        this.interactionsReqError = true;
      }
    );
  }

}

