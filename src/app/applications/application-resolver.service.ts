import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ApplicationService } from 'app/services/application.service';
import { Application } from 'app/models/application';
import { StatusCodes } from 'app/utils/constants/application';
import { ConstantUtils, CodeType } from 'app/utils/constants/constantUtils';

@Injectable()
export class ApplicationDetailResolver implements Resolve<Application> {
  constructor(private applicationService: ApplicationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Application> {
    const appId = route.paramMap.get('appId');

    if (appId === '0') {
      // create new application
      const application = new Application({
        type: route.queryParamMap.get('type'),
        subtype: route.queryParamMap.get('subtype'),
        status: route.queryParamMap.get('status'),
        reason: route.queryParamMap.get('reason'),
        tenureStage: route.queryParamMap.get('tenureStage'),
        location: route.queryParamMap.get('location'),
        businessUnit: route.queryParamMap.get('businessUnit'),
        cl_file: +route.queryParamMap.get('cl_file'), // NB: unary operator
        tantalisID: +route.queryParamMap.get('tantalisID'), // NB: unary operator
        legalDescription: route.queryParamMap.get('legalDescription'),
        client: route.queryParamMap.get('client'),
        statusHistoryEffectiveDate: route.queryParamMap.get('statusHistoryEffectiveDate')
      });

      // 7-digit CL File number for display
      if (application.cl_file) {
        application.meta.clFile = application.cl_file.toString().padStart(7, '0');
        // TODO
        console.log('app resolver: ' + application.cl_file.toString() );
      }

      // derive unique applicants
      if (application.client) {
        const clients = application.client.split(', ');
        application.meta.applicants = _.uniq(clients).join(', ');
      }

      // derive retire date
      if (
        application.statusHistoryEffectiveDate &&
        [
          StatusCodes.DECISION_APPROVED.code,
          StatusCodes.DECISION_NOT_APPROVED.code,
          StatusCodes.ABANDONED.code
        ].includes(ConstantUtils.getCode(CodeType.STATUS, application.status))
      ) {
        application.meta.retireDate = moment(application.statusHistoryEffectiveDate)
          .endOf('day')
          .add(6, 'months')
          .toDate();
        // set flag if retire date is in the past
        application.meta.isRetired = moment(application.meta.retireDate).isBefore();
      }

      return of(application);
    }

    // TODO - Marcelo

    const application_stub = new Application({
          '_id': 123456789,
          'agency': 'Crown Land Allocation',
          'areaHectares': 2.5,
          'businessUnit': 'SK - LAND MGMNT - SKEENA FIELD OFFICE',
          'centroid': [
              -130.2898393371777,
              54.019088770013575
            ],
          'cl_file': 6406200,
          'client': 'ABC SERVICES CORP.',
          '_createdBy': 'idir\\mmedeiro',
          'createdDate': '2021-01-10',
          'description': 'A high-level description of this application.',
          'isDeleted': false,
          'legalDescription': 'A detailed description of the subject land.',
          'location': 'Porcher Island',
          'name': '6406200',
          'publishDate': '2018-11-07T21:59:58.000Z',
          'status': 'ACCEPTED',
          'reason': 'OFFER NOT ACCEPTED',
          'subtype': 'LICENCE OF OCCUPATION',
          'tantalisID': 926028,
          'tenureStage': 'APPLICATION',
          'meta': {
            'region': 'Cariboo',
            'cpStatusStringLong': 'Approved',
            'clFile': '123456789',
            'applicants': 'Me applying',
            'numComments': 3,
            // retireDate: Date;
            'isRetired': false,
            // isPublished: boolean;
            // isCreated: boolean;
          }
        });

        // TODO - Marcelo
        console.log('just logging... ' + this.applicationService);
        return of(application_stub);

    // view/edit existing application
    // return this.applicationService.getById(appId, {
    //   getFeatures: true,
    //   getDocuments: true,
    //   getCurrentPeriod: true,
    //   getDecision: true
    // });
  }
}
