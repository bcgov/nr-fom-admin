import {prop} from "@rxweb/reactive-form-validators"
import {PublicCommentAdminResponse, PublicCommentAdminUpdateRequest, ResponseCode} from "../../../../core/api";

const UPDATE_FIELDS = ['responseDetails', 'responseCode'] as const;

export class CommentDetailForm implements Pick<PublicCommentAdminUpdateRequest, typeof UPDATE_FIELDS[number]> {
  @prop()
  responseDetails: string = '';

  @prop()
  responseCode: string = '';

  constructor(comment: PublicCommentAdminResponse) {
  }

}
