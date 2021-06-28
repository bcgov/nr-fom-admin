import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectResponse, ProjectService, PublicCommentAdminResponse, PublicCommentService } from 'core/api';

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

  constructor(    
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private commentSvc: PublicCommentService
  ) { }

  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.params.appId;
    this.getProject(this.projectId); 
    this.getpublicComments(this.projectId);
  }

  private async getProject(id: number) {
    this.projectSvc.projectControllerFindOne(this.projectId).toPromise()
        .then(
          (result) => {this.project = result;},
          (error) => {
            console.error(`Error retrieving Project for Summary Report:`, error);
            this.project = undefined;
            this.projectReqError = true;
          }
        );
  }

  private async getpublicComments(id: number) {
    this.commentSvc.publicCommentControllerFind(this.projectId).toPromise()
        .then(
          (result) => {this.publicComments = result; },
          (error) => {
            console.error(`Error retrieving Public Comments for Summary Report:`, error);
            this.publicComments = undefined;
            this.publicCommentsReqError = true;
          }
        );
  }

}

