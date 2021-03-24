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

  /**
   * Get all projects.
   *
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<Project[]> {

    let observables: Observable<Project[]>;


      observables = this.api.getProjects();

      return observables;
  }

  /**
   * Get all projects by FspId.
   *
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
    getProjectsByFspId(fspId: string): Observable<Project[]> {

    let observables: Observable<Project[]>;

    observables = this.api.getProjectsByFspId(fspId);

    return observables;

    }

  /**
   * Get project by id.
   *
   * @returns {Observable<Project>}
   * @memberof ProjectService
   */
    getProjectById(projectId: string): Observable<Project> {

    let observable: Observable<Project>;

    observable = this.api.getProjectById(projectId);

    return observable;
  }
}
