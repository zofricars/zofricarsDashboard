import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
userActive:any={
  userType:"none"
};
  isLoading: boolean;
  constructor(
      public dataApiService: DataApiService,
    public _butler:Butler,
    private router: Router
    ) { 
    router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });    
  }
  ngOnInit(): void {
     // this.type=this._butler.userActive[0].userType;
     // console.log("userType" + this.userActive.userType); 
   }
}
