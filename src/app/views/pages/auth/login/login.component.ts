import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthRESTService } from '@services/authREST.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInterface } from '@interfaces/user-interface'; 
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';

declare var NgForm:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ngFormLogin: FormGroup;
  submitted = false;
  returnUrl: any;
  message:any="Error en datos de acceso"; 

  constructor(
    private router: Router, 
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    public dataApiService: DataApiService,
    private formBuilder: FormBuilder,
    public _butler:Butler,
    public AuthRESTService:AuthRESTService
    ){ }
  public user : UserInterface ={
    name:"",
    email:"",
    password:""
  };  
  public isError = false;
  public isLogged =false;
  get fval() {
    return this.ngFormLogin.controls;
  }
  ngOnInit(): void {
    this._butler.type="";
    this.ngFormLogin = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  onLogin(){  
    this.submitted = true;
    if (this.ngFormLogin.invalid) {
      return;
    } 
    this.ngxService.start("loader-01");
    return this.AuthRESTService.loginUser(
      this.ngFormLogin.value.email, 
      this.ngFormLogin.value.password
    )
    .subscribe( 
      data => {
        //console.log(data);
        this.AuthRESTService.setUser(data.user);
        const token = data.id;
        this.AuthRESTService.setToken(token);
        this._butler.userd="p"+data.userId;
        this._butler.isLogged=true;
        this.dataApiService.getCardByUserId(this._butler.userd).subscribe(
          data =>{
            this._butler.userActive=data;
            this._butler.userId=this._butler.userActive[0].id;
            this._butler.type=this._butler.userActive[0].userType;
            this._butler.images=this._butler.userActive[0].images;
            this._butler.name=this._butler.userActive[0].name;
            this._butler.email=this._butler.userActive[0].email;
            this._butler.profileStatus=this._butler.userActive[0].profileStatus;
            if(this._butler.type=='member'){
              this.getPartsById();
              this.getCarsById();
            } 
            if(this._butler.type=='admin'){
              this.getCards();
              this.getProducts();
              this.getCars();
            }
            if(this._butler.profileStatus==="pending" || this._butler.profileStatus==="medium"){
              this.router.navigate(['general/profile']);
            }
            if(this._butler.profileStatus==="complete"){
              // this.router.navigate(['general/profile']);
            this.router.navigate(['dashboard']);
            }
          });       
        this._butler.name=data.name;
        this.isError = false;
        this.ngxService.stop("loader-01");
        localStorage.setItem('isLoggedin', 'true');
        console.log("profile status: "+this._butler.profileStatus);
        
      },
       error => this.onIsError()
    ); 
  }
  getCards(){
    this._butler.newMembersSize=0;
    this._butler.activatedMembersSize=0;
    this.dataApiService.getAllCards().subscribe(response => {
    this._butler.cards$ = response;
    let size = this._butler.cards$.length;
      for (let i=0;i<size;i++){
        if(this._butler.cards$[i].status=='pending'){
          this._butler.newMembersSize=this._butler.newMembersSize+1;
        }
        if(this._butler.cards$[i].status=='activated'){
          this._butler.activatedMembersSize=this._butler.activatedMembersSize+1;
        }
      }
    });
  }
  getProducts(){
    this._butler.products$=[];
    setTimeout (() => {
      this.dataApiService.getAllProducts().subscribe(response => {
        this._butler.products$ = response;
        this._butler.partsSize=this._butler.products$.length;
      });
    }, 100);   
  }
  getPartsById(){
    this._butler.myProducts$=null;
    setTimeout (() => {
      this.dataApiService.getPartsById(this._butler.userd).subscribe(response => {
        this._butler.myProducts$ = response;
        this._butler.myPartsSize=this._butler.myProducts$.length;
      });
    }, 100);  
  }
  getCars(){
    this._butler.cars$=[];
    setTimeout (() => {
      this.dataApiService.getAllCars().subscribe(response => {
        this._butler.cars$ = response;
        this._butler.carsSize=this._butler.cars$.length;
      });
    }, 100);   
  }
  getCarsById(){
    this._butler.myCars$=null;
    setTimeout (() => {
      this.dataApiService.getCarsById(this._butler.userd).subscribe(response => {
        this._butler.myCars$ = response;
        this._butler.myCarsSize=this._butler.myCars$.length;
      });
    }, 100);  
  }  

  onIsError(): void {
      this.ngxService.stop("loader-01");
    this.isError = true;

    setTimeout(() => {
      this.isError = false;
    }, 4000);
  }
  onLoggedin(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate([this.returnUrl]);
    }
  }

}
