import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DistrictDto,
  DistrictApi as RxJsDistrictApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with Districts.
 *
 * @export
 * @class DistrictService
 */
@Injectable()
export class DistrictService implements IAbstractService<DistrictDto> {
  protected districtApi: RxJsDistrictApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private districtApi: RxJsDistrictApi
  ) {
    try {
      // @ts-ignore
      this.districtApi = new RxJsDistrictApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  /**
   * Get all districts.
   *
   * @returns {Observable<District[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<DistrictDto[]> {
    return this.districtApi.districtControllerFindAll();
  }
}
