import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {KeycloakService} from 'core/services/keycloak.service';
import {User} from 'core/services/user';
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
  isNavMenuOpen = true; 
  environmentDisplay: string;
  welcomeMsg: string;
  user: User;

  constructor(private keycloakService: KeycloakService, private configService: ConfigService, public router: Router) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
    this.user = this.keycloakService.getUser();
    if (this.user) {
      this.welcomeMsg = 'Hello ' + this.user.displayName;
    }
  }

  ngOnInit() {
    if (!this.user || !this.user.isAuthorizedForAdminSite()) {
      if (window.location.href.indexOf('/not-authorized') != -1 && 
        window.location.href.indexOf("loggedout=true") == -1) {
        this.router.navigate(['/not-authorized']);
      }
    }
  }

  navigateToLogout() {
    this.keycloakService.logout();
    window.location.href = this.keycloakService.getLogoutURL();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
