import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Criteria, CriteriaTypeKeys, CriteriaTypes, CriteriaValue } from '../../../model/model.module';
import { MatDialog } from '@angular/material';
import { CriteriaValueDialog } from '../criteria-value-dialog/criteria-value.dialog';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'criteria-input',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnChanges {
  @Input() name: string;
  @Input() type: CriteriaTypes;
  @Input() value: Criteria;
  @Input() showType = true;
  @Input() showId = true;
  @Input() showValues = true;
  @Output() valueChange: EventEmitter<Criteria> = new EventEmitter<Criteria>();

  types = CriteriaTypeKeys;
  lock = {};
  criteriaValues = [];

  constructor(private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  typeChange(type: CriteriaTypes) {
    this.value.type = type;
    this.change();
  }

  change(event ?) {
    this.valueChange.emit(this.value);
    this.update();
  }

  update() {
    this.changeDetector.detectChanges();
  }

  deleteValue(name) {
    if (!isNullOrUndefined(name)) {
      this.value.values.delete(name);
      this.criteriaValues.splice(this.criteriaValues.indexOf(name), 1);
      this.change();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.value.lock.forEach((value, key) => this.lock[key] = value);
    this.criteriaValues = Array.from(this.value.values).map(entry => entry[1]);
  }

  criteriaValueChange(change: { value: CriteriaValue, oldName: string }) {
    if (change && change.oldName) {
      this.value.values.delete(change.oldName);
    }
    this.value.values.set(change.value.name, change.value);
    this.change();
  }

  addCriteriaValue(): void {
    const addNewCriteriaValueDialogRef = this.dialog.open(CriteriaValueDialog, {
      data: {criteriaName: this.value.id, type: this.value.type}
    });

    addNewCriteriaValueDialogRef.afterClosed().subscribe((result: CriteriaValue) => {
      if (!result) {
        return;
      }

      this.criteriaValueChange({value: result, oldName: result.name});
      this.criteriaValues.push(result);
    })
  }
}
