import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { AlertService } from '../shared/services/alert/alert.service';

@Component({
  selector: 'tcc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          if (this.returnUrl === undefined || this.returnUrl == null || this.returnUrl === '') {
            this.returnUrl = '/';
          }
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log("Error logging in");
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
