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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  returnUrl: any;
  profile:any={};

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
 
  ngOnInit(): void {

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
    this.profile.status="activated";
    this.profile.userType="member";
    this.profile.profileStatus="complete";
    this.profile.images=this._butler.memberImages;
    console.log(this._butler.userId);
    this.dataApiService.memberUpdate(this.profile,this._butler.userId)
    .subscribe(response=>{
        this._butler.memberImages=[];
        this._butler.profileStatus="complete";
        this.ngxService.stop("loader-01");
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
