import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthRESTService } from '@services/authREST.service';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import{NgxUiLoaderService} from 'ngx-ui-loader';
import { HttpClient } from  '@angular/common/http';
import { DemoFilePickerAdapter } from  './file-picker.adapter';
import {VEHICLES} from '@services/vehicles.service';

import { UploaderCaptions } from 'ngx-awesome-uploader';
@Component({
  selector: 'app-newcar',
  templateUrl: './newcar.component.html',
  styleUrls: ['./newcar.component.scss']
})
export class NewcarComponent implements OnInit, AfterViewInit {
  public captions: UploaderCaptions = {
    dropzone: {
      title: 'Imágenes del vehículo',
      or: '.',
      browse: 'Cargar',
    },
    cropper: {
      crop: 'Cortar',
      cancel: 'Cancelar',
    },
    previewCard: {
      remove: 'Borrar',
      uploadError: 'error',
    },
  };
  public cropperOptions = {
    minContainerWidth: '300',
    minContainerHeight: '300',
  };
  userd="";
  returnUrl: any;
  vehiclePreview:any=[];
  vehicles: any;
  fuelTypes:any=[
    {name:"Bencina",idFuelType:"0001"},
    {name:"Diesel",idFuelType:"0002"}
    ];  
  transmisionTypes:any=[
    {name:"Manual",idTransmisionType:"0001"},
    {name:"Automatica",idTransmisionType:"0002"}
    ];  
  vehicleStatusArray:any=[
    {name:"Nuevo",vehicleStatus:"0001"},
    {name:"Usado",vehicleStatus:"0002"}
    ];
   carType="Seleccione una!";
   fuelType="Seleccione una!";
   transmision="Seleccione una!";
   vehicleStatus="Seleccione una!";

  form: FormGroup = new FormGroup({
    brand: new FormControl(''),
    carType: new FormControl(''),
    cod: new FormControl(''),
    description: new FormControl(''),
    displacement: new FormControl(''),
    fuelType: new FormControl(''),
    mileage: new FormControl(''),
    name: new FormControl(''),
    vehicleStatus: new FormControl(''),
    // userd: new FormControl(''),
    model: new FormControl(''),
    price: new FormControl(''),
    transmision: new FormControl(''),
    year: new FormControl(''),
  });

  fuelSeted=false;
  carTypeSeted=false;
  transmisionSeted=false;
  statusSeted=false;
memberSeted=false;

  submitted = false;
  public isError = false;
  public user:any={};
  public newCar:any={};
  
  card:any;
  cards$:any=[];
  defaultNavActiveId = 1;
  carImages:any[]=[];
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
      this._butler.carImages=[];
    this.vehicles=VEHICLES
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  ngOnInit(): void { 
  }
  setVehicle(selected:any){
    this.carTypeSeted=true;
    this.vehiclePreview.carType=this.vehicles[selected];
    console.log("selected: "+this.vehiclePreview.carType.name);
  }
  setFuelType(selected:any){
    this.fuelSeted=true;
    this.vehiclePreview.fuelType=this.fuelTypes[selected];
    console.log("selected: "+this.vehiclePreview.fuelType.name);
  }
  setTransmisionType(selected:any){
    this.transmisionSeted=true;
    this.vehiclePreview.transmision=this.transmisionTypes[selected];
    console.log("selected: "+this.vehiclePreview.transmision.name);
  }
  setMember(selected:any){
    let userd =selected.userd;
    console.log("userd: "+userd);
  this.vehiclePreview.userId=userd;
this.memberSeted=true;
  }
  setVehicleStatus(selected:any){
    this.statusSeted=true;
    this.vehiclePreview.vehicleStatus=this.vehicleStatusArray[selected];
    console.log("selected: "+this.vehiclePreview.vehicleStatus.name);
  }
  public saveCar(){  
    this.dataApiService.saveCar(this.newCar).subscribe(respose=>{
      this._butler.carImages=[];
      this.router.navigate(['cars/carslist']);
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
    this.carImages=this._butler.carImages; 
    this.newCar=this.form.value; 
    this.newCar.transmision=this.vehiclePreview.transmision;
    this.newCar.fuelType=this.vehiclePreview.fuelType;
    this.newCar.carType=this.vehiclePreview.carType;
    this.newCar.vehicleStatus=this.vehiclePreview.vehicleStatus;
    this.newCar.images=this.carImages;
    if (this.memberSeted){
      console.log("seteando desde if");
      this.newCar.userId=this.vehiclePreview.userId;
    }
    else {  
    this.newCar.userId=this._butler.userd; 
    }
    this.saveCar();
  }
  getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response
    });
  }

  ngAfterViewInit(): void {
    this.vehiclePreview.transmision={name:"",idTransmisionType:""},
    this.vehiclePreview.vehicleStatus={name:"",idVehicleStatusType:""},
    this.vehiclePreview.fuelType={name:"",idFuelTypeType:""},
    this.vehiclePreview.carType={name:"",idCarTypeType:""},
    this._butler.newCarImage=true;
    this.form = this.formBuilder.group(
      {        
        brand: ['', Validators.required],
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, Validators.required],
        year: [0, Validators.required],
        displacement: [0, Validators.required],
        mileage: [0, Validators.required],
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
