import { NgModule, APP_INITIALIZER, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

// modules
import { SharedModule } from 'app/shared.module';
import { ApplicationsModule } from 'app/applications/applications.module';
import { AppRoutingModule } from 'app/app-routing.module';

// components
import { AppComponent } from 'app/app.component';
import { HomeComponent } from 'app/home/home.component';
import { SearchComponent } from 'app/search/search.component';
import { ListComponent } from 'app/list/list.component';
import { LoginComponent } from 'app/login/login.component';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { HeaderComponent } from 'app/header/header.component';
import { FooterComponent } from 'app/footer/footer.component';
import { AdministrationComponent } from 'app/administration/administration.component';
import { UsersComponent } from 'app/administration/users/users.component';
import { AddEditUserComponent } from 'app/administration/users/add-edit-user/add-edit-user.component';

// services
import { SearchService } from 'core/services/search.service';
import { SearchProjectService } from 'core/services/search-project.service';
import { AuthenticationService } from 'core/services/authentication.service';
import { ProjectService } from 'core/services/project.service';
import { CanDeactivateGuard } from 'core/services/can-deactivate-guard.service';
import { KeycloakService } from 'core/services/keycloak.service';
import { DistrictService } from 'core/services/district.service';
import { ForestClientService } from 'core/services/forest-client.service';
import { ResponseService } from 'core/services/response.service';
import { AttachmentTypeService } from 'core/services/attachment-type.service';
import { SubmissionTypeService } from 'core/services/submission-type.service';
import { WorkflowStateService } from 'core/services/workflow-state.service';

import { TokenInterceptor } from 'core/utils/token-interceptor';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

export function kcFactory(keycloakService: KeycloakService) {
  return () => keycloakService.init();
}

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
    AppRoutingModule, // <-- module import order matters - https://angular.io/guide/router#module-import-order-matters
    NgbModule,
    NgxPaginationModule,
    BootstrapModalModule.forRoot({ container: document.body })
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
    SearchService,
    SearchProjectService,
    ProjectService,
    DistrictService,
    ForestClientService,
    ResponseService,
    AttachmentTypeService,
    SubmissionTypeService,
    WorkflowStateService,
    AuthenticationService,
    CanDeactivateGuard
  ],
  entryComponents: [ConfirmComponent, AddEditUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', { get: () => applicationRef.components });
  }
}
