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
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    MaterialModule
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
