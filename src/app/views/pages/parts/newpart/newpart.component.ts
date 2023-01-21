import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthRESTService } from '@services/authREST.service';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
import { HttpClient } from  '@angular/common/http';
import { DemoFilePickerAdapter } from  './file-picker.adapter';
import {CATEGORIES} from '@services/categories.service';

@Component({
  selector: 'app-newpart',
  templateUrl: './newpart.component.html',
  styleUrls: ['./newpart.component.scss']
})
export class NewpartComponent implements OnInit, AfterViewInit {
  returnUrl: any;
  categories: any;
   category="Seleccione una!";
  form: FormGroup = new FormGroup({
    brand: new FormControl(''),
    model: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
    cod: new FormControl(''),
  });
  submitted = false;
  public isError = false;
  public user:any={};
  public newPart:any={};
  cards$:any=[];
  defaultNavActiveId = 1;
  partImages:any[]=[];
  adapter = new  DemoFilePickerAdapter(this.http,this._butler);
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    public _butler:Butler,
    private formBuilder: FormBuilder,
    public dataApiService: DataApiService,
    public AuthRESTService:AuthRESTService
    ) {
    this.categories=CATEGORIES

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  ngOnInit(): void { 
  }
  
  public savePart(){  
    this.dataApiService.savePart(this.newPart).subscribe(respose=>{
      this._butler.partImages=[];
      this.router.navigate(['parts/partslist']);
    }, 
    error => {
          if(error.status==422){
          this.isError = true;
          // this.ngxService.stop("loader-01");
        }
      }
    );
  }
  public onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.partImages=this._butler.partImages; 
    this.newPart=this.form.value; 
    // this.newPart.category=this.form.value; 
    this.newPart.images=this.partImages;; 
    this.newPart.userId=this._butler.userd; 
    this.savePart();
  }
  setCategory(selected:any){
    console.log("selected: "+this.categories[selected].name);
  }
  getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response
    });
  }

  ngAfterViewInit(): void {
    this._butler.newPartImage=false;
    this.form = this.formBuilder.group(
      {        
        brand: ['', Validators.required],
        model: ['', Validators.required],
        carType: ['', Validators.required],
        name: ['', Validators.required],
        category: ['', Validators.required],
        description: ['', Validators.required],
        cod: ['', Validators.required],
        price: [0, Validators.required],
        stock: [0, Validators.required],
      }    
    );
    this.getCards();
    // Show chat-content when clicking on chat-item for tablet and mobile devices
    document.querySelectorAll('.chat-list .chat-item').forEach(item => {
      item.addEventListener('click', event => {
        document.querySelector('.chat-content')!.classList.toggle('show');
      })
    });
  }

  backToChatList() {
    document.querySelector('.chat-content')!.classList.toggle('show');
  }

  save() {
    console.log('passs');
    
  }
}
