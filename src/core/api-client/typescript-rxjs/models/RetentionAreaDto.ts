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
 * @interface RetentionAreaDto
 */
export interface RetentionAreaDto {
  /**
   * @type {number}
   * @memberof RetentionAreaDto
   */
  id: number;
  /**
   * @type {number}
   * @memberof RetentionAreaDto
   */
  revisionCount: number;
  /**
   * @type {string}
   * @memberof RetentionAreaDto
   */
  createTimestamp: string;
  /**
   * @type {string}
   * @memberof RetentionAreaDto
   */
  createUser: string;
  /**
   * @type {string}
   * @memberof RetentionAreaDto
   */
  updateTimestamp: string;
  /**
   * @type {string}
   * @memberof RetentionAreaDto
   */
  updateUser: string;
  /**
   * @type {object}
   * @memberof RetentionAreaDto
   */
  geometry: object;
  /**
   * @type {number}
   * @memberof RetentionAreaDto
   */
  plannedAreaHa: number;
  /**
   * @type {number}
   * @memberof RetentionAreaDto
   */
  submissionId: number;
}