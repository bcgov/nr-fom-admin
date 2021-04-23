import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {ResponseCodeDto} from 'core/api';
import {PublicComment} from 'core/models/publiccomment';
import {CommentDetailForm} from './comment-detail.form';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
  exportAs: 'commentForm'
})
export class CommentDetailComponent {
  commentFormGroup: FormGroup;
  comment: PublicComment;
  @Input() responseCodes: ResponseCodeDto[]

  @Input() set selectedComment(comment: PublicComment) {
    console.log(comment)
    const commentFormGroup = new CommentDetailForm(comment)
    this.commentFormGroup = this.formBuilder.group(commentFormGroup)
    this.comment = comment;
  };

  constructor(private formBuilder: RxFormBuilder) {
  }
}
