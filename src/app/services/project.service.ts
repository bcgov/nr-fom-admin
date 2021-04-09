import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { Project } from 'app/models/project';
import {
  ProjectDto,
  ProjectsApi as RxJsProjectsApi,
  ProjectApi as RxJsProjectApi
} from '../api-client/typescript-rxjs';

import { RxjsAuthInterceptor } from '../api-client/rxjs-auth-interceptor';


/**
 * Provides methods for working with Applications.
 *
 * @export
 * @class ProjectService
 */
@Injectable()
export class ProjectService {
  public clientType: 'rxjs' | 'axios' = 'axios';
  protected projectsApi: RxJsProjectsApi;
  protected projectApi: RxJsProjectApi;

  constructor(
  // private projectsApi: RxJsProjectsApi,
  // private projectApi: RxJsProjectApi
  ) {
    /* if (ProjectService.clientType === 'axios') {
      this.projectsApi = new AxiosProjectsApi({
        isJsonMime(mime: string): boolean {
          return false;
        },
        basePath: 'http://localhost:8081'
      });
    } else if (ProjectService.clientType === 'rxjs') {
      this.projectsApi = new RxJsProjectsApi();
    } */

    // @ts-ignore
    /* this.projectsApi = new AxiosProjectsApi({
      basePath: 'http://localhost:8081'
    }); */

    try {
      // @ts-ignore
      this.projectsApi = new RxJsProjectsApi({...{
        basePath: 'http://localhost:8081',
        middleware: []
      }, ...RxjsAuthInterceptor.Instance });

      // @ts-ignore
      this.projectApi = new RxJsProjectApi({...{
          basePath: 'http://localhost:8081',
          middleware: []
        }, ...RxjsAuthInterceptor.Instance });
    } catch (err)  {
      console.log(err);
    }
  }

  /**
   * Get all projects.
   *
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
  getAll(): Observable<ProjectDto[]> {
    return this.projectsApi.projectsControllerFindAll();
  }

  /**
   * Get all projects by FspId.
   *
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
  getProjectsByFspId(fspId: number): Observable<ProjectDto[]> {
    return this.projectsApi.projectsControllerFindByFspId({ id: fspId });
  }

  /**
   * Get project by id.
   *
   * @returns {Observable<Project>}
   * @memberof ProjectService
   */
  getProjectById(projectId: number): Observable<ProjectDto> {
    return this.projectApi.projectControllerFindOne({ id: projectId });
  }
}
