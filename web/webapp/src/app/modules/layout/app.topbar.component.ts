import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { DatePipe } from '@angular/common';
import { EventData } from '../dto/models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styles: [
    `
      .event-item {
        border-left: 5px solid #28a745;
        padding: 15px;
        margin-bottom: 10px;
      }
    `,
  ],
  providers: [DatePipe],
})
export class AppTopBarComponent implements OnInit {
  eventList!: any[];
  notificationCount = 0; // Replace this with actual data
  today = formatDate(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    'MM-dd-yyyy',
    'en-US'
  );
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private eventScheduleService: EventScheduleService,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.getAllNotification();
    this.eventScheduleService.notificationEventEmitter.subscribe((data: any) => {
      this.getAllNotification();
    });
    
  }

  logout() {
    console.log('You are logged out');
    localStorage.removeItem('token');
    this.router.navigate(['auth']);
  }

  getAllNotification() {
    this.eventScheduleService.getAllNotification().subscribe({
      next: (res) => {
        console.log('Event List:', res);
        this.eventList = res.body;
        this.notificationCount = this.eventList.length;
      },
      error: (err) => {
        console.error('Error fetching event list:', err);
      },
    });
  }
  markAsRead(id:any){
    let ids:number[]=[];
    ids.push(id);
    this.eventScheduleService.markAsRead(ids).subscribe({
      next:(res)=>{
        console.log(res);
        this.getAllNotification();
      }
    })
  }

  markAllAsRead(){
    let ids:number[]= this.eventList.map((event)=>event.id);
    this.eventScheduleService.markAsRead(ids).subscribe({
      next:(res)=>{
        console.log(res);
        this.getAllNotification();
      }
    })
  }
}
