import { Component, EventEmitter,AfterViewInit,  Output, ViewChild ,ElementRef,HostListener,OnInit} from '@angular/core'
import { isError } from "util";
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { id } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  chats:any=[];
  defaultNavActiveId = 1;
messages:any=[];
messageToSend:any={};
idChat:any="";
intervalRef:any;
ind:string="";
loadingMessages=true;
submittedMessage = false;
showMessages = false;
public isError = false;
messageForm: FormGroup = new FormGroup({
  text: new FormControl(''),
});


  constructor( public _butler:Butler,
    private formBuilder: FormBuilder,  private ngxService: NgxUiLoaderService,
    public dataApiService: DataApiService,) {
      
     }
loadChats(){  this.dataApiService.getAllChats().subscribe(response=>{
  this.chats=response;
});}
  ngOnInit(): void { }

    // loadMessages(id:any){
    //   this.dataApiService.getMessages(id).subscribe(response=>{
    //     let chatMessages=response;
    //     this.chatMessages=chatMessages;
    //   });
    // }
sendMessage(){
  this.submittedMessage = true;
  if (this.messageForm.invalid) {
    this.isError = true;
    
    return;
  }

console.log("este"+this.messageForm.value.text);

this.messageToSend.text=this.messageForm.value.text;
this.messageToSend.idChat=this.idChat;
this.messageToSend.sender="soportista";
this.dataApiService.saveMessage(this.messageToSend).subscribe(response=>{
  this.messageForm = this.formBuilder.group(
    {
      text: ['', Validators.required],
    }
  );
});
}

deleteChat(){

  this.dataApiService.deleteMessage( this.idChat).subscribe(Response=>{

  });
  this.dataApiService.deleteChat( this.ind).subscribe();
}
cancelDeleteChat(){}
loadMessagesBy(ind:any){

  let indi ="m"+ind;

  this.intervalRef = setInterval(() => {
    console.log("indi" +indi);
    this.idChat=indi;
    this.dataApiService.getMessagesBy(indi).subscribe(response=>{
      this.messages=response;
      this.showMessages=true;
    });
     }, 1000);


}

 detenerInterval() {
  this.loadingMessages=false;
  clearInterval(this.intervalRef);
  console.log('setInterval detenido');
}
seeChatseeMessages(i:any){
  this.detenerInterval();
    this.messages=[];
    this.ind=this.chats[i].id;
    this.loadMessagesBy(this.ind);
    this.loadingMessages=true;

}
get M ():{ [key: string]: AbstractControl } {
  return this.messageForm.controls;
}
  ngAfterViewInit(): void {
    this.showMessages = false;
    setInterval(() => {

      if(this.loadingMessages){
        this.loadChats();
      }
     
       }, 1000);
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
