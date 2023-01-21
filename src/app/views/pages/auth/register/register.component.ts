import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthRESTService } from '@services/authREST.service';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  returnUrl: any;
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
  });
  submitted = false;
  public isError = false;
  public user:any={};
  public card:any={

  };

  constructor(
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    public _butler:Butler,
    public dataApiService: DataApiService,
    private formBuilder: FormBuilder,
    public AuthRESTService:AuthRESTService
   ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
     this.form = this.formBuilder.group(
      {        
        email: ['', Validators.required],
        password: ['', Validators.required],
        name: ['', Validators.required]
      }    
    );
  }

  public register(){  
    this.ngxService.start("loader-01");
    this.AuthRESTService.registerUser( 
      this.user.email, 
      this.user.password 
    ).subscribe(
        user => {    
          this.AuthRESTService.setUser(user);
          const token = user.id;
          this.card.userd='p'+token;
          this.card.name=this.form.value.name;
          this.card.email=this.form.value.email;
          this.card.status="pending";
          this.card.userType="member";
          this.card.profileStatus="pending";
          this.card.images=["assets/images/default.jpg"];
          this._butler.userd=this.card.userd;  
          this.AuthRESTService.setToken(token);
          this.dataApiService.saveCard(this.card).subscribe(response =>{
          this._butler.userId=''+response.id;
            this.ngxService.stop("loader-01");
            localStorage.setItem('isLoggedin', 'true');
            if (localStorage.getItem('isLoggedin')) {
              this.router.navigate([this.returnUrl]);
            }
            this._butler.images=["assets/images/default.jpg"];
            this._butler.name=this.form.value.name;
            this._butler.email=this.form.value.email;
            this._butler.type='member';
            this._butler.isLogged=true;
            this._butler.profileStatus="pending";
            this.router.navigate(['general/profile']);
          });
        }, 
        error => {
            if(error.status==422){
            this.isError = true;
            this.ngxService.stop("loader-01");
          }
        }
      );
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.user.email=this.form.value.email;
    this.user.password=this.form.value.password; 
    this.card.name=this.user.name;
    this.register();
  }

  onRegister(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/']);
    }
  }

}
