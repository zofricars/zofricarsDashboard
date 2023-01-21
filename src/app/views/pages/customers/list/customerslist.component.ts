import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
@Component({
  selector: 'app-customerslist',
  templateUrl: './customerslist.component.html',
  styleUrls: ['./customerslist.component.scss']
})
export class CustomerslistComponent implements OnInit, AfterViewInit {
 

  constructor(
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { }
 
  ngOnInit(): void { 

  }

  ngAfterViewInit(): void {



  }

  // back to chat-list for tablet and mobile devices


}
