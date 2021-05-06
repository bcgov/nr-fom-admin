import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

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

    const {hostname} = window.location;
    if (hostname == 'localhost') {
      this.pathAPI = 'http://localhost:3333/api';
    } else if (hostname.includes('nr-fom-admin') && hostname.includes('devops.gov.bc.ca')) {
      this.pathAPI = 'https://' + hostname.replace('fom-admin', 'fom-api');
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

}
