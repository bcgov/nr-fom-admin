import { Injectable } from '@angular/core';
// import { Observable, of, merge, forkJoin } from 'rxjs';
import { Observable} from 'rxjs';
// import { map, catchError, toArray, mergeMap } from 'rxjs/operators';
// import * as moment from 'moment';

// import { ApiService } from './api';
// import { ApplicationService } from 'app/services/application.service';
import { ProjectService } from 'app/services/project.service';
// import { SearchResults } from 'app/models/search';
// import { Application } from 'app/models/application';
// import { Project } from 'app/models/project';
import { ProjectDto }  from '../api-client/typescript-rxjs';

// import { StatusCodes } from 'app/utils/constants/application';
// import { ConstantUtils, CodeType } from 'app/utils/constants/constantUtils';

@Injectable()
export class SearchProjectService {
  public isError = false;

  // constructor(private api: ApiService, private projectService: ProjectService) {}
  constructor(private projectService: ProjectService) {}

  /**
   * Get list of projects
   *
   * @returns {Observable<Project[]>}
   * @memberof SearchProjectService
   */
  getProjects(): Observable<ProjectDto[]> {
    return this.projectService.getAll();
  }

  /**
   * Get list of projects by FspId
   *
   * @returns {Observable<Project[]>}
   * @memberof SearchProjectService
   */
   getProjectsByFspId(fspId: string): Observable<ProjectDto[]> {
    return this.projectService.getByFspId(parseInt(fspId));
  }


  /**
   * Get application search results by Disposition Transaction ID
   *
   * @private
   * @param {number} dtid
   * @returns {Observable<Application[]>}
   * @memberof SearchService
   */
  // private getApplicationsByDispositionID(dtid: number): Observable<Application[]> {
  //   const getByTantalisID = this.applicationService.getByTantalisID(dtid, { getCurrentPeriod: true });

  //   const searchAppsByDispositionID = this.api.searchAppsByDispositionID(dtid).pipe(
  //     map(res => {
  //       return res ? new SearchResults(res) : null;
  //     }),
  //     catchError(() => {
  //       this.isError = true;
  //       // if call fails, return null results
  //       return of(null as SearchResults);
  //     })
  //   );

  //   return forkJoin(getByTantalisID, searchAppsByDispositionID).pipe(
  //     map(payloads => {
  //       const application: Application = payloads[0];
  //       const searchResult: SearchResults = payloads[1];

  //       // first look at PRC result
  //       if (application) {
  //         application.meta.isCreated = true;
  //         // found a unique application in PRC -- no need to look at Tantalis results
  //         return [application];
  //       }

  //       // now look at Tantalis results
  //       const results: Application[] = [];
  //       if (searchResult != null) {
  //         // Build the client string.
  //         let clientString = '';
  //         let idx = 0;
  //         for (const client of searchResult.interestedParties) {
  //           if (idx > 0) {
  //             clientString += ', ';
  //           }
  //           idx++;
  //           if (client.interestedPartyType === 'O') {
  //             clientString += client.legalName;
  //           } else {
  //             clientString += client.firstName + ' ' + client.lastName;
  //           }
  //         }

  //         const app = new Application({
  //           type: searchResult.TENURE_TYPE,
  //           subtype: searchResult.TENURE_SUBTYPE,
  //           status: searchResult.TENURE_STATUS,
  //           reason: searchResult.TENURE_REASON,
  //           tenureStage: searchResult.TENURE_STAGE,
  //           location: searchResult.TENURE_LOCATION,
  //           businessUnit: searchResult.RESPONSIBLE_BUSINESS_UNIT,
  //           cl_file: +searchResult.CROWN_LANDS_FILE,
  //           tantalisID: +searchResult.DISPOSITION_TRANSACTION_SID,
  //           client: clientString,
  //           statusHistoryEffectiveDate: searchResult.statusHistoryEffectiveDate
  //         });

  //         // 7-digit CL File number for display
  //         app.meta.clFile = searchResult.CROWN_LANDS_FILE.padStart(7, '0');

  //         // derive unique applicants
  //         if (app.client) {
  //           const clients = app.client.split(', ');
  //           app.meta.applicants = _.uniq(clients).join(', ');
  //         }

  //         // derive retire date
  //         if (
  //           app.statusHistoryEffectiveDate &&
  //           [
  //             StatusCodes.DECISION_APPROVED.code,
  //             StatusCodes.DECISION_NOT_APPROVED.code,
  //             StatusCodes.ABANDONED.code
  //           ].includes(ConstantUtils.getCode(CodeType.STATUS, app.status))
  //         ) {
  //           app.meta.retireDate = moment(app.statusHistoryEffectiveDate)
  //             .endOf('day')
  //             .add(6, 'months')
  //             .toDate();
  //           // set flag if retire date is in the past
  //           app.meta.isRetired = moment(app.meta.retireDate).isBefore();
  //         }

  //         results.push(app);
  //       }

  //       return results;
  //     }),
  //     catchError(error => this.api.handleError(error))
  //   );
  // }
}
