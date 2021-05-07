/**
 * FOM API
 * API for FOM backend
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DistrictDto } from './districtDto';
import { WorkflowStateCode } from './workflowStateCode';
import { ForestClientDto } from './forestClientDto';


export interface UpdateProjectDto { 
    revisionCount: number;
    createTimestamp: string;
    createUser: string;
    updateTimestamp: string;
    updateUser: string;
    name: string;
    description: string;
    commentingOpenDate: string;
    commentingClosedDate: string;
    geojson: object;
    fspId: number;
    districtId: number;
    district: DistrictDto;
    forestClientNumber: string;
    forestClient: ForestClientDto;
    workflowStateCode: string;
    workflowState: WorkflowStateCode;
}

