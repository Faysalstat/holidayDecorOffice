import { Component, OnInit } from '@angular/core';
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
  constructor(private decorationItemService:DecorationItemService){
    this.item = {
      itemName:"",
      quantity:0
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
          this.itemList.push({itemName:item.itemName,quantity:item.quantity,isEdit:false,newQuantity:0,unitType:item.unitType})
        })
        
      },
      error:(err)=> {
        console.log(err.message)
      },
    })
  }

  createItems(){
    let payload = this.item;
    this.decorationItemService.createDecorationItem(payload).subscribe({
      next:(res)=>{
        console.log(res);
        this.item = {
          itemName:"",
          quantity:0
        } 
        this.getAllItems();
      }
    })
  }
  onEdit(item:any){

  }
}
