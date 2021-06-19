import {prop, required} from "@rxweb/reactive-form-validators"
import { InteractionResponse } from "core/api";
import * as R from 'remeda';

const UPDATE_FIELDS = ['stakeholder', 'communicationDate', 'communicationDetails'] as const;

export class InteractionDetailForm implements Pick<InteractionRequest, typeof UPDATE_FIELDS[number]> {
  @prop()
  stakeholder: string = '';

  @prop()
  communicationDate: string = '';

  @prop()
  communicationDetails: string = '';

  constructor(interaction: InteractionResponse) {
    if (interaction) {
      Object.assign(this, R.pick(interaction, UPDATE_FIELDS));
    }
  }

}

export interface InteractionRequest { 
  projectId: number;
  stakeholder: string;
  communicationDate: string;
  communicationDetails: string;
  revisionCount: number;
}
