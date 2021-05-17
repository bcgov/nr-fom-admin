import { DistrictDto, ResponseCode, WorkflowStateCode } from 'core/api';

export interface CodeTables {
  responseCode: ResponseCode[],
  district: DistrictDto[],
  workflowResponseCode: WorkflowStateCode[]
}
