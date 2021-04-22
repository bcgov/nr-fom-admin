import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ResponseCodeDto,
  ResponseCodeApi as RxJsResponseCodeApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with ResponseCodes.
 *
 * @export
 * @class ResponseService
 */
@Injectable()
export class ResponseService implements IAbstractService<ResponseCodeDto> {
  protected responseCodeApi: RxJsResponseCodeApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private responseCodeApi: RxJsResponseCodeApi
  ) {
    try {
      // @ts-ignore
      this.responseCodeApi = new RxJsResponseCodeApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<ResponseCodeDto[]> {
    return this.responseCodeApi.responseCodeControllerFindAll();
  }
}
