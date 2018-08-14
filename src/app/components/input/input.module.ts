import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SIMPLEMDE_CONFIG, SimplemdeModule } from 'ng2-simplemde';

import { MarkdownComponent } from './markdown/markdown.component';
import { CriteriaComponent } from './criteria/criteria.component';
import { CriteriaArrayComponent } from './criteria-array/criteria.array.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CriteriaValueComponent } from './criteria-value/criteria.value.component';
import { CriteriaDialog } from './criteria-dialog/criteria.dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CriteriaValueDialog } from './criteria-value-dialog/criteria-value.dialog';
import { DataArrayComponent } from './data-array/data.array.component';
import { DataComponent } from './data/data.component';
import { DataDialog } from './data-dialog/data.dialog';
import { ToggleDirective } from './directives/toggle.directive';
import { MccColorPickerModule } from 'material-community-components';

@NgModule({
  declarations: [
    MarkdownComponent,
    CriteriaComponent,
    CriteriaArrayComponent,
    CriteriaValueComponent,
    CriteriaDialog,
    CriteriaValueDialog,
    DataArrayComponent,
    DataComponent,
    DataDialog,
    ToggleDirective
  ],
  imports: [
    BrowserModule,
    SimplemdeModule.forRoot({
      provide: SIMPLEMDE_CONFIG,
      useValue: {
        placeholder: 'placeholder'
      }
    }),
    MatCardModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MccColorPickerModule
  ],
  exports: [
    MarkdownComponent,
    CriteriaComponent,
    CriteriaArrayComponent,
    CriteriaValueComponent,
    DataArrayComponent,
    DataComponent,
    ToggleDirective
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    CriteriaDialog,
    CriteriaValueDialog,
    DataDialog
  ]
})
export class InputModule {
}
