import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO, ItemModel, ItemUpdateModel } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { BASE_URL } from 'src/app/utils/urls.const';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  eventDetails!: any;
  communityDetails: CommunityDTO = new CommunityDTO();
  usedItemList: ItemUpdateModel[] = [];
  scheduledStartDate!: string ;
  scheduledEndDate!: string ;
  uploadedImagesForPreview: string[] = [];
  isActive:boolean = true;
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService,
    private eventScheduleService: EventScheduleService,
    private dialog: MatDialog
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
        this.eventDetails = res.body;
        this.isActive = (this.eventDetails.status!='completed')
        this.scheduledStartDate = this.eventDetails.scheduledStartDate;
        this.scheduledEndDate = this.eventDetails.scheduledEndDate;
        if (
          this.eventDetails.uploadedImages &&
          this.eventDetails.uploadedImages.length > 0
        ) {
          this.eventDetails.uploadedImages.map((image: string) => {
          this.uploadedImagesForPreview.push(`${BASE_URL}/uploads/${image}`);
          });
         
        }
        if (
          this.eventDetails.usedItems &&
          this.eventDetails.usedItems.length > 0
        ) {
          this.usedItemList = []
          this.eventDetails.usedItems.map((item:any)=>{
            let itemModel = item;
            itemModel.isEdit = false;
            this.usedItemList.push(itemModel)
          })

        }
        this.fetchCommunityDetails(this.eventDetails.communityId);
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
  completeEvent(){
    this.eventScheduleService.completeEventSchedule(this.eventId).subscribe({
      next:(value)=> {
        this.messageService.add({
          severity: 'success',
          summary: 'Event Completed',
          detail: 'Successfully Completed',
        });
        this.router.navigate(["events/list"])
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    })
  }
  updateUsedItem(){
    let payload: { eventId: number; items: any[] } = {
      eventId: this.eventId,
      items: []
    };
    if(this.usedItemList && this.usedItemList.length>0){
      for (let item of this.usedItemList) {
        let payloadModel = {
          itemId: item.id,
          newQuantityUsed: item.newUsedQuantity
        };
        if (item.newUsedQuantity > (item.requiredQuantity - item.usedQuantity)) {
          this.messageService.add({
        severity: 'error',
        summary: 'Invalid',
        detail: "Quantity exceeds available limit.",
          });
          return;
        }
        payload.items.push(payloadModel);
      }
    }else{
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid',
        detail: "No Items For Update",
      });
    }


    this.eventScheduleService.updateUsedItem(payload).subscribe({
      next:(value)=> {
        this.getEventById(this.eventId);
        this.messageService.add({
          severity: 'success',
          summary: 'Item Updated',
          detail: 'Successfully Updated',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    })
  }
  showInvoice(){
    let invoice = {
      id: this.eventDetails.id,
      title:this.eventDetails.title,
      scheduledStartDate:  this.eventDetails.scheduledStartDate,
      scheduledEndDate:  this.eventDetails.scheduledEndDate,
      invoiceDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')?.toString()!,
      communityName: this.communityDetails.communityName,
      communityAddress: this.communityDetails.communityAddress,
      phone:  this.communityDetails.phone,
      email: this.communityDetails.email,
      items: this.usedItemList,
      subtotal: this.eventDetails.totalBill,
      taxRate: 7,
      tax: this.eventDetails.totalBill*.07,
      total: this.eventDetails.totalBill + (this.eventDetails.totalBill*.07),
      paid: this.eventDetails.totalPaid,
      amountoPay: ((this.eventDetails.totalBill + (this.eventDetails.totalBill*.07)) - this.eventDetails?.totalPaid)
    };
    this.dialog.open(InvoiceComponent, {
      width: '800px',
      data: invoice,
      panelClass: 'custom-dialog-container'
    });
  }
  
}
