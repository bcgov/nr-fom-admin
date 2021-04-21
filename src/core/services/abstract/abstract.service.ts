import { Observable } from 'rxjs';
// @ts-ignore - no error here not sure what's up
import { RxjsAuthInterceptor } from '../../api-client/rxjs-auth-interceptor';
import { Configuration } from '../../api-client/typescript-rxjs';
import {count} from 'rxjs/operators';

export interface IAbstractService<T> {
  getById?: (id: number) => Observable<T>;
  getAll: () => Observable<T[]>;
  getCount?: () => Observable<number>;
  add?: (item: T) => Observable<T>;
  save?: (item: T) => Observable<T>;
  delete?: (item: T) => Observable<T>;
  publish?: (item: T) => Observable<T>;
  unpublish?: (item: T) => Observable<T>;
}

export const serviceConfiguration = {...{
  basePath: 'http://localhost:3333',
  // TODO: Hook up middleware
  middleware: []
}, ...RxjsAuthInterceptor.Instance } as Configuration;

export class BaseService<T> implements IAbstractService<T> {
  getAll(): Observable<T[]> {
    return new Observable<T[]>();
  }

  getCount(): Observable<number> {
    return this.getAll().pipe(count())
  }
}
