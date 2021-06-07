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
import { AttachmentTypeCode } from './attachmentTypeCode';


export interface AttachmentResponse { 
    id: number;
    projectId: number;
    fileName: string;
    attachmentType: AttachmentTypeCode;
}

