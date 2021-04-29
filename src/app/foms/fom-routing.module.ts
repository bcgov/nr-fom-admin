import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
import {ApplicationDetailResolver} from './fom-resolver.service';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';

const routes: Routes = [
  {
    path: 'a/create',
    component: FomAddEditComponent
  },
  {
    path: 'a/:appId',
    component: FomDetailComponent,
    resolve: {
      application: ApplicationDetailResolver
    }
  },
  {
    path: 'a/:appId/edit',
    component: FomAddEditComponent

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
export class FomRoutingModule {
}
