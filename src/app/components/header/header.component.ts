import { SidenavService } from '../../services/sidenav.service';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  opened = true;
  constructor(private authService: AuthService,
              private router: Router,
              private sideNavService: SidenavService,
              ) { }

  isAuth() {
    return this.authService.isAuth();
  }
  clickMenu() {
    this.sideNavService.toggle();
  }
  ngOnInit(): void {
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }
}
