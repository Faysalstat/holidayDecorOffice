import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CurrencyDirective } from 'src/app/directives/currency.directive';
import { EventDetailsComponent } from './event-details/event-details.component';
import { ImageModalComponent } from './comps/image-modal-component';
import { ItemModalComponent } from './comps/item-modal-component';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    CurrencyDirective,
    EventDetailsComponent,
    ImageModalComponent,
    ItemModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ToastModule,
    PanelMenuModule,
    TableModule
    
  ],
  exports: [
    CurrencyDirective,
    EventDetailsComponent,
    ImageModalComponent,
    ItemModalComponent
  ]
})
export class SharedCompsModule { }
