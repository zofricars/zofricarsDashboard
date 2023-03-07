import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
import { AbstractControl, FormBuilder, UntypedFormGroup, UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.scss']
})
export class MemberlistComponent implements OnInit, AfterViewInit {
  idSelected:any;
  looking:any=999999999;
  show:any=false;
  editing2:boolean=false;
  editingProduct:boolean=false;
  editing:any=false;
  showDetail:any=false;
  showProductDetail:any=true;
  cards$:any=[];
  cardToSee:any={};
  parts$:any=[];
  cars$:any=[];
  toUpdate:any={};
  infoProfile:any={};
  partsSize:number=0;
  carsSize:number=0;
  defaultNavActiveId = 1;
  mostrarDiv = false;
  submitted = false;
  editForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    direction: new FormControl(''),
    phone: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
  });
  constructor(
    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    public formBuilder: UntypedFormBuilder
    ) { }
  
delete(){}
cancelDelete(){}
  mostrar(indice:any) {
    let i=indice;
    this.looking=i;
    this.mostrarDiv = true;
  }

  ocultar(indice:any) {
    let i=indice;
    this.looking=i;
    this.mostrarDiv = false;
  }
  getCards(){


    this.ngxService.start("loader-01");
    this.dataApiService.getAllCards().subscribe(response => {

      this.ngxService.stop("loader-01");
    this.cards$ = response
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }
  showProductDetailR(indice:any){
    let i=indice;
    this.looking=i;
    // this.showProductDetail=!this.showProductDetail;
  }
  cancel(){}
  memberEdit(){
  
    this.editing=!this.editing;
    this.infoProfile=this.cardToSee;
    this.editForm = this.formBuilder.group({
      name : [this.infoProfile.name, Validators.required],
      direction : [this.infoProfile.direction, Validators.required],
      phone : [this.infoProfile.phone, Validators.required],
      facebook : [this.infoProfile.facebook, ],
      instagram : [this.infoProfile.instagram, ]
    });
  }
  guardar(){}
  showDetailChange(){   
    this._butler.partsSelected=false;
    this._butler.carsSelected=false;
    if(this.showDetail){
      this._butler.carsSelected=true;
      this._butler.partsSelected=false;
      this.cars$=[];
      this.ngxService.start("loader-01");
      this.dataApiService.getCarsById(this.cardToSee.userd).subscribe(response =>{
        this.ngxService.stop("loader-01");
        this.cars$=response;  
        this.carsSize=this.cars$.length;
        this.show=true;
      });

      
    }
    this.showDetail=!this.showDetail;
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


  loadCarsById2(card:any){  
    this._butler.memberPrev=false;

    this.idSelected=card.userd;
    let id=card.userd;
    this.cardToSee=card;
    this.cardToSee.image=card.images[0];
    if(!this.showDetail){
      this._butler.carsSelected=true;
      this._butler.partsSelected=false;
      this.cars$=[];
      this.ngxService.start("loader-01");
      this.dataApiService.getCarsById(id).subscribe(response =>{
        this.ngxService.stop("loader-01");
        this.cars$=response;  
        this.carsSize=this.cars$.length;
        this.show=true;
      });
    }
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
  saveInfo(){
    this.submitted = true;

    console.log("se ejecuta");
    if (this.editForm.invalid) {
      console.log("error en el formulario");
      return;
    }
   
    this.ngxService.start("loader-01");
    this.toUpdate=this.editForm.value; 
    this.toUpdate.images=this.infoProfile.images;
   
    this.toUpdate.rut=this.infoProfile.rut;
    this.toUpdate.adminName=this.infoProfile.adminName;
    this.toUpdate.adminPhone=this.infoProfile.adminPhone;
    this.toUpdate.userd=this.infoProfile.userd;
    // this.toUpdate.name=this.infoProfile.name;
    this.toUpdate.email=this.infoProfile.email;
    this.toUpdate.status=this.infoProfile.status;
    this.toUpdate.userType=this.infoProfile.userType;
    this.toUpdate.profileStatus=this.infoProfile.profileStatus;
    let id =this.infoProfile.id;
    

   if(this._butler.memberPrev==true){  
    console.log("entra cuando hay una carga previa de member");
    this.dataApiService.cardUpdate(this.toUpdate,this._butler.memberIdPrev).subscribe(response=>{
    this.ngxService.stop("loader-01");
      this.editing=false;
      this.dataApiService.getCardByUserId(this._butler.userd).subscribe(
        data =>{
          this.cardToSee=this.toUpdate;
          this.cardToSee.image=this.toUpdate.images[0];
      
          this._butler.userActive=data;
          // Swal.fire('Información editada con éxito','presione Ok para continuar','success');mages;
          this._butler.name=this._butler.userActive[0].name;
          this._butler.email=this._butler.userActive[0].email;
          this._butler.profileStatus=this._butler.userActive[0].profileStatus;
          this.getCards();
      
        });    
    });
  }
  if(this._butler.memberPrev==false){  
    console.log("id to update:" +id);
     this.dataApiService.cardUpdate(this.toUpdate,id).subscribe(response=>{
      this._butler.memberIdPrev=id;
      this._butler.memberPrev=true;
      console.log("id de yeoman:" +this._butler.memberIdPrev +"flag:" +this._butler.memberPrev);
    this.ngxService.stop("loader-01");
    this.editing=false;
    this.dataApiService.getCardByUserId(this._butler.userd).subscribe(
      data =>{
        this.cardToSee=this.toUpdate;
        this.cardToSee.image=this.toUpdate.images[0];
       
        
        this._butler.userActive=data;
        // Swal.fire('Información editada con éxito','presione Ok para continuar','success');mages;
        this._butler.name=this._butler.userActive[0].name;
        this._butler.email=this._butler.userActive[0].email;
        this._butler.profileStatus=this._butler.userActive[0].profileStatus;
        this.getCards();
    
      });    
  });}

  
  }
  
  

}
