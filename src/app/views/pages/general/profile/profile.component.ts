import { Component, OnInit,ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, UntypedFormGroup, UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthRESTService } from '@services/authREST.service';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
import { HttpClient } from  '@angular/common/http';
import { DemoFilePickerAdapter } from  './file-picker.adapter';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';

import { UploaderCaptions } from 'ngx-awesome-uploader';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public captions: UploaderCaptions = {
    dropzone: {
      title: 'Logo de la empresa',
      or: '',
      browse: 'Cargar logo',
    },
    cropper: {
      crop: 'Cortar',
      cancel: 'Cancelar',
    },
    previewCard: {
      remove: 'borrar',
      uploadError: 'error',
    },
  };
  public cropperOptions = {
    minContainerWidth: '300',
    minContainerHeight: '300',
  };
  returnUrl: any;
  profile:any={};
  loadedOne:boolean=false;
  editing:boolean=false;
  loadedTwo:boolean=false;
  infoProfile:any={};
  toUpdate:any={};
  submitted = false;
  public isError = false;
  public user:any={};
  public newPart:any={};
  cards$:any=[];
  defaultNavActiveId = 1;
  partImages:any[]=[];
  tittle1:string="Datos de empresa";
  tittle2:string="Datos de administrador";
  adapter = new  DemoFilePickerAdapter(this.http,this._butler);
  validationForm1: UntypedFormGroup;
  
  editForm: FormGroup = new FormGroup({
    direction: new FormControl(''),
    phone: new FormControl(''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
  });
  validationForm2: UntypedFormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;
  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private ngxService: NgxUiLoaderService,
      private router: Router,
      public _butler:Butler,
      public dataApiService: DataApiService,
      public AuthRESTService:AuthRESTService,
      public formBuilder: UntypedFormBuilder
    ) { }
 
  onSubmit(){

  }
  getPartsById(){
    this.loadedOne=false;
    this._butler.myProducts$=null;
    setTimeout (() => {
      this.dataApiService.getPartsById(this._butler.userd).subscribe(response => {
        this._butler.myProducts$ = response;
        this.loadedOne=true;
        this._butler.myPartsSize=this._butler.myProducts$.length;
      });
    }, 100);  
  }
  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }
edit(){
  this.editing=true;
  this.editForm = this.formBuilder.group({
    direction : [this._butler.infoProfile.direction, Validators.required],
    phone : [this._butler.infoProfile.phone, Validators.required],
    facebook : [this._butler.infoProfile.facebook, ],
    instagram : [this._butler.infoProfile.instagram, ]
  });

}
delete(){
  console.log("sen envio a la tumba");
}
cancelDelete(){
  console.log("arrugaste");
}
cancel(){
  this.editing=false;
}
save(){
  this.submitted = true;
  if (this.editForm.invalid) {
    return;
  }
  this.ngxService.start("loader-01");
  this.toUpdate=this.editForm.value; 
  this.toUpdate.images=this.infoProfile.images;
 
  this.toUpdate.rut=this.infoProfile.rut;
  this.toUpdate.adminName=this.infoProfile.adminName;
  this.toUpdate.adminPhone=this.infoProfile.adminPhone;
  this.toUpdate.userd=this.infoProfile.userd;
  this.toUpdate.name=this.infoProfile.name;
  this.toUpdate.email=this.infoProfile.email;
  this.toUpdate.status=this.infoProfile.status;
  this.toUpdate.userType=this.infoProfile.userType;
  this.toUpdate.profileStatus=this.infoProfile.profileStatus;
  let id =this.infoProfile.id;
  // console.log("id to update:" +id);
  this.dataApiService.cardUpdate(this.toUpdate,id).subscribe(response=>{
      this.ngxService.stop("loader-01");
      this.editing=false;
      Swal.fire('Información editada con éxito','presione Ok para continuar','success');
      this.dataApiService.getCardByUserId(this._butler.userd).subscribe(
        data =>{
          this._butler.userActive=data;
          this._butler.userId=this._butler.userActive[0].id;
          this._butler.infoProfile=this._butler.userActive[0];
          this._butler.type=this._butler.userActive[0].userType;
          this._butler.images=this._butler.userActive[0].images;
          this._butler.name=this._butler.userActive[0].name;
          this._butler.email=this._butler.userActive[0].email;
          this._butler.profileStatus=this._butler.userActive[0].profileStatus;
          // if(this._butler.type=='member'){
          //   this.getPartsById();
          //   this.getCarsById();
          // } 
          // if(this._butler.type=='admin'){
          //   this.getCards();
          //   this.getProducts();
          //   this.getCars();
          // }
          // if(this._butler.profileStatus==="pending" || this._butler.profileStatus==="medium"){
          //   this.router.navigate(['general/profile']);
          // }
          // if(this._butler.profileStatus==="complete"){
          //   // this.router.navigate(['general/profile']);
          // this.router.navigate(['dashboard']);
          // }
        });    
    });
}



  getCarsById(){
    this.loadedTwo=false;
    this._butler.myCars$=null;
    setTimeout (() => {
      this.dataApiService.getCarsById(this._butler.userd).subscribe(response => {
        this._butler.myCars$ = response;
        this.loadedTwo=true;
        this._butler.myCarsSize=this._butler.myCars$.length;
      });
    }, 100);  
  } 
  ngOnInit(): void {
    if(this._butler.type=='member'&&this._butler.infoProfile.status=='pending'){
      $('body').removeClass('sidebar-dark');
    }
this.infoProfile=this._butler.infoProfile;
    this.getPartsById();
    this.getCarsById();
    /**
     * form1 value validation
     */
    this.validationForm1 = this.formBuilder.group({
      direction : ['', Validators.required],
      rut : ['', Validators.required],
      phone : ['', Validators.required],
      facebook : ['', ],
      instagram : ['', ]
    });

    /**
     * formw value validation
     */
    this.validationForm2 = this.formBuilder.group({
      adminName : ['', Validators.required],
      adminPhone : ['', Validators.required]
    });

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;

  }

  /**
   * Wizard finish function
   */
  finishFunction() {
     this.ngxService.start("loader-01");
    this.profile.name=this._butler.name;
    this.profile.userd=this._butler.userd;
    this.profile.email=this._butler.email;
    this.profile.status="pending";
    this.profile.userType="member";
    this.profile.profileStatus="complete";
    this.profile.images=this._butler.memberImages;
    console.log(this._butler.userId);

    this.ngxService.start("loader-01");
    this.dataApiService.memberUpdate(this.profile,this._butler.userId)
    .subscribe(response=>{
      this.ngxService.stop("loader-01");
        this._butler.memberImages=[];
        this._butler.profileStatus="complete";
        this.ngxService.stop("loader-01");

        Swal.fire('Perfil actualizado con éxito','presione Ok para continuar','success');
        this.router.navigate(['dashboard']);
    });

    // alert('Successfully Completed');
  }

  /**
   * Returns form
   */
  get form1() {
    return this.validationForm1.controls;
  }

  /**
   * Returns form
   */
  get form2() {
    return this.validationForm2.controls;
  }

  /**
   * Go to next step while form value is valid
   */
  form1Submit() {
    if(this.validationForm1.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm1Submitted = true;
    this.profile.direction=this.validationForm1.value.direction;
    this.profile.rut=this.validationForm1.value.rut;
    this.profile.phone=this.validationForm1.value.phone;
    this.profile.facebook=this.validationForm1.value.facebook;
    this.profile.instagram=this.validationForm1.value.instagram;
  }

  /**
   * Go to next step while form value is valid
   */
  form2Submit() {
    if(this.validationForm2.valid) {
      this.wizardForm.goToNextStep();
      this.profile.adminName=this.validationForm2.value.adminName;
      this.profile.adminPhone=this.validationForm2.value.adminPhone;
    }
    this.isForm2Submitted = true;
  }
}
