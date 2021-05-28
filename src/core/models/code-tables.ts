import { DistrictResponse, ResponseCode, WorkflowStateCode } from 'core/api';

export interface CodeTables {
  responseCode: ResponseCode[],
  district: DistrictResponse[],
  workflowResponseCode: WorkflowStateCode[]
}
