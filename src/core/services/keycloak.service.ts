import { Injectable } from '@angular/core';
import { JwtUtil } from 'app/jwt-util';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

declare var Keycloak: any;

export class User {
  userId: string;
  displayName: string;
}

@Injectable()
export class KeycloakService {
  private keycloakAuth: any;
  private keycloakEnabled: boolean;
  private keycloakUrl: string;
  private keycloakRealm: string;
  private loggedOut: string;

  constructor() {
    this.keycloakRealm = 'ichqx89w';

    switch (window.location.origin) {
      case 'http://localhost:4200':
        this.keycloakEnabled = true;
        this.keycloakUrl = 'https://dev.oidc.gov.bc.ca/auth'
        break;
      // TODO: Inject keycloak URL based on environment.
      case 'https://nr-fom-admin-working-dev.apps.silver.devops.gov.bc.ca':
      case 'https://nr-fom-admin-main-dev.apps.silver.devops.gov.bc.ca':
        // Dev
        this.keycloakEnabled = true;
        this.keycloakUrl = 'https://dev.oidc.gov.bc.ca/auth';
        break;

      case 'https://nr-fom-admin-test.apps.silver.devops.gov.bc.ca':
        // Test
        this.keycloakEnabled = false;
        this.keycloakUrl = 'https://test.oidc.gov.bc.ca/auth';
        break;

      default:
        // Prod
        this.keycloakEnabled = false;
        this.keycloakUrl = 'https://oidc.gov.bc.ca/auth';
    }
  }

  isKeyCloakEnabled(): boolean {
    return this.keycloakEnabled;
  }

  private getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  init(): Promise<any> {
    this.loggedOut = this.getParameterByName('loggedout');

    if (this.keycloakEnabled) {
      // Bootup KC
      this.keycloakEnabled = true;
      return new Promise((resolve, reject) => {
        const config = {
          url: this.keycloakUrl,
          realm: this.keycloakRealm,
          clientId: 'fom'
        };

        this.keycloakAuth = new Keycloak(config);

        this.keycloakAuth.onAuthSuccess = () => {
          console.log('onAuthSuccess');
        };

        this.keycloakAuth.onAuthError = () => {
          console.log('onAuthError');
        };

        this.keycloakAuth.onAuthRefreshSuccess = () => {
          console.log('onAuthRefreshSuccess');
        };

        this.keycloakAuth.onAuthRefreshError = () => {
          console.log('onAuthRefreshError');
        };

        this.keycloakAuth.onAuthLogout = () => {
          console.log('onAuthLogout');
        };

        // Try to get refresh tokens in the background
        this.keycloakAuth.onTokenExpired = () => {
          this.keycloakAuth
            .updateToken()
            .then(refreshed => {
              console.log('KC refreshed token?:', refreshed);
            })
            .catch(err => {
              console.log('KC refresh error:', err);
            });
        };

        // Initialize
        this.keycloakAuth
          .init({})
          .then(auth => {
            if (!auth) {
              if (this.loggedOut === 'true') {
                // Don't do anything, they wanted to remain logged out.
                resolve(null); 
              } else {
                this.keycloakAuth.login();
              }
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            console.log('KC error:', err);
            reject();
          });
      });
    }

    return null; 
  }



  getUser(): User {
    const user = new User();
    if (!this.keycloakEnabled) {
      user.userId = 'fakeUser';
      user.displayName = 'Fake User';
    } else {
      const token = this.getToken();
      if (!token) {
        return null;
      }
      const jwt = new JwtUtil().decodeToken(token);
      user.userId = jwt['preferred_username'];
      user.displayName = jwt['name'];
    }
    return user;
  }

  // TODO: Probably remvoe this method
  getJwt() {
    if (!this.keycloakEnabled) {
      return null;
    }
    var token = this.getToken();
    if (!token) {
      return null;
    }
    const jwt = new JwtUtil().decodeToken(token);
    console.log('jwt = '+JSON.stringify(jwt)); // TODO: REMOVE
    // Structure:
    // realm_access.roles []
    // resource_access.account.roles []
    // name
    // preferred_username
    // email
    // typ = Bearer
    // azp = fom
    // iss = https://dev.oidc.gov.bc.ca/auth/realms/ichqx89w

    return jwt;
  }

  // TODO: Need to revise this.
  isValidForSite() {
    if (!this.getToken()) {
      return false;
    }
    const jwt = new JwtUtil().decodeToken(this.getToken());
    if (jwt && jwt.realm_access && jwt.realm_access.roles) {
      return _.includes(jwt.realm_access.roles, 'sysadmin');
    } else {
      return false;
    }
  }

  /**
   * Returns the current keycloak auth token.
   *
   * @returns {string} keycloak auth token.
   * @memberof KeycloakService
   */
  getToken(): string {
    if (!this.keycloakEnabled) {
      // return the local storage token
      const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
      return currentUser ? currentUser.token : null;
    }

    return this.keycloakAuth.token;
  }

  /**
   * Returns an observable that emits when the auth token has been refreshed.
   * Call {@link KeycloakService#getToken} to fetch the updated token.
   *
   * @returns {Observable<string>}
   * @memberof KeycloakService
   */
  refreshToken(): Observable<any> {
    return new Observable(observer => {
      this.keycloakAuth
        .updateToken(30)
        .success(refreshed => {
          console.log('KC refreshed token?:', refreshed);
          observer.next();
          observer.complete();
        })
        .error(err => {
          console.log('KC refresh error:', err);
          observer.error();
        });

      return { unsubscribe() {} };
    });
  }

  getLogoutURL(): string {
    // TODO? need to do two stage logoff.
    // logoff prc, as well as bcgov?
    // https://logon.gov.bc.ca/clp-cgi/logoff.cgi?returl=http://localhost:4200/admin/
    // https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=http://localhost:4200/admin/
    if (this.keycloakEnabled) {
      return (
        this.keycloakAuth.authServerUrl +
        '/realms/' +
        this.keycloakRealm +
        '/protocol/openid-connect/logout?redirect_uri=' +
        window.location.origin +
        '/admin/not-authorized?loggedout=true'
      );
    } else {
      // go to the /login page
      return window.location.origin + '/admin/login';
    }
  }
}
