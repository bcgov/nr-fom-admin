// modules
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FomRoutingModule} from './fom-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';

// components
import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAsideComponent} from './fom-aside/fom-aside.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
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
    FomRoutingModule,
    LeafletModule
  ],
  declarations: [
    FomDetailComponent,
    FomAsideComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent
  ],
  exports: [
    FomDetailComponent,
    FomAsideComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent
  ]
})
export class FomModule {
}
