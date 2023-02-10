import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
@Component({
  selector: 'app-partslist',
  templateUrl: './partslist.component.html',
  styleUrls: ['./partslist.component.scss']
})
export class PartslistComponent implements OnInit, AfterViewInit {
  cards$:any=[];
  products$:any=[];
  defaultNavActiveId = 1;

  constructor(

    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { }
 getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response
    });
 }
 getParts(){
    this.dataApiService.getAllProducts().subscribe(response => {
      this.ngxService.stop("loader-01");
    this.products$ = response
    });
 }
 getMyParts(){
    this.dataApiService.getPartsById(this._butler.userd).subscribe(response => {
      this.ngxService.stop("loader-01");
    this.products$ = response
    });
 }
  ngOnInit(): void { 
    
  }

  ngAfterViewInit(): void {
    if (this._butler.type=='admin'){  

    this.ngxService.start("loader-01");
      this.getParts();
    }
    if (this._butler.type=='member'){  

    this.ngxService.start("loader-01");
      this.getMyParts();
    }
    // Show chat-content when clicking on chat-item for tablet and mobile devices
    document.querySelectorAll('.chat-list .chat-item').forEach(item => {
      item.addEventListener('click', event => {
        document.querySelector('.chat-content')!.classList.toggle('show');
      })
    });

  }

  // back to chat-list for tablet and mobile devices
  backToChatList() {
    document.querySelector('.chat-content')!.classList.toggle('show');
  }

  save() {
    console.log('passs');
    
  }

}
