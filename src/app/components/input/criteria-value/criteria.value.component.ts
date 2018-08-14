import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CriteriaTypes, CriteriaValue } from '../../../model/model.module';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'criteria-value-input',
  templateUrl: './criteria.value.component.html',
  styleUrls: ['./criteria.value.component.scss']
})
export class CriteriaValueComponent {
  @Input() value: CriteriaValue;
  @Input() type: CriteriaTypes;
  @Output() valueChange: EventEmitter<{ value: CriteriaValue, oldName: string }> = new EventEmitter<{ value: CriteriaValue, oldName: string }>();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  changeName(newName: string) {
    if (!isNullOrUndefined(newName) && newName.length > 0) {
      const name = this.value.name;
      this.value.name = newName;
      this.valueChange.emit({value: this.value, oldName: name});
      this.update();
    }
  }

  change(event?) {
    this.valueChange.emit({value: this.value, oldName: this.value.name});
    this.update();
  }

  update() {
    this.changeDetector.detectChanges();
  }
}
