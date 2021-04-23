// modules
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ApplicationsRoutingModule} from './applications-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';

// components
import {ApplicationDetailComponent} from './application-detail/application-detail.component';
import {ApplicationAsideComponent} from './application-aside/application-aside.component';
import {ApplicationAddEditComponent} from './application-add-edit/application-add-edit.component';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';
import {CommentDetailComponent} from './review-comments/comment-detail/comment-detail.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

// services
// import { ExportService } from 'core/services/export.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    NgbModule,
    InlineSVGModule.forRoot(),
    ApplicationsRoutingModule,
    LeafletModule
  ],
  declarations: [
    ApplicationDetailComponent,
    ApplicationAsideComponent,
    ApplicationAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent
  ],
  exports: [
    ApplicationDetailComponent,
    ApplicationAsideComponent,
    ApplicationAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent
  ]
})
export class ApplicationsModule {
}
