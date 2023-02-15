import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss']
})
export class MemberlistComponent implements OnInit, AfterViewInit {
  idSelected:any;
  show:any=false;
  editing:any=false;
  showDetail:any=false;
  cards$:any=[];
  cardToSee:any={};
  parts$:any=[];
  cars$:any=[];
  partsSize:number=0;
  carsSize:number=0;
  defaultNavActiveId = 1;

  constructor(
    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { }
  getCards(){

    this.ngxService.start("loader-01");
    this.dataApiService.getAllCards().subscribe(response => {

      this.ngxService.stop("loader-01");
    this.cards$ = response
    });
  }
  showDetailChange(){
    this.showDetail=!this.showDetail;
    this._butler.partsSelected=false;
    this._butler.carsSelected=false;
  }
  loadPartsById(card:any){
    this.idSelected=card.userd;
    let id=card.userd;
    this.cardToSee=card;
    this.cardToSee.image=card.images[0];
    if(!this.showDetail){
      this._butler.carsSelected=false;
      this._butler.partsSelected=true;
      this.parts$=[];
      this.ngxService.start("loader-01");
      this.dataApiService.getPartsById(id).subscribe(response =>{
        this.ngxService.stop("loader-01");
        this.parts$=response;  
        this.partsSize=this.parts$.length;
        this.show=true;
      });
    }
  }
  setEditing(){}
  loadCarsById(){
//    this.cards$=[];

    this.ngxService.start("loader-01");
    this.dataApiService.getCarsById(this.idSelected).subscribe(response =>{

      this.ngxService.stop("loader-01");
      this.cars$=response;
      this.carsSize=this.cars$.length;
      console.log("carssize: "+this.carsSize);
    this.show=true;
    });
  }
  ngOnInit(): void { 
    this.getCards();
  }
  setCars(){

    this.showDetail=false;
    this.parts$=[];
    this.cars$=[];
    this.loadCarsById();
    console.log("seteado a cars");
    this._butler.carsSelected=true;
    this._butler.partsSelected=false;}
  setParts(){
    this.showDetail=false;
    this.parts$=[];
    this.cars$=[];
    this.loadPartsById(this.cardToSee);
    console.log("seteado a parts");
    this._butler.carsSelected=false;
    this._butler.partsSelected=true;}

  ngAfterViewInit(): void {

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
