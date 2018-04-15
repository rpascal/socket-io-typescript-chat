
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class AlertService {

  constructor(private snacker: MatSnackBar) {
  }

  success(message: string) {
    this.snacker.open(message, 'Login Success', { duration: 4000, extraClasses: ["successSnackBar"] });
  }

  error(message: string) {
    this.snacker.open(message, 'Login Error', { duration: 4000, extraClasses: ["errorSnackBar"] });
  }

}