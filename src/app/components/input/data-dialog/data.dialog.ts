import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { DataElement } from '../../../model/model.module';
import { DataDialogInterface } from './data.dialog.interface';

@Component({
  selector: 'data-dialog',
  templateUrl: 'data.dialog.html',
  styleUrls: ['data.dialog.scss']
})
export class DataDialog {
  dataElement: DataElement = new DataElement(null, null, null, null);

  constructor(
    public dialogRef: MatDialogRef<DataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialogInterface,
    private _formBuilder: FormBuilder
  ) {
  }
}
