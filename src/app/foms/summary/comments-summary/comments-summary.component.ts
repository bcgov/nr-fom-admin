import { Component, Input, OnInit } from '@angular/core';
import { PublicCommentAdminResponse } from 'core/api';
import { StateService } from 'core/services/state.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-comments-summary',
  templateUrl: './comments-summary.component.html',
  styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent implements OnInit {

  commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');

  @Input() 
  publicComments: PublicCommentAdminResponse[];
  @Input() 
  requestError: boolean

  constructor(private stateSvc: StateService) { }

  ngOnInit(): void { 
    console.log("comments:", this.publicComments)
  }

}
