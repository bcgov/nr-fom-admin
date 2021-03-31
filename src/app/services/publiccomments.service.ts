import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {catchError } from 'rxjs/operators';

import { ApiService } from './api';

import { PublicComment } from 'app/models/publiccomment';



/**
 * Provides methods for working with PublicComment.
 *
 * @export
 * @class PublicCommentService
 */
@Injectable()
export class PublicCommentService {
  constructor(
    private api: ApiService
  ) {}


  /**
   * Get all PublicComment.
   *
   * @returns {Observable<PublicComment[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<PublicComment[]> {


    let observables: Observable<PublicComment[]>;


      observables = this.api.getPublicComments();

      return observables;
  }

  /**
   * Get all PublicComments by projectId.
   *
   * @returns {Observable<PublicComment[]>}
   * @memberof ProjectService
   */
   getPublicCommentsByProjectId(projectId: string): Observable<PublicComment[]> {


    let observables: Observable<PublicComment[]>;


      observables = this.api.getPublicCommentsByProjectId(projectId);

      return observables;
  }

}
