import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderlistComponent implements OnInit, AfterViewInit {
  
  show:any=false;
  orders$:any=[];
  cardToSee:any={};
  parts$:any=[];
  defaultNavActiveId = 1;

  constructor(
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { }
  getOrders(){
    this.dataApiService.getAllOrders().subscribe(response => {
    this.orders$ = response
    this._butler.orders=this.orders$;
    // this._butler.orders=this._butler.orders.filter(order => order.amount !== 0);
    this._butler.orders=this._butler.orders.filter(order => order.amount !== 0);
    });
  }
  loadPartsById(card:any){
    let id=card.userd;
    this.cardToSee=card;
    this.dataApiService.getPartsById(id).subscribe(response =>{
      this.parts$=response;
    this.show=true;
    });
  }
  ngOnInit(): void { 
    this.getOrders();
  }
  setCars(){
    console.log("seteado a cars");
    this._butler.carsSelected=true;
    this._butler.partsSelected=false;}
  setParts(){
    console.log("seteado a parts");
    this._butler.carsSelected=false;
    this._butler.partsSelected=true;}
setorder(order:any){
  this._butler.orderdetailseted=true;
  this._butler.orderdetail=order;
}
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
