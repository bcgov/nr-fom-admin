import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { DialogData } from 'core/models/dialog';

import * as R from 'remeda';
import { DialogComponent } from 'core/components/dialog/dialog.component';

export const dialogTypes = ['cancel'] as const;

export const ERROR_DIALOG = {
  title: 'Something went wrong with the request.',
  message: 'Please try again.',
  width: '240px',
  height: '300px',
  buttons: {
    cancel: {
      text: 'Close',
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalOpen = false;
  dialogRefClose$: Observable<MatDialogRef<any>>;

  private _errorDialog: DialogData;

  get errorDialog() {
    return this._errorDialog;
  }

  constructor(public dialog: MatDialog) {
    this._errorDialog = R.clone(ERROR_DIALOG);
  }

  /**
   * open custom dialog
   *
   * @param dialogComponent  accetps a component Class
   * @param params
   */
  openCustomDialog<T>(dialogComponent: ComponentType<T>, params: MatDialogConfig): MatDialogRef<any> {
    const { data = null, disableClose = false } = params;

    return this.dialog.open(dialogComponent, {
      ...params,
      data,
      width: '90%',
      disableClose,
    });
  }

  openDialog(config: { data: DialogData }): MatDialogRef<any> {
    const { data } = config;
    const { width = null } = data;
    return this.dialog.open(DialogComponent, {
      data,
      width,
    });
  }

  updateDialogRefSubject(ref: MatDialogRef<any>): void {
    this.dialogRefClose$ = ref.afterClosed();
  }
}
