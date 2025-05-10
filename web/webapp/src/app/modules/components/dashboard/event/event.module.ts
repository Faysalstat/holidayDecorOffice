import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { SharedCompsModule } from '../shared-comps/shared-comps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { ToastModule } from 'primeng/toast';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceComponent } from './invoice/invoice.component';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EventDetailsComponent,
    InvoiceComponent
  ],
  imports: [
      CommonModule,
      SharedCompsModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      ToastModule,
      MatDialogModule,
      InputTextModule,
      RouterModule.forChild([
        { path: 'list', component: ListComponent },
        { path: 'create', component: CreateComponent },
        { path: 'edit/:id', component: CreateComponent },
        { path: 'view/:id', component: EventDetailsComponent },
      ]),
    ],
    providers: [MessageService,DialogService,DatePipe],
})
export class EventModule { }
