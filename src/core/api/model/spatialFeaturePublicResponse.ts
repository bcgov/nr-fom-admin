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
import { SubmissionTypeCode } from './submissionTypeCode';


export interface SpatialFeaturePublicResponse { 
    featureType: SpatialFeaturePublicResponse.FeatureTypeEnum;
    featureId: number;
    name: string;
    /**
     * Format: GeoJSON Geometry object
     */
    geometry: object;
    /**
     * Format: YYYY-MM-DD
     */
    plannedDevelopmentDate: string;
    plannedAreaHa: number;
    plannedLengthKm: number;
    submissionType: SubmissionTypeCode;
}
export namespace SpatialFeaturePublicResponse {
    export type FeatureTypeEnum = 'cut_block' | 'road_section' | 'retention_area';
    export const FeatureTypeEnum = {
        CutBlock: 'cut_block' as FeatureTypeEnum,
        RoadSection: 'road_section' as FeatureTypeEnum,
        RetentionArea: 'retention_area' as FeatureTypeEnum
    };
}


