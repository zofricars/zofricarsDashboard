import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
@Component({
  selector: 'app-carslist',
  templateUrl: './carslist.component.html',
  styleUrls: ['./carslist.component.scss']
})
export class CarslistComponent implements OnInit, AfterViewInit {
  cards$:any=[];
  cars$:any=[];
  defaultNavActiveId = 1;


  constructor(

    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { }
   getCards(){
      this.dataApiService.getAllCards().subscribe(response => {
        this.ngxService.stop("loader-01");
      this.cards$ = response
      });
   }
   getCars(){
      this.dataApiService.getAllCars().subscribe(response => {
        this.ngxService.stop("loader-01");
      this.cars$ = response
      });
   }
   getMyCars(){
      this.dataApiService.getCarsById(this._butler.userd).subscribe(response => {
        this.ngxService.stop("loader-01");
      this.cars$ = response
      });
   }
  ngOnInit(): void { 
    
  }

  ngAfterViewInit(): void {
    if (this._butler.type=='admin'){  
      this.ngxService.start("loader-01");
      this.getCars();
    }
    if (this._butler.type=='member'){  
      this.ngxService.start("loader-01");
      this.getMyCars();
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
