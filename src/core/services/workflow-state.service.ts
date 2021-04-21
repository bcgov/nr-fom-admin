import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  WorkflowStateCodeDto,
  WorkflowStateCodeApi as RxJsWorkflowStateCodeApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with WorkflowStateCodes.
 *
 * @export
 * @class WorkflowStateService
 */
@Injectable()
export class WorkflowStateService implements IAbstractService<WorkflowStateCodeDto> {
  protected workflowStateCodeApi: RxJsWorkflowStateCodeApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private workflowStateCodeApi: RxJsWorkflowStateCodeApi
  ) {
    try {
      // @ts-ignore
      this.workflowStateCodeApi = new RxJsWorkflowStateCodeApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<WorkflowStateCodeDto[]> {
    return this.workflowStateCodeApi.workflowStateCodeControllerFindAll();
  }
}
