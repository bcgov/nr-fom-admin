import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AttachmentTypeCodeDto,
  AttachmentTypeCodeApi as RxJsAttachmentTypeCodeApi
} from '../api-client/typescript-rxjs';

import { IAbstractService, serviceConfiguration } from './abstract/abstract.service';

/**
 * Provides methods for working with AttachmentTypeCodes.
 *
 * @export
 * @class AttachmentTypeService
 */
@Injectable()
export class AttachmentTypeService implements IAbstractService<AttachmentTypeCodeDto> {
  protected attachmentTypeCodeApi: RxJsAttachmentTypeCodeApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private attachmentTypeCodeApi: RxJsAttachmentTypeCodeApi
  ) {
    try {
      // @ts-ignore
      this.attachmentTypeCodeApi = new RxJsAttachmentTypeCodeApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  /**
   * Get all attachmentTypeCodes.
   *
   * @returns {Observable<AttachmentTypeCode[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<AttachmentTypeCodeDto[]> {
    return this.attachmentTypeCodeApi.attachmentTypeCodeControllerFindAll();
  }
}
