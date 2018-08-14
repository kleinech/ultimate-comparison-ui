import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CriteriaDialogInterface } from './criteria.dialog.interface';
import { Criteria } from '../../../model/criteria/criteria';
import { CriteriaTypeKeys } from '../../../model/model.module';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'criteria-dialog',
  templateUrl: 'criteria.dialog.html',
  styleUrls: ['criteria.dialog.scss']
})
export class CriteriaDialog implements OnInit {
  idTypeGroup: FormGroup;
  criteria: Criteria;
  types = CriteriaTypeKeys;

  constructor(
    public dialogRef: MatDialogRef<CriteriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CriteriaDialogInterface,
    private _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.idTypeGroup = this._formBuilder.group({
      id: ['', Validators.required],
      type: ['', Validators.required]
    });

    this.idTypeGroup.get('type').valueChanges.subscribe(value => {
      if (this.idTypeGroup.get('id').value) {
        if (isNullOrUndefined(this.criteria) || this.criteria.type !== this.idTypeGroup.get('type').value) {
          this.criteria = Criteria.empty(this.idTypeGroup.get('id').value, value, true, this.data.defaultConfiguration);
        }
      }
    });
  }

  changeCriteria(criteria: Criteria) {
    this.criteria = criteria;
    this.idTypeGroup.setValue({
      id: criteria.id,
      type: criteria.type
    })
  }
}
