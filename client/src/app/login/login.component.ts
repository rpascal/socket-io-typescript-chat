import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { AlertService } from '../shared/services/alert/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'tcc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;
  loginForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
    // reset login status
    this.authenticationService.logout(false);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private createForm() {
    this.loginForm = new FormGroup({
      // tslint:disable-next-line
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  public login() {
    this.loading = true;
    this.authenticationService.login(this.loginForm.get("username").value, this.loginForm.get("password").value)
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

  // login() {
  //   this.loading = true;
  //   this.authenticationService.login(this.model.username, this.model.password)
  //     .subscribe(
  //       data => {
  //         if (this.returnUrl === undefined || this.returnUrl == null || this.returnUrl === '') {
  //           this.returnUrl = '/';
  //         }
  //         this.router.navigate([this.returnUrl]);
  //       },
  //       error => {
  //         console.log("Error logging in");
  //         this.alertService.error(error);
  //         this.loading = false;
  //       });
  // }
}
