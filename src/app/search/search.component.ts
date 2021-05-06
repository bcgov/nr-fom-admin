import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

import {SearchService} from 'core/services/search.service';
import {SearchProjectService} from 'core/services/search-project.service';
import {Application} from 'core/models/application';
import {CodeType, ConstantUtils} from 'core/utils/constants/constantUtils';
import {ReasonCodes, StatusCodes} from 'core/utils/constants/application';
import {Project} from 'core/models/project';

// Testing fetching Districts
import {ProjectDto} from 'core/api';

// import { PublicCommentService } from 'core/services/public-comments.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<boolean>();
  private paramMap: ParamMap = null;

  public keywords: string;
  public projects: ProjectDto[] = [];
  public count = 0; // used in template

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;

  public searching = false;
  public ranSearch = false;

  constructor(
    private location: Location,
    public snackBar: MatSnackBar,
    public searchService: SearchService, // used in template
    public searchProjectService: SearchProjectService,
    // public searchPublicCommentService: PublicCommentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

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
    this.projects = [];
    this.count = 0;

    this.searchProjectService.getProjectsByFspId(this.keywords)
      .subscribe(
        projects => {
          projects.forEach(project => {
            // @ts-ignore
            this.projects.push(project as Project);
          });
          this.count = this.projects.length;
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
    // this.fetchingAllPublicComments();
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
  //   this.searchForestClientService.getAll()
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

  // private fetchingAllPublicComments() {
  //   this.searchPublicCommentService.getAll()
  //   .subscribe(
  //     publicComments => {
  //       publicComments.forEach(publicComment => {

  //           console.log('publicComments: ' + JSON.stringify(publicComment));
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
  }

  public getQueryParameters() {
    const queryParameters = _.uniq(_.compact(this.keywords.split(',')));
    return queryParameters;
  }

  public saveQueryParameters() {
    const params: Params = {};

    params['keywords'] = this.keywords;

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

  public onImport() {
    // try {
    this.router.navigate(['/a/create']);
    console.log('on import')
    // } catch (err) {
    // console.log('error, invalid application =', application);
    // this.snackBarRef = this.snackBar.open('Error creating application ...', null, { duration: 3000 });
    // }
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
