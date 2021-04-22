import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _loading = false;

  get loading() {
    return this._loading;
  }

  set loading(state: boolean) {
    this._loading = state
  }
  constructor() { }
}
