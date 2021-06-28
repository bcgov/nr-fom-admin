import { Component, Input, OnInit } from '@angular/core';
import { PublicCommentAdminResponse, ResponseCodeEnum } from 'core/api';
import { StateService } from 'core/services/state.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent implements OnInit {

  commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');
  publicComments: PublicCommentAdminResponse[] = [];
  addressedPcs: PublicCommentAdminResponse[] = [];
  consideredPcs: PublicCommentAdminResponse[] = [];
  irrelevantPcs: PublicCommentAdminResponse[] = [];
  noResponsePcs: PublicCommentAdminResponse[] = [];

  @Input() 
  requestError: boolean

  constructor(private stateSvc: StateService) { }

  ngOnInit(): void { }

  @Input() set publicCommentDetails(publicComments: PublicCommentAdminResponse[]) {
    this.publicComments = publicComments;
    this.publicComments.forEach((comment)=> {
      const item = Object.assign({}, comment); // JSON.parse(JSON.stringify(comment))
      if (comment.response?.code === ResponseCodeEnum.Addressed) {
        this.addressedPcs.push(item);
      }
      else if (comment.response?.code === ResponseCodeEnum.Considered) {
        this.consideredPcs.push(item);
      }
      else if (comment.response?.code === ResponseCodeEnum.Irrelevant) {
        this.irrelevantPcs.push(item);
      }
      else {
        this.noResponsePcs.push(item)
      }
    });
  }

}
