import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { CountryService } from './modules/shared-services/country.service';
import { CustomerService } from './modules/shared-services/customer.service';
import { EventService } from './modules/shared-services/event.service';
import { IconService } from './modules/shared-services/icon.service';
import { NodeService } from './modules/shared-services/node.service';
import { PhotoService } from './modules/shared-services/photo.service';
import { ProductService } from './modules/shared-services/product.service';
import { AppLayoutModule } from './modules/layout/app.layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { DateOnlyDirective } from './directives/date-only.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './interseptor/request.interceptor';
import { UIkitModule } from './modules/components/uikit/uikit.module';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, DateOnlyDirective
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserAnimationsModule,
        MaterialModule,
        UIkitModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
