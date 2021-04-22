import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project } from 'core/models/project';
import { District } from 'core/models/district';
import { ForestClient } from 'core/models/forestclient';
import { WorkflowStateCode } from 'core/models/workflowstatecode';
import { PublicComment } from 'core/models/publiccomment';

// TODO: this is likely obselete, keeping for hostname lookup...

@Injectable()
export class ApiService {
  public token: string;
  public isMS: boolean; // IE, Edge, etc
  public pathAPI: string;

  public env: string;

  constructor(private http: HttpClient) {
    // this.jwtHelper = new JwtHelperService();
    const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.isMS = !!window.navigator.msSaveOrOpenBlob;

    // In index.html we load a javascript file with environment-specific settings, 
    // populated from mounted ConfigMap in OpenShift. This file sets window.localStorage settings
    // Locally, this will be empty and local defaults will be used.

    const envName = window.localStorage.getItem('fom_environment_name');
    this.env = (envName == undefined || envName.length == 0) ? 'local' : envName;

    const { hostname } = window.location;
    if (hostname == 'localhost') {
      this.pathAPI = 'http://localhost:3333/api';
    } else if (hostname.includes('nr-fom-admin') && hostname.includes('devops.gov.bc.ca')) {
      this.pathAPI = 'https://'+hostname.replace('fom-admin','fom-api');
      if (!hostname.endsWith('/')) {
        this.pathAPI += '/';
      }
      this.pathAPI += 'api';
    } else {
      // TODO: May need special case for production vanity URL, or implement solution for dynamically loading from a config map.
      throwError('Unrecognized hostname ' + hostname + ' cannot infer API URL.');
    }
  }

  handleError(error: any): Observable<never> {
    const reason = error.message
      ? error.error
        ? `${error.message} - ${error.error.message}`
        : error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    console.log('API error =', reason);
    return throwError(error);
  }
/* TODO: clean up.
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<ILocalLoginResponse>(`${this.pathAPI}/login/token`, { username: username, password: password })
      .pipe(
        map(res => {
          // login successful if there's a jwt token in the response
          if (res && res.accessToken) {
            this.token = res.accessToken;

            // store username and jwt token in local storage to keep user logged in between page refreshes
            window.localStorage.setItem('currentUser', JSON.stringify({ username: username, token: this.token }));

            return true; // successful login
          }
          return false; // failed login
        })
      );
  }

  logout() {
    // clear token + remove user from local storage to log user out
    this.token = null;
    window.localStorage.removeItem('currentUser');
  }
*/

  //
  // Projects
  //

/**
 * Fetch all projects.
 *
 * @returns {Observable<Project[]>}
 * @memberof ApiService
 */
 getProjects(): Observable<Project[]> {
  console.log('TODO: calling the getProjets API - verify this');
  const queryString =
    'projects/';

  return this.http.get<Project[]>(`${this.pathAPI}/${queryString}`, {});
}

/**
 * Fetch all projects by FspId.
 *
 * @returns {Observable<Project[]>}
 * @memberof ApiService
 */
 getProjectsByFspId(fspId: string): Observable<Project[]> {
  console.log('calling the API');
  const queryString =
    'projects/byFspId/' + fspId;

  return this.http.get<Project[]>(`${this.pathAPI}/${queryString}`, {});
}

/**
 * Fetch project by projectId.
 *
 * @returns {Observable<Project>}
 * @memberof ApiService
 */
 getProjectById(projectId: string): Observable<Project> {
   console.log('calling api getProjectById: ' + projectId);
  const queryString =
    'project/' + projectId;

  return this.http.get<Project>(`${this.pathAPI}/${queryString}`, {});
}


/**
 * Fetch all publicComments by projectId.
 *
 * @returns {Observable<PublicComment[]>}
 * @memberof ApiService
 */
 getPublicCommentsByProjectId(projectId: string): Observable<PublicComment[]> {
  const queryString =
    'public-comments/byProjectId/' + projectId;

  return this.http.get<PublicComment[]>(`${this.pathAPI}/${queryString}`, {});
}


  //
  // Districts
  //

/**
 * Fetch all projects that match the provided parameters.
 *
 * @returns {Observable<District[]>}
 * @memberof ApiService
 */
 getDistricts(): Observable<District[]> {
  console.log('calling the API district');
  const queryString =
    'district/';

  return this.http.get<District[]>(`${this.pathAPI}/${queryString}`, {});
}

  //
  // ForestClients
  //

/**
 * Fetch all projects that match the provided parameters.
 *
 * @returns {Observable<ForestClient[]>}
 * @memberof ApiService
 */
 getForestClients(): Observable<ForestClient[]> {
  console.log('calling the API forest_clients');
  const queryString =
    'forestclient/';

  return this.http.get<ForestClient[]>(`${this.pathAPI}/${queryString}`, {});
}


 //
  // WorkflowStateCodes
  //

/**
 * Fetch all workflowStateCodes that match the provided parameters.
 *
 * @returns {Observable<WorkflowStateCode[]>}
 * @memberof ApiService
 */
 getWorkflowStateCodes(): Observable<WorkflowStateCode[]> {
  console.log('calling the API forest_clients');
  const queryString =
    'workflow-state-code/';

  return this.http.get<WorkflowStateCode[]>(`${this.pathAPI}/${queryString}`, {});
}


 //
  // PublicComments
  //

/**
 * Fetch all PublicComment that match the provided parameters.
 *
 * @returns {Observable<PublicComment[]>}
 * @memberof ApiService
 */
 getPublicComments(): Observable<PublicComment[]> {
  console.log('calling the API getComments');
  const queryString =
    'public-comment/';

  return this.http.get<PublicComment[]>(`${this.pathAPI}/${queryString}`, {});
}


}
