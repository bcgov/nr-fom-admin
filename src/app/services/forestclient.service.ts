import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {catchError } from 'rxjs/operators';

import { ApiService } from './api';

import { ForestClient } from 'app/models/forestclient';



/**
 * Provides methods for working with ForestClient.
 *
 * @export
 * @class ForestClientService
 */
@Injectable()
export class ForestClientService {
  constructor(
    private api: ApiService
  ) {}


  /**
   * Get all districts.
   *
   * @returns {Observable<ForestClient[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<ForestClient[]> {


    let observables: Observable<ForestClient[]>;


      observables = this.api.getForestClients();

      return observables;
  }
}
