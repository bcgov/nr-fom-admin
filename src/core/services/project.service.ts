import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { count } from 'rxjs/operators';

import {
  ProjectDto,
  ProjectsApi as RxJsProjectsApi,
  ProjectApi as RxJsProjectApi
} from '../api-client/typescript-rxjs';

import { BaseService, IAbstractService, serviceConfiguration} from './abstract/abstract.service';

@Injectable()
export class ProjectService extends BaseService<ProjectDto>
  implements IAbstractService<ProjectDto> {
  protected projectsApi: RxJsProjectsApi;
  protected projectApi: RxJsProjectApi;

  constructor(
    // TODO: Set up DI for these APIs
    // private projectsApi: RxJsProjectsApi,
    // private projectApi: RxJsProjectApi
  ) {
    super();

    try {
      this.projectsApi = new RxJsProjectsApi(serviceConfiguration);
      this.projectApi = new RxJsProjectApi(serviceConfiguration);
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<ProjectDto[]> {
    return this.projectsApi.projectsControllerFindAll();
  }

  getByFspId(fspId: number): Observable<ProjectDto[]> {
    return this.projectsApi.projectsControllerFindByFspId({ id: fspId });
  }

  getById(projectId: number): Observable<ProjectDto> {
    return this.projectApi.projectControllerFindOne({ id: projectId });
  }
}