import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { SearchService } from 'app/services/search.service';
import { SearchProjectService } from 'app/services/searchproject.service';
import { Application } from 'app/models/application';
import { ConstantUtils, CodeType } from 'app/utils/constants/constantUtils';
import { StatusCodes, ReasonCodes } from 'app/utils/constants/application';
import { Project } from 'app/models/project';

import { DistrictService } from 'app/services/district.service';
import { ForestClientService } from 'app/services/forestclient.service';
import { WorkflowStateCodeService } from 'app/services/workflowstatecode.service';
import { PublicCommentService } from 'app/services/publiccomments.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<boolean>();
  private paramMap: ParamMap = null;

  public keywords: string;
  public projects: Project[] = [];
  public count = 0; // used in template

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;

  public searching = false;
  public ranSearch = false;

  constructor(
    private location: Location,
    public snackBar: MatSnackBar,
    public searchService: SearchService, // used in template
    public searcProjecthService: SearchProjectService,
    public searchDistrictService: DistrictService,
    public searchforestClientService: ForestClientService,
    public searchWorkflowStateCodeService: WorkflowStateCodeService,
    public searchPublicCommentService: PublicCommentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // get search terms from route
    this.route.queryParamMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paramMap => {
      this.paramMap = paramMap;

      this.setInitialQueryParameters();

      if (this.keywords) {
        this.doSearch();
      }
    });
  }

  private doSearch() {
    this.searching = true;
    console.log('doSearch: ' + this.keywords);

    this.projects = [];
    this.count = 0;

    this.searcProjecthService.getProjectsByFspId(this.keywords)
    .subscribe(
        projects => {
          projects.forEach(project => {
            this.projects.push(new Project(project));
          });
          this.count = this.projects.length;
          this.fetchingAllPublicComments();
        },
        error => {
          console.log('error =', error);

          this.searching = false;
          this.ranSearch = true;

          this.snackBarRef = this.snackBar.open('Error searching foms ...', 'RETRY');
          this.snackBarRef.onAction().subscribe(() => this.onSubmit());
        },
        () => {
          this.searching = false;
          this.ranSearch = true;
        });

    // this.fetchingAllDistricts();
    // this.fetchingAllForestClients();
    // this.fetchingAllWorkflowStateCodes();
  }

  private fetchingAllPublicComments() {
    this.projects.forEach(project => {
    this.searchPublicCommentService.getPublicCommentsByProjectId( project.id)
    .subscribe(
      publicComments => {
        publicComments.forEach(publicComment => {
            project.publicComments.push(publicComment);
        });

      },
      error => {
        console.log('error =', error);
      });
    });
  }

  // private fetchingAllDistricts() {
  //   this.searchDistrictService.getAll()
  //   .subscribe(
  //     districts => {
  //       districts.forEach(district => {

  //           console.log('districts: ' + JSON.stringify(district));
  //       });

  //     },
  //     error => {
  //       console.log('error =', error);
  //     },
  //     () => {
  //       this.searching = false;
  //       this.ranSearch = true;
  //     });
  // }

  // private fetchingAllForestClients() {
  //   this.searchforestClientService.getAll()
  //   .subscribe(
  //     forestClients => {
  //       forestClients.forEach(forestClient => {

  //           console.log('forestClients: ' + JSON.stringify(forestClient));
  //       });

  //     },
  //     error => {
  //       console.log('error =', error);
  //     },
  //     () => {
  //       this.searching = false;
  //       this.ranSearch = true;
  //     });
  // }

  // private fetchingAllWorkflowStateCodes() {
  //   this.searchWorkflowStateCodeService.getAll()
  //   .subscribe(
  //     workflowStateCodes => {
  //       workflowStateCodes.forEach(workflowStateCode => {

  //           console.log('workflowStateCodes: ' + JSON.stringify(workflowStateCode));
  //       });

  //     },
  //     error => {
  //       console.log('error =', error);
  //     },
  //     () => {
  //       this.searching = false;
  //       this.ranSearch = true;
  //     });
  // }

  public setInitialQueryParameters() {
    this.keywords = this.paramMap.get('keywords') || '';
    console.log('setInitialParam: ' + this.keywords);
  }

  public getQueryParameters() {
    const queryParameters = _.uniq(_.compact(this.keywords.split(',')));
    return queryParameters;
  }

  public saveQueryParameters() {
    const params: Params = {};

    params['keywords'] = this.keywords;

    // change browser URL without reloading page (so any query params are saved in history)
    this.location.go(this.router.createUrlTree([], { relativeTo: this.route, queryParams: params }).toString());
  }

  public onSubmit() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.saveQueryParameters();

    console.log('pressed find');

    this.doSearch();
  }

  public onImport() {
    if (true) {
        this.router.navigate(['/a', 0, 'edit']);
    } else {
      // console.log('error, invalid application =', application);
      this.snackBarRef = this.snackBar.open('Error creating application ...', null, { duration: 3000 });
    }
  }

  // TODO - Marcelo
  // public onImport(application: Application) {
  //   if (application) {
  //     // save application data from search results
  //     const params = {
  //       // initial data
  //       type: application.type,
  //       subtype: application.subtype,
  //       status: application.status,
  //       reason: application.reason,
  //       tenureStage: application.tenureStage,
  //       location: application.location,
  //       businessUnit: application.businessUnit,
  //       cl_file: application.cl_file,
  //       tantalisID: application.tantalisID,
  //       legalDescription: application.legalDescription,
  //       client: application.client,
  //       statusHistoryEffectiveDate: application.statusHistoryEffectiveDate
  //     };
  //     // go to add-edit page
  //     this.router.navigate(['/a', 0, 'edit'], { queryParams: params });
  //   } else {
  //     console.log('error, invalid application =', application);
  //     this.snackBarRef = this.snackBar.open('Error creating application ...', null, { duration: 3000 });
  //   }
  // }

  /**
   * Returns true if the application has an abandoned status AND an amendment reason.
   *
   * @param {Application} application
   * @returns {boolean} true if the application has an abandoned status AND an amendment reason, false otherwise.
   * @memberof SearchComponent
   */
  isAmendment(application: Application): boolean {
    return (
      application &&
      ConstantUtils.getCode(CodeType.STATUS, application.status) === StatusCodes.ABANDONED.code &&
      (ConstantUtils.getCode(CodeType.REASON, application.reason) === ReasonCodes.AMENDMENT_APPROVED.code ||
        ConstantUtils.getCode(CodeType.REASON, application.reason) === ReasonCodes.AMENDMENT_NOT_APPROVED.code)
    );
  }

  /**
   * Given an application, returns a long user-friendly status string.
   *
   * @param {Application} application
   * @returns {string}
   * @memberof SearchComponent
   */
  getStatusStringLong(application: Application): string {
    if (!application) {
      return StatusCodes.UNKNOWN.text.long;
    }

    // If the application was abandoned, but the reason is due to an amendment, then return an amendment string instead
    if (this.isAmendment(application)) {
      console.log('isAmmendment: ' + application.reason);
      return ConstantUtils.getTextLong(CodeType.REASON, application.reason);
    }

    console.log('status: ' + application.status);
    return (
      (application && ConstantUtils.getTextLong(CodeType.STATUS, application.status)) || StatusCodes.UNKNOWN.text.long
    );
  }

  ngOnDestroy() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
