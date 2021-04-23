import { DistrictDto, ResponseCodeDto, WorkflowStateCodeDto } from 'core/api';

export interface CodeTables {
  responseCode: ResponseCodeDto[],
  district: DistrictDto[],
  workflowResponseCode: WorkflowStateCodeDto[]
}
