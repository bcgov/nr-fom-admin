import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { OrderByPipe } from 'core/pipes/order-by.pipe';
import { NewlinesPipe } from 'core/pipes/newlines.pipe';
import { PublishedPipe } from 'core/pipes/published.pipe';
import { ObjectFilterPipe } from 'core/pipes/object-filter.pipe';
import { LinkifyPipe } from 'core/pipes/linkify.pipe';

import { FileUploadComponent } from 'app/file-upload/file-upload.component';

@NgModule({
  imports: [BrowserModule, MatSlideToggleModule, MatSnackBarModule],
  declarations: [OrderByPipe, NewlinesPipe, PublishedPipe, ObjectFilterPipe, LinkifyPipe, FileUploadComponent],
  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    OrderByPipe,
    NewlinesPipe,
    PublishedPipe,
    LinkifyPipe,
    FileUploadComponent
  ]
})
export class SharedModule {}
