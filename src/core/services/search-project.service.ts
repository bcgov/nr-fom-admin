import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProjectDto, ProjectsService } from '../api';

@Injectable()
export class SearchProjectService {
  public isError = false;

  constructor(private projectsSvc: ProjectsService) {}

  getProjects(): Observable<ProjectDto[]> {
    return this.projectsSvc.projectsControllerFindAll();
  }

  getProjectsByFspId(fspId: string): Observable<ProjectDto[]> {
    return this.projectsSvc.projectsControllerFindByFspId(parseInt(fspId));
  }
}
