import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
import { DemoFilePickerAdapter } from  './file-picker.adapter';
import {CATEGORIES} from '@services/categories.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import{NgxUiLoaderService} from 'ngx-ui-loader';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-partslist',
  templateUrl: './partslist.component.html',
  styleUrls: ['./partslist.component.scss']
})
export class PartslistComponent implements OnInit, AfterViewInit {
  cards$:any=[];
  images:any=[];
  category="Seleccione una!";

  public isError = false;
  categories: any;
  toUpdate:any;
  categoryBackup:any;
  products$:any=[];
  showDetail=false;
  editing=false;
  defaultNavActiveId = 1;
  submitted = false;
  form: FormGroup = new FormGroup({
    cod: new FormControl(''),
    brand: new FormControl(''),
    description: new FormControl(''),
    model: new FormControl(''),
    name: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
  });

  partImages:any[]=[];
  public newPart:any={};

  public partToSee:any={};
  
  adapter = new  DemoFilePickerAdapter(this.http,this._butler);
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) { this.categories=CATEGORIES }


    
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
    delete(){
      console.log("sen envio a la tumba");
    }
    cancelDelete(){
      console.log("arrugaste");
    }
    cancel(){
      this.editing=false;
    }
    setEditing(){
      this.editing=true;
    }
    setCategory(selected:any){
      this.category=this.categories[selected];
      console.log("selected: "+this.categories[selected].name);
    }
    public onSubmit(): void {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      this.partImages=this._butler.partImages; 
      this.newPart=this.form.value; 
      this.newPart.category=this.category;
      // this.newPart.category=this.form.value; 
      this.newPart.images=this.partImages;; 
      this.newPart.userId=this._butler.userd; 
      this.savePart();
    }
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
    noShowDetail(){
      this.showDetail=false;
    }
    detail(part:any){
      this.partToSee=part;
      this.categoryBackup=part.category;
      this.partToSee.category=part.category.name;
      this.images=part.images;
      this.showDetail=true;
      this.form = this.formBuilder.group(
        {        
          brand: [part.brand, Validators.required],
          cod: [part.cod, Validators.required],
          description: [part.description, Validators.required],
          model: [part.model, Validators.required],
          name: [part.name, Validators.required],
          price: [part.price, Validators.required],
          stock: [part.stock, Validators.required]
        }    
      );
    }
  save(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.ngxService.start("loader-01");
    this.toUpdate=this.form.value; 
    this.toUpdate.images=this.partToSee.images;
    if (this.category!="Seleccione una!"){
      this.toUpdate.category=this.category;
    }else{
      this.toUpdate.category=this.categoryBackup;
    }
    this.toUpdate.userId=this.partToSee.userId;
    let id =this.partToSee.id;
    // console.log("id to update:" +id);
    this.dataApiService.partUpdate(this.toUpdate,id).subscribe(response=>{
        this.ngxService.stop("loader-01");
        this.editing=false;
        this.showDetail=false;
        this.getMyParts();
        Swal.fire('Autoparte editada con éxito','presione Ok para continuar','success');
        this.router.navigate(['parts/partslist']);
      });
  }
 getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response
    });
 }
 getParts(){
    this.dataApiService.getAllProducts().subscribe(response => {
      this.ngxService.stop("loader-01");
    this.products$ = response
    });
 }
 getMyParts(){
    this.dataApiService.getPartsById(this._butler.userd).subscribe(response => {
    this.ngxService.stop("loader-01");
    this.products$ = response
    });
 }
  ngOnInit(): void { 
    
  }

  ngAfterViewInit(): void {
    if (this._butler.type=='admin'){  
      this.ngxService.start("loader-01");
      this.getParts();
    }
    if (this._butler.type=='member'){  
      this.ngxService.start("loader-01");
      this.getMyParts();
    }
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
}
