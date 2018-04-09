import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild("sidenav") sidenav: MatSidenav;


  constructor(private router: Router, private authenicationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.authenicationService.monitorUserState().subscribe(loggedOn => {
      if (loggedOn) {
        console.log("Logged on");
      } else {
        this.sidenav.close();
        console.log("Logged off");
      }
    })
    this.authenicationService.monitorLoggedOff().subscribe((loggedOff) => {

      if (loggedOff) {
        console.log("route log off");
        this.router.navigate(['/login']);
      }
    })

  }

  private initModel(): void {
  }

  logout() {
    this.authenicationService.logout();
  }

}
