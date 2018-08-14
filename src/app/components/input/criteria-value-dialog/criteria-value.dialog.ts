import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CriteriaValueDialogInterface } from './criteria-value.dialog.interface';
import { CriteriaTypeKeys, CriteriaTypes, CriteriaValue } from '../../../model/model.module';

@Component({
  selector: 'criteria-value-dialog',
  templateUrl: 'criteria-value.dialog.html',
  styleUrls: ['criteria-value.dialog.scss']
})
export class CriteriaValueDialog {
  criteriaValue: CriteriaValue = new CriteriaValue(this.data.criteriaName, this.data.criteriaName + '-value-placeholder');
  type: CriteriaTypes = this.data.type;
  types = CriteriaTypeKeys;

  constructor(
    public dialogRef: MatDialogRef<CriteriaValueDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CriteriaValueDialogInterface) {
  }
}
