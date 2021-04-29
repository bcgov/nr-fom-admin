import {PublicComment} from '../../../../core/models/publiccomment';
import {prop} from "@rxweb/reactive-form-validators"

const UPDATE_FIELDS = ['responseDetails', 'responseCode'] as const;

export class CommentDetailForm implements Pick<PublicComment, typeof UPDATE_FIELDS[number]> {
  @prop()
  responseDetails: string = '';

  @prop()
  responseCode: string = '';

  constructor(comment: PublicComment) {
    const {responseCode, responseDetails} = comment || {}
    if (comment) {
      this.responseCode = responseCode;
      this.responseDetails = responseDetails;
    }

  }

}
