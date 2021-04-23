import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ProjectDto,
  ProjectsService as NgProjectsService,
  ProjectService as NgProjectService
} from '../api';

import { BaseService, IAbstractService, serviceConfiguration} from './abstract/abstract.service';

@Injectable()
export class ProjectService extends BaseService<ProjectDto>
  implements IAbstractService<ProjectDto> {

  constructor(
    // TODO: Set up DI for these APIs
    private projectsSvc: NgProjectsService,
    private projectSvc: NgProjectService
  ) {
    super();

    try {
    } catch (err)  {
      console.log(err);
    }
  }

  getAll(): Observable<ProjectDto[]> {
    return this.projectsSvc.projectsControllerFindAll();
  }

  getByFspId(fspId: number): Observable<ProjectDto[]> {
    return this.projectsSvc.projectsControllerFindByFspId(fspId);
  }

  getById(projectId: number): Observable<ProjectDto> {
    return this.projectSvc.projectControllerFindOne(projectId);
  }
}
