import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { DecorationItemsComponent } from './decoration-items/decoration-items.component';
import { GallaryComponent } from './gallary/gallary.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'community', loadChildren: () => import('./community/community.module').then(m => m.CommunityModule) },
        { path: 'events', loadChildren: () => import('./event/event.module').then(m => m.EventModule) },
        { path: 'items', component:DecorationItemsComponent},
        { path: 'config', component:AppConfigComponent },
        { path: 'gallary', component:GallaryComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
