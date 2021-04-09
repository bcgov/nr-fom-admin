// tslint:disable
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

/**
 * @export
 * @interface UpdateRetentionAreaDto
 */
export interface UpdateRetentionAreaDto {
  /**
   * @type {number}
   * @memberof UpdateRetentionAreaDto
   */
  revisionCount: number;
  /**
   * @type {string}
   * @memberof UpdateRetentionAreaDto
   */
  createTimestamp: string;
  /**
   * @type {string}
   * @memberof UpdateRetentionAreaDto
   */
  createUser: string;
  /**
   * @type {string}
   * @memberof UpdateRetentionAreaDto
   */
  updateTimestamp: string;
  /**
   * @type {string}
   * @memberof UpdateRetentionAreaDto
   */
  updateUser: string;
  /**
   * @type {object}
   * @memberof UpdateRetentionAreaDto
   */
  geometry: object;
  /**
   * @type {number}
   * @memberof UpdateRetentionAreaDto
   */
  plannedAreaHa: number;
  /**
   * @type {number}
   * @memberof UpdateRetentionAreaDto
   */
  submissionId: number;
}