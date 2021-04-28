import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {KeycloakService} from 'core/services/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({height: '0'})),
      state('navOpen', style({height: '*'})),
      transition('navOpen => navClosed', [animate('0.2s')]),
      transition('navClosed => navOpen', [animate('0.2s')])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  isNavMenuOpen = true;
  welcomeMsg: string;
  // private _api: ApiService;
  public jwt: {
    username: string;
    realm_access: {
      roles: string[];
    };
    scopes: string[];
  };

  constructor(private keycloakService: KeycloakService, public router: Router) {
    // this._api = api;
      const token = this.keycloakService.getToken();
      let jwt = {
        username: 'sample-user',
        displayName: 'Sample User',
        realm_access: {
          roles: ['sysadmin']
        },
        scopes: ['test', 'dev']
      };
      // TODO: Change this to observe the change in the _api.token
      if (token) {
        // console.log("token:", token);
        // console.log('jwt:', jwt);
        this.welcomeMsg = jwt ? 'Hello ' + jwt.displayName : 'Login';
        // console.log("this:", this.welcomeMsg);
        this.jwt = jwt;
      } else {
        // this.welcomeMsg = 'Login';
        // TODO: Marcelo addded this
        jwt = {
          username: 'sample-user',
          displayName: 'Sample User',
          realm_access: {
            roles: ['sysadmin']
          },
          scopes: ['test', 'dev']
        };
        this.jwt = jwt;
        // TODO Marcelo addded this
        this.welcomeMsg = jwt ? 'Hello ' + jwt.displayName : 'Login';
        // this.jwt = new JwtUtil().
        // this.jwt.username = 'admin';
        // this.jwt.realm_access.roles['sysadmin'];
      }
      // console.log('val:', val instanceof NavigationEnd);
  }

  ngOnInit() {
    // Make sure they have the right role.
    // if (!this.keycloakService.isValidForSite()) {
    //   this.router.navigate(['/not-authorized']);
    // }
  }

  renderMenu(route: string) {
    // Sysadmin's get administration.
    if (route === 'administration') {
      console.log('inside renderMenu');
      return (
        this.jwt &&
        this.jwt.realm_access &&
        this.jwt.realm_access.roles.find(x => x === 'sysadmin') &&
        this.jwt.username === 'admin'
      );
    }

    return null;
  }

  navigateToLogout() {
    // reset login status
    // this.api.logout();
    window.location.href = this.keycloakService.getLogoutURL();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
