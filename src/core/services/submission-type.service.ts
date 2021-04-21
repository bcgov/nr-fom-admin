import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SubmissionTypeCodeDto,
  SubmissionTypeCodeApi as RxJsSubmissionTypeCodeApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with SubmissionTypeCodes.
 *
 * @export
 * @class SubmissionTypeService
 */
@Injectable()
export class SubmissionTypeService implements IAbstractService<SubmissionTypeCodeDto> {
  protected submissionTypeCodeApi: RxJsSubmissionTypeCodeApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private submissionTypeCodeApi: RxJsSubmissionTypeCodeApi
  ) {
    try {
      // @ts-ignore
      this.submissionTypeCodeApi = new RxJsSubmissionTypeCodeApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<SubmissionTypeCodeDto[]> {
    return this.submissionTypeCodeApi.submissionTypeCodeControllerFindAll();
  }
}
