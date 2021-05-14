import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import * as _ from 'lodash';
import { AuthService } from 'core/api/api/auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";

declare var Keycloak: any;

class KeycloakConfig {
  enabled: boolean = true;
  url: string;
  realm: string;
  clientId: string = 'fom';
}

@Injectable()
export class KeycloakService {
  private config: KeycloakConfig = new KeycloakConfig();
  private keycloakAuth: any;
  private loggedOut: string;
  private fakeUser: User;

  constructor(private authService: AuthService) {
    // TODO: Need to finish loading config - this won't work, circular dependency between loading keycloak for token intercept for HTTP calls, 
    // and loading this config.
    // this.authService.authControllerGetKeycloakConfig().pipe(take(1)).subscribe(
    //   config => {
    //     this.config = config;
    //   },
    //   error => {
    //     console.log('error =', error);
    //   }
    // );
    // console.log('CONFIG = ' + JSON.stringify(this.config));

    // console.log(JSON.stringify(authService.authControllerGetKeycloakConfig()));
    // TODO: Retrieve config from API

    this.config.realm = 'ichqx89w';
    this.config.enabled = true;

    switch (window.location.origin) {
      case 'http://localhost:4200':
        this.config.enabled = true;
        this.config.url = 'https://dev.oidc.gov.bc.ca/auth'
        break;
      // TODO: Inject keycloak URL based on environment.
      case 'https://nr-fom-admin-working-dev.apps.silver.devops.gov.bc.ca':
      case 'https://nr-fom-admin-main-dev.apps.silver.devops.gov.bc.ca':
        // Dev
        this.config.url = 'https://dev.oidc.gov.bc.ca/auth';
        break;

      case 'https://nr-fom-admin-test.apps.silver.devops.gov.bc.ca':
        // Test
        this.config.url = 'https://test.oidc.gov.bc.ca/auth';
        break;

      default:
        // Prod
        this.config.url = 'https://oidc.gov.bc.ca/auth';
    }

  }

  private getFakeUser():User {
    const userType:string = 'AllAccess'; // NoAccess, ForestClient, Ministry, AllAccess
    switch (userType) {
      case 'NoAccess':
        return this.getFakeNoAccessUser();
      case 'ForestClient':
        return this.getFakeForestClientUser();
      case 'Ministry':
        return this.getFakeMinistryUser();
      case 'AllAccess':
        return this.getFakeAllAccessUser();
      default:
        return null;
    }
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

    if (!this.config.enabled) {
      this.fakeUser = this.getFakeUser();
      return null;
    }

    // Bootup KC
    return new Promise((resolve, reject) => {

      this.keycloakAuth = new Keycloak(this.config);
/*
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
*/
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
              this.keycloakAuth.login({ kc_idp_hint: ['idir', 'bceid']}); // TODO: Unknown if this will work as specified.
              // If not authorized for FOM, the header-component will route the user to the not-authorized page.
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

  private getFakeNoAccessUser(): User {
    const user = new User();
    user.userName = 'fakeNoAccessUser';
    user.displayName = 'No Access User';
    user.isMinistry = false;
    user.isForestClient = false;
    return user;
  }

  private getFakeMinistryUser(): User {
    const user = new User();
    user.userName = 'fakeMinstryUser';
    user.displayName = 'Ministry User';
    user.isMinistry = true;
    user.isForestClient = false;
    return user;
  }

  private getFakeForestClientUser(): User {
    const user = new User();
    user.userName = 'fakeForestClientUser';
    user.displayName = 'Forest Client User';
    user.isMinistry = false;
    user.isForestClient = true;
    user.clientIds.push('1011')
    user.clientIds.push('1012');
    return user;
  }

  private getFakeAllAccessUser(): User {
    const user = new User();
    user.userName = 'fakeAllAccessUser';
    user.displayName = 'All Access User';
    user.isMinistry = true;
    user.isForestClient = true;
    user.clientIds.push('1011')
    user.clientIds.push('1012');
    return user;
  }

  public getUser(): User {
    if (!this.config.enabled) {
       return this.fakeUser;
    } else {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      
      // const decodedToken = jwt.decode(token, { complete: true });
      // new JwtUtil().decodeToken(token); // TODO: REMOVE JwtUtil.
      // const decodedToken = decode(token);

      if (!decodedToken) {
        return null;
      }

      console.log('decoded token = ' + JSON.stringify(decodedToken)); // TODO: REMOVE

      return User.convertJwtToUser(decodedToken);
    }
  }

  /**
   * Returns the current keycloak auth token.
   *
   * @returns {string} keycloak auth token.
   * @memberof KeycloakService
   */
  public getToken(): string {
    if (!this.config.enabled) {
      // TODO: Change this to convert user to JWT format?
      return JSON.stringify(this.fakeUser);
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

  logout() {
    if (!this.config.enabled) {
      this.fakeUser = null;
    }
    // TODO: Update UserService?
  }

  getLogoutURL(): string {
    const logoutUrl = window.location.origin + '/admin/not-authorized?loggedout=true';

    if (!this.config.enabled) {
      return logoutUrl;
    } 

    return this.keycloakAuth.authServerUrl + '/realms/' + this.config.realm +
      '/protocol/openid-connect/logout?redirect_uri=' + logoutUrl;
    
  }
}
