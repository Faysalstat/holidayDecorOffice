import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventData } from 'src/app/modules/dto/models';
import { EventScheduleService } from 'src/app/services/event-schedule.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  eventList!: any[];
  selectedStatus: string = 'active';
  constructor(
    private router: Router,
    private eventScheduleService: EventScheduleService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.fetchAllEvents();
  }
  fetchAllEvents() {
    const params: Map<string, any> = new Map();
    params.set('status', this.selectedStatus);
    params.set('scheduledDate', '');
    this.eventScheduleService.getAllEventSchedule(params).subscribe({
      next: (res) => {
        console.log('Event List:', res);
        let events = res.body;
        this.eventList = events.map((event: EventData) => ({
          ...event,
          scheduledDate: this.datePipe.transform(
            event.scheduledDate,
            'yyyy-MM-dd'
          ),
        }));
      },
      error: (err) => {
        console.error('Error fetching event list:', err);
      },
    });
  }
  addNew() {
    this.router.navigate(['events/create']);
  }
  editEvent(id: number) {
    this.router.navigate(['events/edit', id]);
  }
  viewEvent(id: number) {
    this.router.navigate(['events/view', id]);
  }
  deleteEvent(id: number) {
    this.eventScheduleService.deleteEventSchedule(id).subscribe({
      next: (res) => {
        this.fetchAllEvents();
        this.messageService.add({
          severity: 'success',
          summary: 'Event Deleted',
          detail: 'Successfully Deleted',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Operation Failed',
          detail: err.message,
        });
      },
    });
  }
}
