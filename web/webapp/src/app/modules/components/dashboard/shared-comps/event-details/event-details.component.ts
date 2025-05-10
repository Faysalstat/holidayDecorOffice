import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO, ItemModel } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { BASE_URL } from 'src/app/utils/urls.const';

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  @Input() eventDetails!: any;
  communityDetails: CommunityDTO = new CommunityDTO();
  usedItemList: ItemModel[] = [];
  scheduledStartDate!: string;
  scheduledEndDate!: string;
  uploadedImagesForPreview: string[] = [];
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private communityService: CommunityService,
    private messageService: MessageService,
    private eventScheduleService: EventScheduleService
  ) {
    // Initialize any other properties if needed
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.scheduledStartDate = transformedDate ? transformedDate : '';
    this.scheduledEndDate = transformedDate ? transformedDate : '';
  }

  ngOnInit(): void {
    this.scheduledStartDate = this.eventDetails.scheduledStartDate;
    this.scheduledEndDate = this.eventDetails.scheduledEndDate;
    if (
      this.eventDetails.uploadedImages &&
      this.eventDetails.uploadedImages.length > 0
    ) {
      this.eventDetails.uploadedImages.map((image: string) => {
        this.uploadedImagesForPreview.push(`${BASE_URL}/uploads/${image}`);
      });
      this.usedItemList = this.eventDetails.usedItems;
      this.fetchCommunityDetails(this.eventDetails.communityId);
    }
  }
  
  fetchCommunityDetails(id: number) {
    this.communityService.getCommunityById(id).subscribe({
      next: (res) => {
        this.communityDetails = res.body;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
  editEvent() {
    this.router.navigate(['events/edit', this.eventDetails.id]);
  }
  goBack() {
    this.router.navigate(['events/list']);
  }
  completeEvent() {
    this.eventScheduleService.completeEventSchedule(this.eventDetails.id).subscribe({
      next: (value) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Event Completed',
          detail: 'Successfully Completed',
        });
        this.router.navigate(['events/list']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
}
