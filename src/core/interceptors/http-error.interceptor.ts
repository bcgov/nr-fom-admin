import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ModalService } from '../services/modal.service';
import { StateService } from 'core/services/state.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private modalSvc: ModalService,
    private stateSvc: StateService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle( request ).pipe(
      tap( () => this.stateSvc.loading = true ),
      finalize(() => this.stateSvc.loading = false),
      catchError((err) => {

        const error = err?.error?.message || err.statusText;
        console.log({
          lvl: 'ERROR',
          mssg: `${request.urlWithParams} failed with error: ${error}`,
        });

        /**
         * Ex: request.url = http://localhost:8200/api/User
         *
         * get the unique part of url
         * return url = '/User'
         */
        const url = request.url.split('api')[1];
        // Not includes in array of urls then show pop up
        if (!['/user', '/applicationsettings'].includes(url.toLowerCase())) {
          this.modalSvc.openDialog({
            data: {
              message: `The request failed to process due to a network error. Please retry`,
              title: `Error: ${err?.error?.message || err.statusText} - ${request.url}`,
              buttons: { cancel: { text: 'Okay' } },
            },
          });
        }
        // this.modalSvc.openCustomDialog(dialogComponent, params);
        return throwError(error);
        // return next.handle(request)
      })
    );
  }
}
