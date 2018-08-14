import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Configuration, CriteriaData, DataElement, Label } from '../../../model/model.module';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'data-input',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnChanges {
  @Input() name: string;
  @Input() configuration: Configuration;
  @Input() value: DataElement;
  @Output() valueChange: EventEmitter<DataElement> = new EventEmitter<DataElement>();
  criteriaDataTypes = [];
  criteriaDataValues = [];
  criteriaDataValuesLabels = [];
  index = [];
  labels = [];
  labelOptions = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  change(event?) {
    this.valueChange.emit(this.value);
    this.update();
  }

  update() {
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const criteriaDataTypes = [];
    const criteriaDataValues = [];
    const criteriaDataValuesLabels = [];
    const labels = [];
    const labelOptions = [];

    this.configuration.criteria
      .filter(criteria => criteria.id !== 'id' && criteria.id !== 'description')
      .forEach(criteria => {
        let criteriaDataElement;

        if (this.value.criteriaData.has(criteria.id)) {
          criteriaDataElement = this.value.criteriaData.get(criteria.id);
        } else if (this.value.criteriaData.has(criteria.name)) {
          criteriaDataElement = this.value.criteriaData.get(criteria.name);
        } else {
          criteriaDataElement = new CriteriaData(criteria.id, '', new Map());
        }

        const labelArray =
          Array.from(criteriaDataElement.labels).map(([key, value]) => value);
        this.criteriaDataValuesLabels.push(labelArray);

        const formControl = new FormControl();
        formControl.setValue(labelArray);
        const length = criteriaDataValuesLabels.length;
        formControl.valueChanges.subscribe(value => {
          this.criteriaDataValuesLabels[length] = value;
        });

        const lOptions = [];
        Array.from(criteria.values).forEach(([key, value]) => {
          if (criteriaDataElement.labels.has(key)) {
            lOptions.push(criteriaDataElement.labels.get(key));
          } else {
            lOptions.push(new Label(key));
          }
        });

        criteriaDataTypes.push(criteria.type);
        criteriaDataValues.push(criteriaDataElement);
        criteriaDataValuesLabels.push(labelArray);
        labels.push(formControl);
        labelOptions.push(lOptions);

      });

    this.criteriaDataTypes = criteriaDataTypes;
    this.criteriaDataValues = criteriaDataValues;
    this.criteriaDataValuesLabels = criteriaDataValuesLabels;
    this.labels = labels;
    this.labelOptions = labelOptions;
  }

  criteriaDataValueChange(change: { value: CriteriaData, oldName: string }) {
    if (change && change.oldName) {
      this.value.criteriaData.delete(change.oldName);
    }
    this.value.criteriaData.set(change.value.name, change.value);
    this.change();
  }
}
