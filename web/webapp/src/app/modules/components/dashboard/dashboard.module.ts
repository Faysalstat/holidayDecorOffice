import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/material.module';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppConfigComponent } from './app-config/app-config.component';
import { SharedCompsModule } from './shared-comps/shared-comps.module';
import { DecorationItemsComponent } from './decoration-items/decoration-items.component';
@NgModule({
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        MaterialModule,
        SharedCompsModule
    ],
    declarations: [DashboardComponent, AppConfigComponent, DecorationItemsComponent],
    providers:[MessageService]
})
export class DashboardModule { }
