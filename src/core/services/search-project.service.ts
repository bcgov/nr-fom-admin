import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProjectDto, ProjectsService } from '../api';

@Injectable()
export class SearchProjectService {
  public isError = false;

  constructor(private projectsService: ProjectsService) {}

  getProjects(): Observable<ProjectDto[]> {
    return this.projectsService.projectsControllerFindAll();
  }

  getProjectsByFspId(fspId: string): Observable<ProjectDto[]> {
    return this.projectsService.projectsControllerFindByFspId(parseInt(fspId));
  }
}
