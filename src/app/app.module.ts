import {APP_INITIALIZER, ApplicationRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';

// modules
import {SharedModule} from 'app/shared.module';
import {ApplicationsModule} from 'app/applications/applications.module';
import {AppRoutingModule} from 'app/app-routing.module';

// components
import {AppComponent} from 'app/app.component';
import {HomeComponent} from 'app/home/home.component';
import {SearchComponent} from 'app/search/search.component';
import {ListComponent} from 'app/list/list.component';
import {LoginComponent} from 'app/login/login.component';
import {ConfirmComponent} from 'app/confirm/confirm.component';
import {HeaderComponent} from 'app/header/header.component';
import {FooterComponent} from 'app/footer/footer.component';
import {AdministrationComponent} from 'app/administration/administration.component';
import {UsersComponent} from 'app/administration/users/users.component';
import {AddEditUserComponent} from 'app/administration/users/add-edit-user/add-edit-user.component';

// services
import {SearchService} from 'core/services/search.service';
import {SearchProjectService} from 'core/services/search-project.service';
import {AuthenticationService} from 'core/services/authentication.service';
import {CanDeactivateGuard} from 'core/services/can-deactivate-guard.service';
import {KeycloakService} from 'core/services/keycloak.service';

import {TokenInterceptor} from 'core/utils/token-interceptor';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {ApiModule, Configuration} from 'core/api';
import {ErrorInterceptor} from 'core/interceptors/http-error.interceptor';

import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {RxReactiveFormsModule} from '@rxweb/reactive-form-validators';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

export function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}

const apiConfig = new Configuration({
  basePath: 'http://localhost:3333'
})

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LoginComponent,
    ConfirmComponent,
    HeaderComponent,
    FooterComponent,
    AdministrationComponent,
    UsersComponent,
    AddEditUserComponent,
    NotAuthorizedComponent,
    ListComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ApplicationsModule,
    ReactiveFormsModule,
    NgbModule,
    ApiModule.forRoot(() => apiConfig),
    NgxPaginationModule,
    BootstrapModalModule.forRoot({container: document.body}),
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
    SearchService,
    SearchProjectService,

    AuthenticationService,
    CanDeactivateGuard
  ],
  entryComponents: [ConfirmComponent, AddEditUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', {get: () => applicationRef.components});
  }
}
