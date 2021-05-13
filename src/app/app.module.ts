import {APP_INITIALIZER, ApplicationRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

// modules
import {SharedModule} from 'app/shared.module';
import {FomModule} from 'app/foms/fom.module';
import {AppRoutingModule} from 'app/app-routing.module';

// components
import {AppComponent} from 'app/app.component';
import {HomeComponent} from 'app/home/home.component';
import {SearchComponent} from 'app/search/search.component';
import {ListComponent} from 'app/list/list.component';
import {ConfirmComponent} from 'app/confirm/confirm.component';
import {HeaderComponent} from 'app/header/header.component';
import {FooterComponent} from 'app/footer/footer.component';

// services
import {AuthenticationService} from 'core/services/authentication.service';
import {CanDeactivateGuard} from 'core/services/can-deactivate-guard.service';
import {KeycloakService} from 'core/services/keycloak.service';

import {ConfigService} from 'core/services/config.service';
import {TokenInterceptor} from 'core/utils/token-interceptor';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {ApiModule, Configuration} from 'core/api';
import {ErrorInterceptor} from 'core/interceptors/http-error.interceptor';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RxReactiveFormsModule} from '@rxweb/reactive-form-validators';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {throwError} from 'rxjs';

export function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}

let apiBasePath;
const { hostname } = window.location;
if (hostname == 'localhost') {
  apiBasePath = 'http://localhost:3333';
} else if (hostname.includes('nr-fom-admin') && hostname.includes('devops.gov.bc.ca')) {
  apiBasePath = 'https://' + hostname.replace('fom-admin', 'fom-api');
} else {
  // TODO: May need special case for production vanity URL, or implement solution for dynamically loading from a config map.
  throwError('Unrecognized hostname ' + hostname + ' cannot infer API URL.');
}

const apiConfig = new Configuration({
  basePath: apiBasePath
})

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ConfirmComponent,
    HeaderComponent,
    FooterComponent,
    NotAuthorizedComponent,
    ListComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    FomModule,
    ReactiveFormsModule,
    NgbModule,
    ApiModule.forRoot(() => apiConfig),
    NgxPaginationModule,
    AppRoutingModule,
    RxReactiveFormsModule,
    LeafletModule

  ],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthenticationService,
    ConfigService,
    CanDeactivateGuard
  ],
  entryComponents: [ConfirmComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', {get: () => applicationRef.components});
  }
}
