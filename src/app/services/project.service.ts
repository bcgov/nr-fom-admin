import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {catchError } from 'rxjs/operators';

import { ApiService } from './api';

import { Project } from 'app/models/project';



/**
 * Provides methods for working with Applications.
 *
 * @export
 * @class ProjectService
 */
@Injectable()
export class ProjectService {
  constructor(
    private api: ApiService
  ) {}

  // /**
  //  * Get applications count.
  //  *
  //  * @param {IApplicationQueryParamSet} [queryParams={ isDeleted: false }]
  //  * @memberof ProjectService
  //  */
  // getCount(queryParamSets: IApplicationQueryParamSet[] = null): Observable<number> {
  //   if (!queryParamSets || !queryParamSets.length) {
  //     queryParamSets = [{ isDeleted: false }];
  //   }

  //   const observables: Array<Observable<number>> = queryParamSets.map(queryParamSet =>
  //     this.api.getCountApplications(queryParamSet).pipe(catchError(this.api.handleError))
  //   );

  //   return combineLatest(observables, (...args: number[]) => args.reduce((sum, arg) => (sum += arg))).pipe(
  //     catchError(this.api.handleError)
  //   );
  // }

  /**
   * Get all projects.
   *
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<Project[]> {
    // first get just the applications
    // return this.api.getApplications(queryParamSets).pipe(
    //   mergeMap(apps => {
    //     if (!apps || apps.length === 0) {
    //       // NB: forkJoin([]) will complete immediately
    //       // so return empty observable instead
    //       return of([] as Application[]);
    //     }
    //     const observables: Array<Observable<Application>> = [];
    //     apps.forEach(app => {
    //       // now get the rest of the data for each application
    //       observables.push(this._getExtraAppData(new Application(app), dataParams || {}));
    //     });
    //     return forkJoin(observables);
    //   }),
    //   catchError(error => this.api.handleError(error))
    // );

    let observables: Observable<Project[]>;


      observables = this.api.getProjects();

      return observables;
  }
}
