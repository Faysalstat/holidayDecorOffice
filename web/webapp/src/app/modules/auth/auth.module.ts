import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedCompsModule } from '../components/dashboard/shared-comps/shared-comps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedCompsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [ResetPasswordComponent],
})
export class AuthModule {}
