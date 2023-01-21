import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';
// import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthRESTService } from '@services/authREST.service';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, AfterViewInit {
  cards$:any=[];
  memberToUpdate:any;
  defaultNavActiveId = 1;
  constructor(
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    public _butler:Butler,
    public dataApiService: DataApiService,
    // private formBuilder: FormBuilder,
    public AuthRESTService:AuthRESTService
  ){}

  ngOnInit(): void { 

  }
  test(i:any){
    console.log("activated for: "+i);
  }

  memberActivate(i:any){
    this.memberToUpdate=this.cards$[i];
    this.memberToUpdate.status="activated";
    let id = this.memberToUpdate.id;
    this.dataApiService.memberUpdate(this.memberToUpdate , id).subscribe()
  }
  getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
      this.cards$ = response
    });
  }
  ngAfterViewInit(): void {
    this.getCards();
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
