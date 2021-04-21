import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {catchError } from 'rxjs/operators';

import { ApiService } from './api';

import { District } from 'app/models/district';



/**
 * Provides methods for working with Districts.
 *
 * @export
 * @class DistrictService
 */
@Injectable()
export class DistrictService {
  constructor(
    private api: ApiService
  ) {}


  /**
   * Get all districts.
   *
   * @returns {Observable<District[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<District[]> {


    let observables: Observable<District[]>;


      observables = this.api.getDistricts();

      return observables;
  }
}
