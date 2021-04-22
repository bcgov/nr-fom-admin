import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { SearchComponent } from './search/search.component';

import { CanDeactivateGuard } from 'core/services/can-deactivate-guard.service';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    // default route
    path: '',
    component: SearchComponent
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class AppRoutingModule {}
