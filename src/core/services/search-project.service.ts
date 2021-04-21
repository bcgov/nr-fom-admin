import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProjectService } from 'core/services/project.service';
import { ProjectDto }  from '../api-client/typescript-rxjs';

@Injectable()
export class SearchProjectService {
  public isError = false;

  constructor(private projectService: ProjectService) {}

  getProjects(): Observable<ProjectDto[]> {
    return this.projectService.getAll();
  }

  getProjectsByFspId(fspId: string): Observable<ProjectDto[]> {
    return this.projectService.getByFspId(parseInt(fspId));
  }
}
