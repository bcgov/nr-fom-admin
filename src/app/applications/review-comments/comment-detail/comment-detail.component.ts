import { Component, Input } from '@angular/core';
import { PublicComment } from 'core/models/publiccomment';
@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent {
  @Input() comment: PublicComment;

  constructor() {}
}
