import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class AlertService {

  constructor(private snacker: MatSnackBar) {
  }

  success(message: string) {
    this.snacker.open(message, '', { duration: 4000, extraClasses: ["successSnackBar"] });
  }

  error(message: string) {
    this.snacker.open(message, '', { duration: 4000, extraClasses: ["errorSnackBar"] });
  }

}
