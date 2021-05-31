import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {CommentScopeCode, ResponseCode} from 'core/api';
import {PublicCommentAdminResponse} from "core/api";
import { StateService } from 'core/services/state.service';
import * as _ from 'lodash';
import {CommentDetailForm} from './comment-detail.form';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
  exportAs: 'commentForm'
})
export class CommentDetailComponent {
  commentScopeCodes: _.Dictionary<CommentScopeCode>;
  commentFormGroup: FormGroup;
  comment: PublicCommentAdminResponse;
  @Input() responseCodes: ResponseCode[]

  @Input() set selectedComment(comment: PublicCommentAdminResponse) {
    const commentFormGroup = new CommentDetailForm(comment)
    this.commentFormGroup = this.formBuilder.group(commentFormGroup)
    this.comment = comment;
  };

  constructor(private formBuilder: RxFormBuilder, private stateSvc: StateService) {
    this.commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');
  }
}
