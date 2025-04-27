import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO, ItemModel } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { BASE_URL } from 'src/app/utils/urls.const';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  eventDetails!: any;
  communityDetails: CommunityDTO = new CommunityDTO();
  usedItemList: ItemModel[] = [];
  scheduledStartDate!: string ;
  scheduledEndDate!: string ;
  uploadedImagesForPreview: string[] = [];
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.params.subscribe((params) => {
      this.eventId = +params['id'];
      if (this.eventId) {
        // this.isEdit = true;
        this.getEventById(this.eventId);
      }
    });
  }
  getEventById(id: number) {
    this.eventScheduleService.getEventScheduleById(id).subscribe({
      next: (res) => {
        console.log(res);
        let eventDetails = res.body;
        this.scheduledStartDate = eventDetails.scheduledStartDate;
        this.scheduledEndDate = eventDetails.scheduledEndDate;
        if (
          eventDetails.uploadedImages &&
          eventDetails.uploadedImages.length > 0
        ) {
          this.eventDetails = eventDetails;
          eventDetails.uploadedImages.map((image: string) => {
            this.uploadedImagesForPreview.push(`${BASE_URL}/uploads/${image}`);
          });
          this.usedItemList = eventDetails.usedItems;
          this.fetchCommunityDetails(eventDetails.communityId);
        }
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
  fetchCommunityDetails(id: number) {
    this.communityService.getCommunityById(id).subscribe({
      next: (res) => {
        console.log(res);
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
  editEvent(){
    this.router.navigate(['events/edit',this.eventId]);
  }
  goBack(){
    this.router.navigate(['events/list']);
  }
}
