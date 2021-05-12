import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {KeycloakService, User} from 'core/services/keycloak.service';
import { ConfigService } from 'core/services/config.service';

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
  isNavMenuOpen = true; // TODO: Is this used?
  environmentDisplay: string;
  welcomeMsg: string;
  user: User;

  /* TODO: Add roles usage.
  public jwt: {
    username: string;
    realm_access: {
      roles: string[];
    };
    scopes: string[];
  };
  */

  constructor(private keycloakService: KeycloakService, private configService: ConfigService, public router: Router) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
    this.user = this.keycloakService.getUser();
    if (this.user) {
      this.welcomeMsg = 'Hello ' + this.user.displayName;
    }
  }

  ngOnInit() {
    // TODO: enable this
    // Make sure they have the right role.
    // if (!this.keycloakService.isValidForSite()) {
    //   this.router.navigate(['/not-authorized']);
    // }
  }
/* TODO: Use for searching for roles.
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
*/
  navigateToLogout() {
    // TODO: reset login status
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
