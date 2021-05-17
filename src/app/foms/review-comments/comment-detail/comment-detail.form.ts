import {PublicComment} from '../../../../core/models/publiccomment';
import {prop} from "@rxweb/reactive-form-validators"
import {PublicCommentDto} from "../../../../core/api";

const UPDATE_FIELDS = ['responseDetails', 'responseCode'] as const;

export class CommentDetailForm implements Pick<PublicCommentDto, typeof UPDATE_FIELDS[number]> {
  @prop()
  responseDetails: string = '';

  @prop()
  responseCode: string = '';

  constructor(comment: PublicCommentDto) {
    const {responseCode, responseDetails} = comment || {}
    if (comment) {
      this.responseCode = responseCode;
      this.responseDetails = responseDetails;
    }

  }

}
