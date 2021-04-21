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
 * @interface ForestClientDto
 */
export interface ForestClientDto {
  /**
   * @type {number}
   * @memberof ForestClientDto
   */
  id: number;
  /**
   * @type {number}
   * @memberof ForestClientDto
   */
  revisionCount: number;
  /**
   * @type {string}
   * @memberof ForestClientDto
   */
  createTimestamp: string;
  /**
   * @type {string}
   * @memberof ForestClientDto
   */
  createUser: string;
  /**
   * @type {string}
   * @memberof ForestClientDto
   */
  updateTimestamp: string;
  /**
   * @type {string}
   * @memberof ForestClientDto
   */
  updateUser: string;
  /**
   * @type {string}
   * @memberof ForestClientDto
   */
  name: string;
}