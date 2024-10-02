import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  faChevronDown, faChevronLeft, faChevronRight,
  faChevronUp, faCog, faCogs,
  faCommentDots, faDatabase, faHandsHelping,
  faLaughWink, faMoneyCheck, faSignOutAlt,
  faTachometerAlt, faUserFriends, faUserShield,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {


  isAdvisorsMenuOpen = false;
  isSidebarOpen: boolean = true;
  isMobileView: boolean = false;

  constructor(
      private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  async logout() {
    localStorage.clear();
    await this.router.navigate(['/login']);
  }

  toggleAdvisorsMenu() {
    this.isAdvisorsMenuOpen = !this.isAdvisorsMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView) {
      this.isSidebarOpen = false;
    }
  }

  protected readonly faUserTie = faUserTie;
  protected readonly faCommentDots = faCommentDots;
  protected readonly faTachometerAlt = faTachometerAlt;

  protected readonly faChevronUp = faChevronUp;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faLaughWink = faLaughWink;
  protected readonly faCogs = faCogs;
  protected readonly faHandsHelping = faHandsHelping;
  protected readonly faDatabase = faDatabase;
  protected readonly faMoneyCheck = faMoneyCheck;
  protected readonly faCog = faCog;
  protected readonly faUserFriends = faUserFriends;
  protected readonly faSignOutAlt = faSignOutAlt;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faChevronLeft = faChevronLeft;
    protected readonly faUserShield = faUserShield;

}
