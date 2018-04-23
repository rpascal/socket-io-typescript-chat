import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../chat/shared/model/user';
import { AlertService } from '../shared/services/alert/alert.service';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { UserService } from '../shared/services/user/user.service';


@Component({
  selector: 'tcc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;


  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) { }


  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  public register() {
    this.loading = true;

    const model: User = {
      username: this.registerForm.get("username").value,
      password: this.registerForm.get("password").value,
    };
    this.userService.create(model)
      .subscribe(
        data => {
          this.alertService.success('Registration successful');

          this.authenticationService.login(model.username, model.password)
            .subscribe(() => {
              this.router.navigate(["/"]);
              this.loading = false;
            },
              error => {
                console.log("Error logging in");
                this.router.navigate(['/login']);
                this.loading = false;
              });

        },
        error => {
          this.alertService.error(error);
          this.loading = false;

        });
  }


}
