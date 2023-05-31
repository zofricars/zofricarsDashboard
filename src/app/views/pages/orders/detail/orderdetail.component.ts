import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
@Component({
    selector: 'app-orderdetail',
    templateUrl: './orderdetail.component.html',
    styleUrls: ['./orderdetail.component.scss']
  })
  
  export class OrderdetailComponent implements  AfterViewInit {
    constructor(
        public _butler:Butler,
        public dataApiService: DataApiService,
        ) { }
        formatPhoneNumber(phoneNumber: string): string {
            // Elimina todos los caracteres que no sean dígitos
            const cleaned = phoneNumber.replace(/\D/g, '');
          
            // Aplica el formato deseado
            const regex = /^(\d{2})(\d{3})(\d{4})$/;
            const formatted = cleaned.replace(regex, '+$1 $2 $3 ');
          
            return formatted;
          }
    ngAfterViewInit(): void {

        // Show chat-content when clicking on chat-item for tablet and mobile devices
        document.querySelectorAll('.chat-list .chat-item').forEach(item => {
          item.addEventListener('click', event => {
            document.querySelector('.chat-content')!.classList.toggle('show');
          })
        });
    
      }
   
  
  }