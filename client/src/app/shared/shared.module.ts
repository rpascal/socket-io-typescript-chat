import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { AlertService } from './services/alert/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from "./guards/auth.guard";
import { AuthenticationService } from "./services/authentication/authentication.service";
import { UserService } from "./services/user/user.service";
import { ErrorInterceptorProvider } from "./interceptors/error.interceptor";
import { JwtInterceptorProvider } from "./interceptors/jwt.interceptor";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.3)',
      backdropBorderRadius: '4px',
      primaryColour: '#0000ff',
      secondaryColour: '#00ff00',
      tertiaryColour: '#ffffff'
    })
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    JwtInterceptorProvider,
    ErrorInterceptorProvider
  ],
  declarations: []
})
export class SharedModule { }
