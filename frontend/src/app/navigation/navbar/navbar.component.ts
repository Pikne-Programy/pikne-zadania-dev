import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { Tuple } from 'src/app/helper/utils';
import {
  ButtonElement,
  executeButtonClick,
  menuElements,
  NavService,
} from '../navingation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  sideNavOpened: boolean = false;
  showTabs: boolean = false;
  menuElements: Tuple<string, string, null>[];
  buttonElements?: ButtonElement[];

  private openedSub?: Subscription;
  private buttonsSubscription?: Subscription;
  constructor(
    private navService: NavService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.menuElements = menuElements;
  }

  ngOnInit() {
    this.openedSub = this.navService.sideNavOpened.subscribe((val) => {
      this.sideNavOpened = val;
    });
    this.buttonsSubscription = this.navService.buttonElements.subscribe(
      (array) => {
        this.buttonElements = array;
      }
    );
  }

  ngOnDestroy() {
    this.openedSub?.unsubscribe();
    this.buttonsSubscription?.unsubscribe();
  }

  toggleNavbar() {
    this.navService.toggleSidenav();
  }

  execute(buttonElement: ButtonElement) {
    executeButtonClick(buttonElement, this.router, this.accountService);
  }
}
