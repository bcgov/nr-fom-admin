import {  prop } from "@rxweb/reactive-form-validators"
import { ProjectDto } from 'core/api';
import * as R from 'remeda';

const updateFields = [
  'name',
  'description',
  'commentingOpenDate',
  'commentingClosedDate',
  'fspId',
  'districtId',
  'forestClientNumber',
  'workflowStateCode',
] as const;

export class ApplicationAddEditForm implements Pick<ProjectDto,
 typeof updateFields[number]
> {

    @prop()
    name: string = '';


    @prop()

    description: string = '';

    @prop()

    commentingOpenDate: string = '';
    @prop()

    commentingClosedDate: string = '';
    @prop()

    fspId: number = 0;
    @prop()

    districtId: number = 0;
    @prop()

    forestClientNumber: string = '1101';
    @prop()

    workflowStateCode: string = 'INITIAL';

  constructor ( project?: Partial<ProjectDto> ) {
    if (project) Object.assign( this, R.pick(project, updateFields));
  }
}
