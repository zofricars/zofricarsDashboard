import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { ReactiveFormsModule } from '@angular/forms';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PartsComponent } from './parts.component';
import { PartslistComponent } from './list/partslist.component';
import { NewpartComponent } from './newpart/newpart.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FilePickerModule } from  'ngx-awesome-uploader';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

// ngx-quill
import { QuillModule } from 'ngx-quill';

const routes: Routes = [
  {
    path: '',
    component: PartsComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'calendar',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'email',
      //   component: EmailComponent,
      //   children: [
      //     {
      //       path: '',
      //       redirectTo: 'inbox',
      //       pathMatch: 'full'
      //     },
      //     {
      //       path: 'inbox',
      //       component: InboxComponent
      //     },
      //     {
      //       path: 'read',
      //       component: ReadComponent
      //     },
      //     {
      //       path: 'compose',
      //       component: ComposeComponent
      //     }
      //   ]
      // },
    
      {
        path: 'newpart',
        component: NewpartComponent
      },
      {
        path: 'partslist',
        component: PartslistComponent
      }


      // ,
      // {
      //   path: 'calendar',
      //   component: CalendarComponent
      // },
    ]
  }
]

@NgModule({
  declarations: [PartslistComponent,NewpartComponent, PartsComponent],
  imports: [
    FilePickerModule,
    NgxUiLoaderModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule, // import the FullCalendar module! will make the FullCalendar component available
    PerfectScrollbarModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbCollapseModule,
    NgSelectModule,
    QuillModule.forRoot(), // ngx-quill
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PartsModule { }
