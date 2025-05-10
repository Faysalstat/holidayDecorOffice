import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO, EventCreateDTO, ItemModel } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { DecorationItemService } from 'src/app/services/decoration-item.service';
import { EventScheduleService } from 'src/app/services/event-schedule.service';
import { UploadService } from 'src/app/services/upload.service';
import { BASE_URL } from 'src/app/utils/urls.const';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  communityEventCreateDTO: EventCreateDTO = new EventCreateDTO();
  communityId!: number;
  eventId!: number;
  title:string = '';
  description:string = '';
  communityDetails:CommunityDTO = new CommunityDTO();
  itemModel:ItemModel = new ItemModel();
  itemList :any[] = [];
  usedItemList :ItemModel[] = [];
  newUsedItemList :ItemModel[] = [];
  scheduledStartDate!: string ;
  scheduledEndDate!: string ;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedFileName:string = ''
  uploadMessage: string = '';
  uploadedImagesForPreview:string[] = [];
  newUploadedImages:string[] = [];
  
  uploadedImages:string[] = []
  communityList: any[] = [];
  showCommunityDetails: boolean = false;
  selectedCommunity: string = ''
  totalBill:number = 0;
  totalPaid:number = 0;
  deposit:number = 0;
  dueAmount:number = 0;
  isEdit: boolean = false;
  constructor(
    private router: Router,
    private datePipe:DatePipe,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService,
    private decorationItemService:DecorationItemService,
    private uploadService:UploadService,
    private eventScheduleService: EventScheduleService,
  ) {
    // Initialize any other properties if needed
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.scheduledStartDate = transformedDate ? transformedDate : '';
    this.scheduledEndDate = transformedDate ? transformedDate : '';
  }

  ngOnInit(): void {
    this.getAllCommunity();
    this.getAllItems();
    
  }
  getEventById(id:number){
    this.eventScheduleService.getEventScheduleById(id).subscribe({
      next: (res) => {
        console.log(res);
        let eventDetails = res.body;
        this.prepareForm(eventDetails);
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
  getAllCommunity(){
    this.communityService.getAllCommunity().subscribe({
      next: (res) => {
        if(res.body && res.body.length > 0){
          this.communityList = [{label: 'Select a Community', value: ''}];
          let communities = res.body;
          communities.map((elem:any)=>{
              let community = { label: elem.communityName, value: elem }
              this.communityList.push(community);
          });
          this.route.params.subscribe((params) => {
            this.eventId = +params['id'];
            if (this.eventId) {
              this.isEdit = true;
              this.getEventById(this.eventId);
            }
          });
        }

      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },

    })
  }
  fetchCommunityDetails(id: number) {
    this.communityService.getCommunityById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.showCommunityDetails = true;
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
  getAllItems(){
    this.decorationItemService.getAllDecorationItem().subscribe({
      next:(res)=>{
        let items = res.body;
        this.itemList = [];
        items.map((item:any)=>{
          this.itemList.push({label:item.itemName,value:{id:item.id,itemName:item.itemName}})
        })
        
      },
      error:(err)=> {
        console.log(err.message)
      },
    })
  }
  prepareForm(eventData: any) {
      this.fetchCommunityDetails(eventData.communityId);
      this.title = eventData.title;
      this.description = eventData.description;
      this.communityId = eventData.communityId;
      this.scheduledStartDate = eventData.scheduledStartDate;
      this.scheduledEndDate = eventData.scheduledEndDate;
      this.totalBill = eventData.totalBill;
      this.totalPaid = eventData.totalPaid;
      this.dueAmount = this.totalBill - this.totalPaid;
      for (let index = 0; index < this.communityList.length; index++) {
        const item = this.communityList[index].value;
        if(item.id == eventData.communityId){
          console.log("Selected Community", item)
          this.selectedCommunity = item;
        }
      };
      
      if(eventData.uploadedImages && eventData.uploadedImages.length>0){
      this.uploadedImages = eventData.uploadedImages;
      eventData.uploadedImages.map((image:string)=>{
        this.uploadedImagesForPreview.push(`${BASE_URL}/uploads/${image}`)
      });
    }
      this.usedItemList = eventData.usedItems;
    }
  addItem(){
    if(!this.itemModel.id || !this.itemModel.requiredQuantity){
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: "Please add item and quantity",
      });
      return;
    }
    this.usedItemList.push({id:this.itemModel.id,itemName:this.itemModel.itemName,requiredQuantity:this.itemModel.requiredQuantity,usedQuantity:this.itemModel.usedQuantity,isEdit:false});
    if(this.isEdit){
      this.newUsedItemList.push({id:this.itemModel.id,itemName:this.itemModel.itemName,usedQuantity:this.itemModel.usedQuantity,requiredQuantity:this.itemModel.requiredQuantity,isEdit:false});
    }
    this.itemModel = new ItemModel();
  }
  deleteItem(index:number){
    this.usedItemList.splice(index,1);
  }
  editItem(index:number){

  }
  onSelectItem(event:any){
    console.log(event);
    this.itemModel = event.value;
  }
  onStartDateChange(event: any) {
    console.log(event)
    if (event.value) {
      this.scheduledStartDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')?.toString()!;
    }
  }
  onEndDateChange(event: any) {
    console.log(event)
    if (event.value) {
      this.scheduledEndDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')?.toString()!;
    }
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.uploadService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.uploadMessage = 'Image uploaded successfully!';
          this.selectedFile = null;
          this.previewUrl = "";
          this.uploadedImages.push(response.filename);
          this.uploadedImagesForPreview.push(`${BASE_URL+response.path}` );
          if(this.isEdit){
            this.newUploadedImages.push(response.filename);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.uploadMessage = 'Image upload failed.';
          console.error(error);
        }
      });
    }
  }
  onSelectCommunity(event:any){
    console.log('Selected Community:', event);
    this.communityId = event.value.id;
    if (this.communityId) {
      this.fetchCommunityDetails(this.communityId);
    }
  }
  onSubmit(){
    let payload = new EventCreateDTO();
    if (!this.communityId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: "Please select a community",
      });
      return;
    }
    payload.title = this.title;
    payload.description = this.description;
    payload.communityId = this.communityId;
    payload.scheduledStartDate = this.scheduledStartDate;
    payload.scheduledEndDate = this.scheduledEndDate;
    payload.totalBill = this.totalBill;
    payload.totalPaid = this.totalPaid + this.deposit;
    payload.deposit = this.deposit;
    if(this.isEdit){
      payload.id = this.eventId;
      payload.newUploadedImages = this.newUploadedImages;
      payload.newUsedItems = this.newUsedItemList;
      this.updateEvent(payload);
    }else{
      payload.uploadedImages = this.uploadedImages;
      payload.usedItems = this.usedItemList;
      this.createEvent(payload);
    }
    

  }

  createEvent(payload:any){
    if(this.usedItemList && this.usedItemList.length == 0){
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: "Please add item and quantity",
      });
      return;
    }
    this.eventScheduleService.createEventSchedule(payload).subscribe({
      next:(value)=> {
        this.messageService.add({
          severity: 'success',
          summary: 'Event Created',
          detail: 'Successfully Created',
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
  updateEvent(payload:any){
    this.eventScheduleService.updateEventSchedule(payload).subscribe({
      next:(value)=> {
        this.messageService.add({
          severity: 'success',
          summary: 'Event Updated',
          detail: 'Successfully Updated',
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
  calculateDueAmount() {
    this.totalBill = Number(this.totalBill) || 0;
    this.totalPaid = Number(this.totalPaid) || 0;
    this.deposit = Number(this.deposit) || 0;
    this.dueAmount = this.totalBill - this.totalPaid - this.deposit;
  }
}

