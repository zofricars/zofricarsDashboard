import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: []
})

export class OrdersComponent implements OnInit {
 
  currencyPipe = new CurrencyPipe('es-CL');
  constructor() { }

  ngOnInit() {
  }

}
