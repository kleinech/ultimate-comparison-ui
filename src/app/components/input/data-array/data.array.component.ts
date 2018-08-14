import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataElement } from '../../../model/model.module';
import { MatDialog } from '@angular/material';
import { DataDialog } from '../data-dialog/data.dialog';

@Component({
  selector: 'data-array-input',
  templateUrl: './data.array.component.html',
  styleUrls: ['./data.array.component.scss']
})
export class DataArrayComponent {
  @Input() value: DataElement[] = [];
  @Input() configuration;
  @Output() valueChange: EventEmitter<DataElement[]> = new EventEmitter<DataElement[]>();
  @Input() changed: number;
  _open = [];

  constructor(private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  update() {
    this.changeDetector.detectChanges();
  }

  delete(index: number) {
    this.value.splice(index, 1);
    this.change();
    this.update();
  }

  addNewDataDialog(): void {
    const addNewDataDialogRef = this.dialog.open(DataDialog, {
      data: {configuration: this.configuration}
    });

    addNewDataDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.value.push(result);
    })
  }

  change() {
    this.valueChange.emit(this.value);
  }
}
