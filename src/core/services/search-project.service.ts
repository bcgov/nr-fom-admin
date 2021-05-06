import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProjectDto, ProjectsService, ProjectService } from '../api';

@Injectable()
export class SearchProjectService {
  public isError = false;

  constructor(private projectsSvc: ProjectsService,
              private projectSvc: ProjectService) {}

  getProjects(): Observable<ProjectDto[]> {
    return this.projectsSvc.projectsControllerFindAll();
  }

  getProjectsByFspId(fspId: string): Observable<ProjectDto[]> {
    return this.projectSvc.projectControllerFindByFspId(parseInt(fspId));
  }
}
