import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatSelectModule, MatSliderModule, MatTabsModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSliderModule,
    MatIconModule,
  ],
})
export class TestingImportsModule { }
