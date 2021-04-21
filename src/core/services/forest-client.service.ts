import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ForestClientDto,
  ForestClientApi as RxJsForestClientApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with ForestClients.
 *
 * @export
 * @class ForestClientService
 */
@Injectable()
export class ForestClientService implements IAbstractService<ForestClientDto> {
  protected forestClientApi: RxJsForestClientApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private forestClientApi: RxJsForestClientApi
  ) {
    try {
      // @ts-ignore
      this.forestClientApi = new RxJsForestClientApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<ForestClientDto[]> {
    return this.forestClientApi.forestClientControllerFindAll();
  }
}
