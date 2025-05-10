import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { AppConfigNames, TaskStatus } from '../../dto/models';
import { PdfMakeService } from 'src/app/services/pdf-make.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from './shared-comps/comps/image-modal-component';
import { ItemModalComponent } from './shared-comps/comps/item-modal-component';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  communityList: any[] = [];
  chargePerBagRoll: number = 0;
  chargePerBinReplacement: number = 0;
  chargePerNewStationInstallment: number = 0;
  chargePerHandSanitizer: number = 0;
  selectedScheduledDate!: string;
  eventList:any[] = [];
  requiredItemList:any[] = [];
  constructor(
    private eventScheduleService: EventScheduleService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private pdfMakeService: PdfMakeService,
    private dialog: MatDialog
  ) {
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.selectedScheduledDate = transformedDate ? transformedDate : '';
  }

  ngOnInit(): void {
    this.fetchAllEvents();
  }
  fetchAllEvents() {
    const params: Map<string, any> = new Map();
    params.set('scheduledDate', this.selectedScheduledDate);
    this.eventScheduleService.getAllEventSummaryForToday(params).subscribe({
      next: (res) => {
        console.log('Summary:', res);
        this.eventList = res.body.eventSummary;
        this.requiredItemList = res.body.requiredItemList
      },
      error: (err) => {
        console.error('Error fetching event list:', err);
      },
    });
  }

  ngOnDestroy() {}
  getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return today.toLocaleDateString('en-GB', options);
  }
  onDateChange(event: any) {
    if (event.value) {
      this.selectedScheduledDate = this.datePipe
        .transform(event.value, 'yyyy-MM-dd')
        ?.toString()!;
      this.fetchAllEvents();
    }
  }
  // downloadWorkOrder() {
  //   let orders: any[] = [];
  //   let index = 1;
  //   // head: [['SN', 'Comunity Name', 'Address', 'Manager','Contact No', 'Garbage Bins QNT', 'Pet Station QNT']],
  //   this.communityList.forEach((community: any) => {
  //     let orderRow = [];
  //     orderRow.push(index);
  //     orderRow.push(community.communityName);
  //     orderRow.push(community.communityAddress);
  //     orderRow.push(community.camOfcommunity);
  //     orderRow.push(community.phone);
  //     orderRow.push(community.noOfGarbageBin);
  //     orderRow.push(community.noOfPetStation);
  //     index++;
  //     orders.push(orderRow);
  //   });
  //   let workOrderModel = {
  //     date: '',
  //     invoiceId: 'N/A',
  //     orders: orders,
  //   };
  //   let today = new Date();
  //   let formatedDate =
  //     today.getDate() +
  //     '/' +
  //     (today.getMonth() + 1) +
  //     '/' +
  //     today.getFullYear();
  //   this.pdfMakeService.downloadWorkOrder(workOrderModel, formatedDate);
  // }
  openImageModal(item: any): void {
    this.dialog.open(ImageModalComponent, {
      data: item.uploadedImages,
      width: '800px',
    });
  }

  openItemModal(item: any): void {
    this.dialog.open(ItemModalComponent, {
      data: item.usedItems,
      width: '100%',
    });
  }
}
