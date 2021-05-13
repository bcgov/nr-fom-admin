import { Injectable } from '@angular/core';
import { JwtUtil } from 'app/jwt-util';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

declare var Keycloak: any;

export class User {
  userId: string;
  displayName: string;
  isMinistry: boolean = false;
  isForestClient: boolean = false;
  clientIds: string[] = [];

  isAuthorizedForAdminSite():boolean {
    return this.isMinistry || this.isForestClient;
  }
  
  isAuthorizedForClientId(clientId:string):boolean {
    return (this.clientIds.findIndex(x => x == clientId) != -1);
  }

  static convertJwtToUser(jwt: any): User {
    const user = new User();
    user.userId = jwt['preferred_username'];
    user.displayName = jwt['name'];
    var roles: string[];
    if (jwt['resource_access'] && jwt['resource_access']['fom']) {
      roles = jwt['resource_access']['fom']['roles'];
    }
    roles = []; // TODO: REMOVE
    roles.push('fom_ministry'); // TODO: REMOVE
    // roles.push('fom_forest_client_1012'); // TODO: REMOVE
    roles.forEach(role => {
      if (role == 'fom_ministry') {
        user.isMinistry = true;
      }
      if (role.startsWith('fom_forest_client')) {
        user.isForestClient = true;
        const clientStartIndex = 'fom_forest_client_'.length;
        if (role.length > clientStartIndex) {
          const clientId = role.substr(clientStartIndex);
          user.clientIds.push(clientId);
        }
      }
    })
    console.log('user ' + JSON.stringify(user)); // TODO:REMOVE

    // JWT Structure in development - TODO: Confirm whether same in prod
    // realm_access.roles []
    // resource_access.fom.roles = fom_ministry, fom_forest_client
    // resource_access.account.roles []
    // name
    // preferred_username
    // email
    // typ = Bearer
    // azp = fom
    // iss = https://dev.oidc.gov.bc.ca/auth/realms/ichqx89w


    return user;
  }
  
}

@Injectable()
export class KeycloakService {
  private keycloakAuth: any;
  private keycloakEnabled: boolean;
  private keycloakUrl: string;
  private keycloakRealm: string;
  private loggedOut: string;
  private fakeUser: User;

  constructor() {
    this.keycloakRealm = 'ichqx89w';

    switch (window.location.origin) {
      case 'http://localhost:4200':
        this.keycloakEnabled = false;
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

    if (!this.keycloakEnabled) {
      this.fakeUser = this.getFakeUser();
      return null;
    }

    // Bootup KC
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
    user.userId = 'fakeNoAccessUser';
    user.displayName = 'No Access User';
    user.isMinistry = false;
    user.isForestClient = false;
    return user;
  }

  private getFakeMinistryUser(): User {
    const user = new User();
    user.userId = 'fakeMinstryUser';
    user.displayName = 'Ministry User';
    user.isMinistry = true;
    user.isForestClient = false;
    return user;
  }

  private getFakeForestClientUser(): User {
    const user = new User();
    user.userId = 'fakeForestClientUser';
    user.displayName = 'Forest Client User';
    user.isMinistry = false;
    user.isForestClient = true;
    user.clientIds.push('1011')
    user.clientIds.push('1012');
    return user;
  }

  private getFakeAllAccessUser(): User {
    const user = new User();
    user.userId = 'fakeAllAccessUser';
    user.displayName = 'All Access User';
    user.isMinistry = true;
    user.isForestClient = true;
    user.clientIds.push('1011')
    user.clientIds.push('1012');
    return user;
  }

  public getUser(): User {
    if (!this.keycloakEnabled) {
       return this.fakeUser;
    } else {
      const token = this.getToken();
      if (!token) {
        return null;
      }
      const jwt = new JwtUtil().decodeToken(token);
      if (!jwt) {
        return null;
      }

      console.log('jwt = ' + JSON.stringify(jwt)); // TODO: REMOVE

      return User.convertJwtToUser(jwt);
    }
  }

  /**
   * Returns the current keycloak auth token.
   *
   * @returns {string} keycloak auth token.
   * @memberof KeycloakService
   */
  public getToken(): string {
    if (!this.keycloakEnabled) {
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
    if (!this.keycloakEnabled) {
      this.fakeUser = null;
    }
    // TODO: Update UserService?
  }

  getLogoutURL(): string {
    const logoutUrl = window.location.origin + '/admin/not-authorized?loggedout=true';

    if (!this.keycloakEnabled) {
      return logoutUrl;
    } 

    return this.keycloakAuth.authServerUrl + '/realms/' + this.keycloakRealm +
      '/protocol/openid-connect/logout?redirect_uri=' + logoutUrl;
    
  }
}
