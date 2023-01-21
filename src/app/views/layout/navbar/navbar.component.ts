import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2,AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
cards$:any=[];
  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    public _butler:Butler,
    public dataApiService: DataApiService,
    private router: Router
  ) { }
 getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response;
    let size =this.cards$.length;
    console.log("size" +size);
    this._butler.totalRequest=0;
    for (let i = 0;i<size;i++){
      if(this.cards$[i].status=='pending')
        {
          this._butler.totalRequest=this._butler.totalRequest+1;
        }
      }
      if(this._butler.totalRequest>0){
        this._butler.totalNotifications=this._butler.totalNotifications+1;
      }
    });
 }
  ngAfterViewInit(): void {
    this.getCards();
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

}
