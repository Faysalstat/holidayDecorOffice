import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DecorationItemService } from 'src/app/services/decoration-item.service';

@Component({
  selector: 'app-decoration-items',
  templateUrl: './decoration-items.component.html',
  styleUrls: ['./decoration-items.component.scss']
})
export class DecorationItemsComponent implements OnInit {
  itemList!:any[];
  item!:any;
  units:any[] = []
  isEdit: boolean = false;
  constructor(
    private decorationItemService:DecorationItemService,
    private messageService:MessageService
  ){
    this.item = {
      id:"",
      itemName:"",
      quantity:0,
      unitType: "PIECE"
    };
    this.units = [
      {label:"Piece",value:"PIECE"},
      {label:"Feet",value:"FEET"},
      {label:"lb",value:"LB"},
    ]
    
  }
  ngOnInit(): void {
      this.getAllItems();
  }

  getAllItems(){
    this.decorationItemService.getAllDecorationItem().subscribe({
      next:(res)=>{
        let items = res.body;
        this.itemList = [];
        items.map((item:any)=>{
          this.itemList.push({id:item.id,itemName:item.itemName,quantity:item.quantity,isEdit:false,newQuantity:0,unitType:item.unitType})
        })
        
      },
      error:(err)=> {
        console.log(err.message)
      },
    })
  }

  createItems(){
    let payload = this.item;
    if(this.isEdit){
      console.log("Update item Model", payload)
      this.decorationItemService.updateDecorationItem(payload).subscribe({
        next: (res) => {
         console.log(res);
         this.messageService.add({
           severity: 'success',
           summary: 'Updated',
           detail: 'Successfully Updated',
         });
         this.item.quantity = 0;
         this.item.itemName= '';
       },
       error: (err) => {
         this.messageService.add({
           severity: 'error',
           summary: 'Error',
           detail: err.message,
         });
       },
     })
    }else{
      this.decorationItemService.createDecorationItem(payload).subscribe({
        next: (res) => {
         console.log(res);
         this.messageService.add({
           severity: 'success',
           summary: 'Created',
           detail: 'Successfully Created',
         });
         this.item.quantity = 0;
         this.item.itemName= '';
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
    this.getAllItems();
  }
  onEdit(item:any){
    this.item = {
      id:item.id,
      itemName:item.itemName,
      quantity:item.quantity,
      unitType:item.unitType
    };
    this.isEdit = true;
  }
}
