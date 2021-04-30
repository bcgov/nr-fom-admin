import {minLength, prop, required} from '@rxweb/reactive-form-validators';
import {ProjectDto} from 'core/api';
import * as R from 'remeda';

const updateFields = [
  'name',
  'description',
  'commentingOpenDate',
  'commentingClosedDate',
  'fspId',
  'districtId',
  'forestClientNumber',
  'workflowStateCode'
] as const;

export class FomAddEditSubmissionForm implements Pick<ProjectDto,
  typeof updateFields[number]> {

  @prop()
  @required()
  @minLength({value: 5})
  name: string;


  @prop()
  @required()
  @minLength({value: 25})
  description: string;

  @prop()
  commentingOpenDate: string = new Date().toISOString();

  @prop({})
  commentingClosedDate: string = new Date().toISOString();

  @prop()
  @required()
  @minLength({value: 1})

  fspId: number;

  @prop()
  @required()
  @minLength({value: 1})

  districtId: number;

  @prop()
  @required()

  @minLength({value: 1})
  forestClientNumber: string;

  @prop()
  @required()

  workflowStateCode: string = 'INITIAL';

  constructor(project?: Partial<ProjectDto>) {
    if (project) {


      Object.assign(this, R.pick(project, updateFields));
    }
  }

}
