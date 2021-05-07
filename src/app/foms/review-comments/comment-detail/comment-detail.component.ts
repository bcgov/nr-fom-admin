import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {ResponseCode} from 'core/api';
import {PublicCommentDto} from "core/api";
import {CommentDetailForm} from './comment-detail.form';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
  exportAs: 'commentForm'
})
export class CommentDetailComponent {
  commentFormGroup: FormGroup;
  comment: PublicCommentDto;
  @Input() responseCodes: ResponseCode[]

  @Input() set selectedComment(comment: PublicCommentDto) {
    console.log(comment)
    const commentFormGroup = new CommentDetailForm(comment)
    this.commentFormGroup = this.formBuilder.group(commentFormGroup)
    this.comment = comment;
  };

  constructor(private formBuilder: RxFormBuilder) {
  }
}
