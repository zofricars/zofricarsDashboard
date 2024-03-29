import { Component, OnInit,AfterViewInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Butler } from '@services/butler.service';
import { DataApiService } from '@services/data-api.service'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit,AfterViewInit {
  products$:any=[];
  orders$:any=[];
  myProducts$:any=[];
  cards$:any=[];
  loading:boolean=true;

 productsProv$:any=[];
  partsSize:number=0;
  ordersSize:number=0;
  myPartsSize:number=0;
  newMembersSize:number=0;
  activatedMembersSize:number=0;
  userActive:any;
  /**
   * Apex chart
   */
  public customersChartOptions: any = {};
  public ordersChartOptions: any = {};
  public growthChartOptions: any = {};
  public revenueChartOptions: any = {};
  public monthlySalesChartOptions: any = {};
  public cloudStorageChartOptions: any = {};

  // colors and font variables for apex chart 
  obj = {
    primary        : "#66d1d1",
    secondary      : "#7987a1",
    success        : "#05a34a",
    info           : "#66d1d1",
    warning        : "#f57a1f",
    danger         : "#ff3366",
    light          : "#e9ecef",
    dark           : "#060c17",
    muted          : "#7987a1",
    gridBorder     : "rgba(77, 138, 240, .15)",
    bodyColor      : "#000",
    cardBg         : "#fff",
    fontFamily     : "'Roboto', Helvetica, sans-serif"
  }

  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;

  constructor(
      public _butler:Butler,
      public dataApiService: DataApiService,
      private calendar: NgbCalendar
    ) {
    // this._butler.userActive=this.dataApiService.getCardByUserId(this._butler.userd).subscribe();
  }
 getProducts(){
    this.products$=[];
    this.productsProv$=[];
    
    setTimeout (() => {
      this.dataApiService.getAllCars().subscribe(response => {
        this.products$ = response;
        this.products$.reverse();
        this.partsSize=this.products$.length;
        for (let i =0;i<this.partsSize;i++){
          if(i<6){
            this.productsProv$.push(this.products$[i]);
          }
        }      
        this.loading=false;
        this.products$=[];
        this.products$=this.productsProv$;
      });
    }, 1000);
   
 }
 getPartsById(){
  this.myProducts$=[];
  setTimeout (() => {
    this.dataApiService.getPartsById(this._butler.userd).subscribe(response => {
      this.myProducts$ = response;
      this.loading=false;
      this.myPartsSize=this.myProducts$.length;
      });
    }, 1000);  
 }
  getCards(){
    this.newMembersSize=0;
    this.activatedMembersSize=0;
    this.dataApiService.getAllCards().subscribe(response => {
    this.cards$ = response;
    let size = this.cards$.length;
      for (let i=0;i<size;i++){
        if(this.cards$[i].status=='pending'){
          this.newMembersSize=this.newMembersSize+1;
        }
        if(this.cards$[i].status=='activated' && this.cards$[i].userType=='member'){
          this.activatedMembersSize=this.activatedMembersSize+1;
        }
      }
    });
 }
 getOZ(){
 
    this.dataApiService.getAllOrders().subscribe(response => {
    this.orders$ = response
    this._butler.orders=this.orders$;
    // this._butler.orders=this._butler.orders.filter(order => order.amount !== 0);
    this._butler.orders=this._butler.orders.filter(order => order.amount !== 0);
    this._butler.orders.reverse();
    this.ordersSize=this._butler.orders.length;
    });
  
 }
  ngOnInit(): void {
this.getOZ();
    this.currentDate = this.calendar.getToday();
    this.customersChartOptions = getCustomerseChartOptions(this.obj);
    this.ordersChartOptions = getOrdersChartOptions(this.obj);
    this.growthChartOptions = getGrowthChartOptions(this.obj);
    this.revenueChartOptions = getRevenueChartOptions(this.obj);
    this.monthlySalesChartOptions = getMonthlySalesChartOptions(this.obj);
    this.cloudStorageChartOptions = getCloudStorageChartOptions(this.obj);
    if (document.querySelector('html')?.getAttribute('dir') === 'rtl') {
      this.addRtlOptions();
    }
  }
  ngAfterViewInit(): void {
    if(this._butler.type=='admin'){      
      this.getCards();
      this.getProducts();
    }
    if(this._butler.type=='member'){      
      this.getPartsById();
    }
  }

  addRtlOptions() {
    // Revenue chart
    this.revenueChartOptions.yaxis.labels.offsetX = -25;
    this.revenueChartOptions.yaxis.title.offsetX = -75;

    //  Monthly sales chart
    this.monthlySalesChartOptions.yaxis.labels.offsetX = -10;
    this.monthlySalesChartOptions.yaxis.title.offsetX = -70;
  }
}


/**
 * Customerse chart options
 */
function getCustomerseChartOptions(obj: any) {
  return {
    series: [{
      name: '',
      data: [3844, 3855, 3841, 3867, 3822, 3843, 3821, 3841, 3856, 3827, 3843]
    }],
    chart: {
      type: "line",
      height: 60,
      sparkline: {
        enabled: !0
      }
    },
    colors: [obj.primary],
    xaxis: {
      type: 'datetime',
      categories: ["Ene 01 2022", "Ene 02 2022", "Ene 03 2022", "Ene 04 2022", "Ene 05 2022", "Ene 06 2022", "Ene 07 2022", "Ene 08 2022", "Ene 09 2022", "Ene 10 2022", "Ene 11 2022",],
    },
    stroke: {
      width: 2,
      curve: "smooth"
    },
    markers: {
      size: 0
    },
  }
};



/**
 * Orders chart options
 */
function getOrdersChartOptions(obj: any) {
  return {
    series: [{
      name: '',
      data: [36, 77, 52, 90, 74, 35, 55, 23, 47, 10, 63]
    }],
    chart: {
      type: "bar",
      height: 60,
      sparkline: {
        enabled: !0
      }
    },
    colors: [obj.primary],
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%"
      }
    },
    xaxis: {
      type: 'datetime',
      categories: ["Ene 01 2022", "Ene 02 2022", "Ene 03 2022", "Ene 04 2022", "Ene 05 2022", "Ene 06 2022", "Ene 07 2022", "Ene 08 2022", "Ene 09 2022", "Ene 10 2022", "Ene 11 2022",],
    }
  }
};



/**
 * Growth chart options
 */
function getGrowthChartOptions(obj: any) {
  return {
    series: [{
      name: '',
      data: [41, 45, 44, 46, 52, 54, 43, 74, 82, 82, 89]
    }],
    chart: {
      type: "line",
      height: 60,
      sparkline: {
        enabled: !0
      }
    },
    colors: [obj.primary],
    xaxis: {
      type: 'datetime',
      categories: ["Ene 01 2022", "Ene 02 2022", "Ene 03 2022", "Ene 04 2022", "Ene 05 2022", "Ene 06 2022", "Ene 07 2022", "Ene 08 2022", "Ene 09 2022", "Ene 10 2022", "Ene 11 2022",],
    },
    stroke: {
      width: 2,
      curve: "smooth"
    },
    markers: {
      size: 0
    },
  }
};



/**
 * Revenue chart options
 */
function getRevenueChartOptions(obj: any) {
  return {
    series: [{
      name: "Revenue",
      data: [
        49.3,
        48.7,
        50.6,
        53.3,
        54.7,
        53.8,
        54.6,
        56.7,
        56.9,
        56.1,
        56.5,
        60.3,
        58.7,
        61.4,
        61.1,
        58.5,
        54.7,
        52.0,
        51.0,
        47.4,
        48.5,
        48.9,
        53.5,
        50.2,
        46.2,
        48.6,
        51.7,
        51.3,
        50.2,
        54.6,
        52.4,
        53.0,
        57.0,
        52.9,
        48.7,
        52.6,
        53.5,
        58.5,
        55.1,
        58.0,
        61.3,
        57.7,
        60.2,
        61.0,
        57.7,
        56.8,
        58.9,
        62.4,
        58.7,
        58.4,
        56.7,
        52.7,
        52.3,
        50.5,
        55.4,
        50.4,
        52.4,
        48.7,
        47.4,
        43.3,
        38.9,
        34.7,
        31.0,
        32.6,
        36.8,
        35.8,
        32.7,
        33.2,
        30.8,
        28.6,
        28.4,
        27.7,
        27.7,
        25.9,
        24.3,
        21.9,
        22.0,
        23.5,
        27.3,
        30.2,
        27.2,
        29.9,
        25.1,
        23.0,
        23.7,
        23.4,
        27.9,
        23.2,
        23.9,
        19.2,
        15.1,
        15.0,
        11.0,
        9.20,
        7.47,
        11.6,
        15.7,
        13.9,
        12.5,
        13.5,
        15.0,
        13.9,
        13.2,
        18.1,
        20.6,
        21.0,
        25.3,
        25.3,
        20.9,
        18.7,
        15.3,
        14.5,
        17.9,
        15.9,
        16.3,
        14.1,
        12.1,
        14.8,
        17.2,
        17.7,
        14.0,
        18.6,
        18.4,
        22.6,
        25.0,
        28.1,
        28.0,
        24.1,
        24.2,
        28.2,
        26.2,
        29.3,
        26.0,
        23.9,
        28.8,
        25.1,
        21.7,
        23.0,
        20.7,
        29.7,
        30.2,
        32.5,
        31.4,
        33.6,
        30.0,
        34.2,
        36.9,
        35.5,
        34.7,
        36.9
      ]
    }],
    chart: {
      type: "line",
      height: '400',
      parentHeightOffset: 0,
      foreColor: obj.bodyColor,
      background: obj.cardBg,
      toolbar: {
        show: false
      },
    },
    colors: [obj.primary, obj.danger, obj.warning],
    grid: {
      padding: {
        bottom: -4,
      },
      borderColor: obj.gridBorder,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Ene 01 2022", "Ene 02 2022", "Ene 03 2022", "Ene 04 2022", "Ene 05 2022", "Ene 06 2022", "Ene 07 2022", "Ene 08 2022", "Ene 09 2022", "Ene 10 2022", "Ene 11 2022", "Ene 12 2022", "Ene 13 2022", "Ene 14 2022", "Ene 15 2022", "Ene 16 2022", "Ene 17 2022", "Ene 18 2022", "Ene 19 2022", "Ene 20 2022","Ene 21 2022", "Ene 22 2022", "Ene 23 2022", "Ene 24 2022", "Ene 25 2022", "Ene 26 2022", "Ene 27 2022", "Ene 28 2022", "Ene 29 2022", "Jan 30 2022", "Jan 31 2022",
        "Feb 01 2022", "Feb 02 2022", "Feb 03 2022", "Feb 04 2022", "Feb 05 2022", "Feb 06 2022", "Feb 07 2022", "Feb 08 2022", "Feb 09 2022", "Feb 10 2022", "Feb 11 2022", "Feb 12 2022", "Feb 13 2022", "Feb 14 2022", "Feb 15 2022", "Feb 16 2022", "Feb 17 2022", "Feb 18 2022", "Feb 19 2022", "Feb 20 2022","Feb 21 2022", "Feb 22 2022", "Feb 23 2022", "Feb 24 2022", "Feb 25 2022", "Feb 26 2022", "Feb 27 2022", "Feb 28 2022",
        "Mar 01 2022", "Mar 02 2022", "Mar 03 2022", "Mar 04 2022", "Mar 05 2022", "Mar 06 2022", "Mar 07 2022", "Mar 08 2022", "Mar 09 2022", "Mar 10 2022", "Mar 11 2022", "Mar 12 2022", "Mar 13 2022", "Mar 14 2022", "Mar 15 2022", "Mar 16 2022", "Mar 17 2022", "Mar 18 2022", "Mar 19 2022", "Mar 20 2022","Mar 21 2022", "Mar 22 2022", "Mar 23 2022", "Mar 24 2022", "Mar 25 2022", "Mar 26 2022", "Mar 27 2022", "Mar 28 2022", "Mar 29 2022", "Mar 30 2022", "Mar 31 2022",
        "Apr 01 2022", "Apr 02 2022", "Apr 03 2022", "Apr 04 2022", "Apr 05 2022", "Apr 06 2022", "Apr 07 2022", "Apr 08 2022", "Apr 09 2022", "Apr 10 2022", "Apr 11 2022", "Apr 12 2022", "Apr 13 2022", "Apr 14 2022", "Apr 15 2022", "Apr 16 2022", "Apr 17 2022", "Apr 18 2022", "Apr 19 2022", "Apr 20 2022","Apr 21 2022", "Apr 22 2022", "Apr 23 2022", "Apr 24 2022", "Apr 25 2022", "Apr 26 2022", "Apr 27 2022", "Apr 28 2022", "Apr 29 2022", "Apr 30 2022",
        "May 01 2022", "May 02 2022", "May 03 2022", "May 04 2022", "May 05 2022", "May 06 2022", "May 07 2022", "May 08 2022", "May 09 2022", "May 10 2022", "May 11 2022", "May 12 2022", "May 13 2022", "May 14 2022", "May 15 2022", "May 16 2022", "May 17 2022", "May 18 2022", "May 19 2022", "May 20 2022","May 21 2022", "May 22 2022", "May 23 2022", "May 24 2022", "May 25 2022", "May 26 2022", "May 27 2022", "May 28 2022", "May 29 2022", "May 30 2022",
      ],
      lines: {
        show: true
      },
      axisBorder: {
        color: obj.gridBorder,
      },
      axisTicks: {
        color: obj.gridBorder,
      },
      crosshairs: {
        stroke: {
          color: obj.secondary,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Revenue ( $1000 x )',
        style:{
          size: 9,
          color: obj.muted
        }
      },
      tickAmount: 4,
      tooltip: {
        enabled: true
      },
      crosshairs: {
        stroke: {
          color: obj.secondary,
        },
      },
      labels: {
        offsetX: 0,
      },
    },
    markers: {
      size: 0,
    },
    stroke: {
      width: 2,
      curve: "straight",
    },
  }
};



/**
 * Monthly sales chart options
 */
function getMonthlySalesChartOptions(obj: any) {
  return {


    series: [{
      name: 'Visitas',
      data: [30,10,34,54,4300,0,0,0,0,0,0,0]
    }],
    chart: {
      defaultLocale: 'es',
      locales: [{
        name: 'es',
        options: {
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],    
        }
      }],
      type: 'bar',
      height: '318',
      parentHeightOffset: 0,
      foreColor: obj.bodyColor,
      background: obj.cardBg,
      toolbar: {
        show: false
      },
    },
    colors: [obj.warning],  
    fill: {
      opacity: .9
    } , 
    grid: {
      padding: {
        bottom: -4
      },
      borderColor: obj.gridBorder,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: 'datetime',
      categories: ['Jan 01 2023','02/01/2023','03/01/2023','04/01/2023','05/01/2023','06/01/2023','07/01/2023', '08/01/2023','09/01/2023','10/01/2023', '11/01/2023', '12/01/2023'],
      axisBorder: {
        color: obj.gridBorder,
      },
      axisTicks: {
        color: obj.gridBorder,
      },
    },
    yaxis: {
      title: {
        text: 'Visitas por mes',
        style:{
          size: 9,
          color: obj.muted
        }
      },
      labels: {
        offsetX: 0,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: 'center',
      fontFamily: obj.fontFamily,
      itemMargin: {
        horizontal: 8,
        vertical: 0
      },
    },
    stroke: {
      width: 0
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
        fontFamily: obj.fontFamily,
      },
      offsetY: -27
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
        dataLabels: {
          position: 'top',
          orientation: 'vertical',
        }
      },
    }
  }
}



/**
 * Cloud storage chart options
 */
function getCloudStorageChartOptions(obj: any) {
  return {
    series: [67],
    chart: {
      height: 260,
      type: "radialBar"
    },
    colors: [obj.primary],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "70%"
        },
        track: {
          show: true,
          background: obj.light,
          strokeWidth: '100%',
          opacity: 1,
          margin: 5, 
        },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -11,
            show: true,
            color: obj.muted,
            fontSize: "13px"
          },
          value: {
            color: obj.bodyColor,
            fontSize: "30px",
            show: true
          }
        }
      }
    },
    fill: {
      opacity: 1
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Storage Used"]
  }
};
