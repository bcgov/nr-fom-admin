import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ApplicationDetailComponent} from './application-detail/application-detail.component';
import {ApplicationAddEditComponent} from './application-add-edit/application-add-edit.component';
import {ApplicationDetailResolver} from './application-resolver.service';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';

const routes: Routes = [
  {
    path: 'a/create',
    component: ApplicationAddEditComponent
  },
  {
    path: 'a/:appId',
    component: ApplicationDetailComponent,
    resolve: {
      application: ApplicationDetailResolver
    }
  },
  {
    path: 'a/:appId/edit',
    component: ApplicationAddEditComponent

  },


  {
    path: 'comments/:appId',
    component: ReviewCommentsComponent


  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ApplicationDetailResolver]
})
export class ApplicationsRoutingModule {
}
