import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

import {ProjectService} from "core/api";

// Testing fetching Districts
import {ProjectResponse} from 'core/api';
import { StateService } from 'core/services/state.service';
import { KeycloakService } from 'core/services/keycloak.service';
import { User } from 'core/services/user'
import { ConfigService } from 'core/services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<boolean>();
  private paramMap: ParamMap = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  public user: User;
  public fFspId: number; // filter: FSP ID
  public fStatus: string; // filter: workflowStateCode
  public fDistrict: number; // filter: district id
  public fHolder: string; // filter: part of FOM holder name
  public projects: ProjectResponse[] = [];
  public count = 0;
  public searching = false;
  public statusCodes = this.stateSvc.getCodeTable('workflowResponseCode');
  public districts = this.stateSvc.getCodeTable('district');

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private stateSvc: StateService,
    private keycloakService: KeycloakService,
    public snackBar: MatSnackBar,
    public searchProjectService: ProjectService
  ) { 
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    // get search terms from route
    this.route.queryParamMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paramMap => {
      this.paramMap = paramMap;
      this.setInitialQueryParameters();

      if (this.fFspId || this.fStatus || this.fDistrict || this.fHolder) {
        this.doSearch();
      }
    });
  }

  private doSearch() {
    this.searching = true;
    this.projects = [];
    this.count = 0;

    const workFlowStateCodeArg = this.fStatus === 'undefined'? null: this.fStatus;
    const districtArg = isNaN(this.fDistrict)? null : this.fDistrict;
    this.searchProjectService.projectControllerFind( this.fFspId , districtArg, workFlowStateCodeArg, this.fHolder)
      .subscribe(
        projects => {
          projects.forEach(project => {
            // @ts-ignore
            this.projects.push(project as Project);
          });
          this.count = this.projects.length;
        },
        error => {
          console.error('error =', error);

          this.searching = false;

          this.snackBarRef = this.snackBar.open('Error searching foms ...', 'RETRY');
          this.snackBarRef.onAction().subscribe(() => this.onSubmit());
        },
        () => {
          this.searching = false;
        });
  }

  public setInitialQueryParameters() {
    this.fFspId = this.paramMap.get('fFspId')? parseInt(this.paramMap.get('fFspId')): null;
    this.fDistrict = this.paramMap.get('fDistrict')? parseInt(this.paramMap.get('fDistrict')): null;
    this.fStatus = this.paramMap.get('fStatus') || undefined;
    this.fHolder = this.paramMap.get('fHolder') || null;
  }

  public saveQueryParameters() {
    const params: Params = {};

    if (!isNaN(this.fFspId)) {
      params['fFspId'] = this.fFspId;
    }
    if (!isNaN(this.fDistrict)) {
      params['fDistrict'] = this.fDistrict;
    }
    if (this.fStatus !== 'undefined') {
      params['fStatus'] = this.fStatus;
    }
    if (this.fHolder != null) {
      params['fHolder'] = this.fHolder;
    }

    // change browser URL without reloading page (so any query params are saved in history)
    this.location.go(this.router.createUrlTree([], {relativeTo: this.route, queryParams: params}).toString());
  }

  public onSubmit() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    this.saveQueryParameters();
    this.doSearch();
  }

  public clearQueryParameters(): void {
    this.fFspId = null;
    this.fDistrict = null;
    this.fStatus = undefined;
    this.fHolder = null;
    this.saveQueryParameters();
    this.projects = [];
    this.count = 0;
  }

  ngOnDestroy() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
