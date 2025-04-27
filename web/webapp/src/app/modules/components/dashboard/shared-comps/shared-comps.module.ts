import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CurrencyDirective } from 'src/app/directives/currency.directive';



@NgModule({
  declarations: [
    CurrencyDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ToastModule,
    PanelMenuModule,
    
  ],
  exports: [
    CurrencyDirective
  ]
})
export class SharedCompsModule { }
