import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Criteria } from '../../../model/model.module';
import { MatDialog } from '@angular/material';
import { CriteriaDialog } from '../criteria-dialog/criteria.dialog';

@Component({
  selector: 'criteria-array-input',
  templateUrl: './criteria.array.component.html',
  styleUrls: ['./criteria.array.component.scss']
})
export class CriteriaArrayComponent {
  @Input() value: Criteria[] = [];
  @Input() defaultConfiguration;
  @Output() valueChange: EventEmitter<Criteria[]> = new EventEmitter<Criteria[]>();
  @Input() changed: number;
  _open = [];

  constructor(private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  update() {
    this.changeDetector.detectChanges();
  }

  addNewCriteriaDialog(): void {
    const addNewCriteriaDialogRef = this.dialog.open(CriteriaDialog, {
      data: {defaultConfiguration: this.defaultConfiguration}
    });

    addNewCriteriaDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.value.push(result);

      this.valueChange.emit(this.value);
      this.update();
    })
  }

  move(from, to) {
    if (0 <= to && to < this.value.length) {
      const element = this.value[from];
      const result = [];
      this.value.forEach((val, index) => {
        if (index === to && from > to) {
          result.push(element);
        }
        if (index !== from) {
          result.push(val);
        }
        if (index === to && from <= to) {
          result.push(element);
        }
      });

      //this.value.splice(to, 0, element);
      this._open[from] = false;
      this._open[to] = true;
      this.valueChange.emit(result);
      this.update();
    }
  }

  delete(index: number) {
    this.value.splice(index, 1);
    this.valueChange.emit(this.value);
    this.update();
  }

  change() {
    this.valueChange.emit(this.value);
  }
}
