import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api';
import { JwtUtil } from 'app/jwt-util';
import { KeycloakService } from 'app/services/keycloak.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({ height: '0' })),
      state('navOpen', style({ height: '*' })),
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
    username: string ;
    realm_access: {
      roles: string[];
    };
    scopes: string[];
  };

  constructor(public api: ApiService, private keycloakService: KeycloakService, public router: Router) {
    // this._api = api;
    router.events.subscribe(() => {
      const token = this.keycloakService.getToken();
      // TODO: Change this to observe the change in the _api.token
      if (token) {
        // console.log("token:", token);
        var jwt = new JwtUtil().decodeToken(token);
        // console.log('jwt:', jwt);
        this.welcomeMsg = jwt ? 'Hello ' + jwt.displayName : 'Login';
        // console.log("this:", this.welcomeMsg);
        this.jwt = jwt;
      } else {
        // this.welcomeMsg = 'Login';
        //Marcelo addded this
        jwt = {
          username: 'Marcelo',
          displayName: 'Marcelo',
          realm_access: {
            roles: ['sysadmin']
          },
          scopes: ['test','dev']
        };
        this.jwt = jwt;
        //Marcelo addded this
        this.welcomeMsg = jwt ? 'Hello ' + jwt.displayName : 'Login';
        // this.jwt = new JwtUtil().
        // this.jwt.username = 'admin';
        // this.jwt.realm_access.roles['sysadmin'];
      }
      // console.log('val:', val instanceof NavigationEnd);
    });
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
  }

  navigateToLogout() {
    // reset login status
    this.api.logout();
    window.location.href = this.keycloakService.getLogoutURL();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
