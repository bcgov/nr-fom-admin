import { Component, Input } from '@angular/core';
// import { Comment } from 'app/models/comment';
import { PublicComment } from 'app/models/publiccomment';
import { ApiService } from 'app/services/api';
@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent {
  @Input() comment: PublicComment;

  constructor(
    public api: ApiService // used in template
  ) {}
}
