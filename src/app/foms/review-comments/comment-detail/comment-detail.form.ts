import {prop} from "@rxweb/reactive-form-validators"
import {PublicCommentAdminResponse, ResponseCode} from "../../../../core/api";

const UPDATE_FIELDS = ['responseDetails', 'response'] as const;

export class CommentDetailForm implements Pick<PublicCommentAdminResponse, typeof UPDATE_FIELDS[number]> {
  @prop()
  responseDetails: string = '';

  @prop()
  response: ResponseCode;

  constructor(comment: PublicCommentAdminResponse) {
    const {response, responseDetails} = comment || {}
    if (comment) {
      this.response = response;
      this.responseDetails = responseDetails;
    }

  }

}
