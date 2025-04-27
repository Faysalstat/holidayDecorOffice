import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedCompsModule } from '../shared-comps/shared-comps.module';
import { DialogService } from 'primeng/dynamicdialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [CreateComponent, ListComponent, DetailsComponent],
  imports: [
    CommonModule,
    SharedCompsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
    MatDialogModule,
    RouterModule.forChild([
      { path: 'list', component: ListComponent },
      { path: 'add', component: CreateComponent },
      { path: 'edit/:id', component: CreateComponent },
      { path: 'details/:id', component: DetailsComponent },
    ]),
  ],
  providers: [MessageService,DialogService],
})
export class CommunityModule {}
