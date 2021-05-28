import { Injectable } from '@angular/core';
import { DistrictService, PublicCommentService, ProjectService } from 'core/api';
import { CodeTables } from 'core/models/code-tables';
import { BehaviorSubject, forkJoin } from 'rxjs';

// Eagerly loads and caches all code table values.
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _loading = false;
  private _isReadySub = new BehaviorSubject(false);
  private _codeTables: CodeTables;
  setReady() {
    this._isReadySub.next(true);
  }
  isReady$ = this._isReadySub.asObservable();


  getCodeTable<T extends keyof CodeTables>( key: T ): CodeTables[T] {
    return this._codeTables[key];
  }


  get loading() {
    return this._loading;
  }

  set loading(state: boolean) {
    this._loading = state
  }

  setCodeTables(codeTables: CodeTables) {
    this._codeTables = codeTables

  }

  get codeTables() {
    return this._codeTables;
  }

  constructor (
    private publicCommentSvc: PublicCommentService,
    private districtSvc: DistrictService,
    private projectSvc: ProjectService
    ) { }

  getCodeTables() {
    return forkJoin({
        responseCode: this.publicCommentSvc.responseCodeControllerFindAll(),
        district: this.districtSvc.districtControllerFindAll(),
        workflowResponseCode: this.projectSvc.workflowStateCodeControllerFindAll(),
        commentScopeCode: this.publicCommentSvc.commentScopeCodeControllerFindAll(),
      })
  }
}
