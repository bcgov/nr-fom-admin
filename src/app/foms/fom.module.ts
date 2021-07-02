// modules
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FomRoutingModule} from './fom-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';
import { MatTableModule } from '@angular/material/table'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';

// components
import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';
import {CommentDetailComponent} from './review-comments/comment-detail/comment-detail.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { FomSubmissionComponent } from './fom-submission/fom-submission.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttachmentUploadService } from '../../core/utils/attachmentUploadService';
import { ShapeInfoComponent } from './shape-info/shape-info.component';
import { DetailsMapComponent } from './details-map/details-map.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { InteractionDetailComponent } from './interactions/interaction-detail/interaction-detail.component';
import { SummaryComponent } from './summary/summary.component';
import { MatIconModule } from '@angular/material/icon';
import { CommentsSummaryComponent } from './summary/comments-summary/comments-summary.component';
import { InteractionsSummaryComponent } from './summary/interactions-summary/interactions-summary.component';
import { NgxPrintModule } from 'ngx-print';
import {AttachmentResolverSvc} from "../../core/services/AttachmentResolverSvc";
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
        LeafletModule,
        BrowserAnimationsModule,
        BsDatepickerModule.forRoot(),
        MatTableModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatCardModule,
        MatIconModule,
        MatBadgeModule,
        NgxPrintModule
    ],
  declarations: [
    FomDetailComponent,
    DetailsMapComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent,
    FomSubmissionComponent,
    ShapeInfoComponent,
    InteractionsComponent,
    InteractionDetailComponent,
    SummaryComponent,
    CommentsSummaryComponent,
    InteractionsSummaryComponent
  ],
  exports: [
    FomDetailComponent,
    DetailsMapComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent,
    FomSubmissionComponent,
    ShapeInfoComponent
  ],
  providers: [
    AttachmentUploadService,
    AttachmentResolverSvc
  ]
})
export class FomModule {
}
