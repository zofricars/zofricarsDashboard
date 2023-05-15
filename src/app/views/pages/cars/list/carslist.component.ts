import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
import { DemoFilePickerAdapter } from  './file-picker.adapter';
import {VEHICLES} from '@services/vehicles.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import{NgxUiLoaderService} from 'ngx-ui-loader';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-carslist',
  templateUrl: './carslist.component.html',
  styleUrls: ['./carslist.component.scss']
})
export class CarslistComponent implements OnInit, AfterViewInit {
  cards$:any=[];
  cars$:any=[];
  editing=false;

  toUpdate:any;
  fuelTypeBackup:any;
  carTypeBackup:any; 
   transmisionBackup:any;
  vehicleStatusBackup:any;

  defaultNavActiveId = 1;  
  public carToSee:any={};
 vehicleBackup:any;
 images:any;
 showDetail=false;
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
    model: new FormControl(''),
    price: new FormControl(''),
    transmision: new FormControl(''),
    year: new FormControl(''),
  });

  submitted = false;
  public isError = false;
  public user:any={};
  public newCar:any={};

  carImages:any[]=[];

  adapter = new  DemoFilePickerAdapter(this.http,this._butler);
  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    public _butler:Butler,
    public dataApiService: DataApiService,
    ) {  this.vehicles=VEHICLES }
   
  get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
    noShowDetail(){
      this.showDetail=false;
      if (this._butler.type=='admin'){  
        this.ngxService.start("loader-01");
        this.getCars();
      }
      if (this._butler.type=='member'){  
        this.ngxService.start("loader-01");
        this.getMyCars();
      }
    }
    setVehicle(selected:any){
      this.vehiclePreview.carType=this.vehicles[selected];
      console.log("selected: "+this.vehiclePreview.carType.name);
    }
    setFuelType(selected:any){
      this.vehiclePreview.fuelType=this.fuelTypes[selected];
      console.log("selected: "+this.vehiclePreview.fuelType.name);
    }
    setTransmisionType(selected:any){
      this.vehiclePreview.transmision=this.transmisionTypes[selected];
      console.log("selected: "+this.vehiclePreview.transmision.name);
    }
    setVehicleStatus(selected:any){
      this.vehiclePreview.vehicleStatus=this.vehicleStatusArray[selected];
      console.log("selected: "+this.vehiclePreview.vehicleStatus.name);
    }
    detail(car:any){
      this.carToSee=car;
      
      this.vehicleStatusBackup=car.vehicleStatus;
      this.carTypeBackup=car.carType;
      this.fuelTypeBackup=car.fuelType;
      this.transmisionBackup=car.transmision;
      this.carToSee.carType=car.carType.name;
      this.carToSee.vehicleStatus=car.vehicleStatus.name;
      this.carToSee.fuelType=car.fuelType.name;
      this.carToSee.transmision=car.transmision.name;
      this.images=car.images;
      this.showDetail=true;
      this.form = this.formBuilder.group(
        {        
          brand: [car.brand, Validators.required],
          name: [car.name, Validators.required],
          description: [car.description, Validators.required],
          price: [car.price, Validators.required],
          year: [car.year, Validators.required],
          displacement: [car.displacement, Validators.required],
          mileage: [car.mileage, Validators.required]
        }    
      );
    }
    delete(){

      this.ngxService.start("loader-01");
      this.dataApiService.deleteCar(this.carToSee.id).subscribe(responde=>{
        if (this._butler.type=='admin'){  
          this.ngxService.start("loader-01");
          this.getCars();
        }
        if (this._butler.type=='member'){  
          this.ngxService.start("loader-01");
          this.getMyCars();
        }
        this.editing=false;
        this.showDetail=false;
        this.ngxService.stop("loader-01");
      });
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
    public onSubmit(): void {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      // this.carImages=this._butler.carImages; 
      // this.newCar=this.form.value; 
      // this.newCar.transmision=this.vehiclePreview.transmision;
      // this.newCar.fuelType=this.vehiclePreview.fuelType;
      // this.newCar.carType=this.vehiclePreview.carType;
      // this.newCar.vehicleStatus=this.vehiclePreview.vehicleStatus;
      // this.newCar.images=this.carImages;; 
      // this.newCar.userId=this._butler.userd; 
    }

  getCards(){
    this.dataApiService.getAllCards().subscribe(response => {
      this.ngxService.stop("loader-01");
    this.cards$ = response
    });
  }
  getCars(){
    this.dataApiService.getAllCars().subscribe(response => {
      this.ngxService.stop("loader-01");
    this.cars$ = response
    this._butler.cars=this.cars$;
    // this._butler.cars=this._butler.cars.filter(order => order.amount !== 0);
    this._butler.cars=this._butler.cars.filter(car => car.amount !== 0);
    this._butler.cars = this._butler.cars.map((car, index) => {
      return { ...car, pos: index };
    });
    this._butler.cars.reverse();
    
    });
  }
  getMyCars(){
      this.dataApiService.getCarsById(this._butler.userd).subscribe(response => {
        this.ngxService.stop("loader-01");
      this.cars$ = response
      });
  }
  ngOnInit(): void {   
  }

  ngAfterViewInit(): void {
    if (this._butler.type=='admin'){  
      this.ngxService.start("loader-01");
      this.getCars();
    }
    if (this._butler.type=='member'){  
      this.ngxService.start("loader-01");
      this.getMyCars();
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

  save(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.ngxService.start("loader-01");
    this.toUpdate=this.form.value; 
    this.toUpdate.images=this.carToSee.images;
    if (this.fuelType!="Seleccione una!"){
      this.toUpdate.fuelType=this.vehiclePreview.fuelType;
    }else{
      this.toUpdate.fuelType=this.fuelTypeBackup;
    } 
    if (this.carType!="Seleccione una!"){
      this.toUpdate.carType=this.vehiclePreview.carType;
    }else{
      this.toUpdate.carType=this.carTypeBackup;
    }
    if (this.vehicleStatus!="Seleccione una!"){
      this.toUpdate.vehicleStatus=this.vehiclePreview.vehicleStatus;
    }else{
      this.toUpdate.vehicleStatus=this.vehicleStatusBackup;
    }
    if (this.transmision!="Seleccione una!"){
      this.toUpdate.transmision=this.vehiclePreview.transmision;
    }else{
      this.toUpdate.transmision=this.transmisionBackup;
    }
    this.toUpdate.userId=this.carToSee.userId;
    let id =this.carToSee.id;
    // console.log("id to update:" +id);
    this.dataApiService.carUpdate(this.toUpdate,id).subscribe(response=>{
        this.ngxService.stop("loader-01");
        this.editing=false;
        this.showDetail=false;
        if (this._butler.type=='admin'){  
          this.ngxService.start("loader-01");
          this.getCars();
        }
        if (this._butler.type=='member'){  
          this.ngxService.start("loader-01");
          this.getMyCars();
        }


        // this.getMyCars();
        Swal.fire('Vehículo editado con éxito','presione Ok para continuar','success');
        this.router.navigate(['cars/carslist']);
      });
  }

}
