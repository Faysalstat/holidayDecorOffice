export class JobServiceDTO {
    id?: number;
    serviceName?: string;
}
export class CommunityDTO {
    id?: number;
    communityName?: string;
    communityAddress?: string;
    latitude?: number;
    longitude?: number;
    camOfcommunity?: string;
    gateCode?: string;
    phone?: string;
    email?: string;
    lockBoxCode?: string;
    hasPower:boolean = false;
}

export enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
  }

export enum AppConfigNames {
  PRICE_PER_BAG_ROLL = 'PRICE_PER_BAG_ROLL',
  PRICE_PER_NEW_STATION_INSTALLMENT = 'PRICE_PER_NEW_STATION_INSTALLMENT',
  PRICE_PER_BIN_REPLACEMENT = 'PRICE_PER_BIN_REPLACEMENT',
  PRICE_PER_HAND_SANITIZER = 'PRICE_PER_HAND_SANITIZER',
}

export class EventData{
  id?: number;
  scheduledDate?:string;
  description?: string;
  communityName?: string;
  status?: string;
}

export class DecorationItemDTO{
  id?: number;
  itemName?: string;
  quantity?:number;
  costPrice?:number;
  unitType?:string;
  quanityWasted?:number;
}

export class ItemModel{
  id?:number;
  itemName?: string;
  requiredQuantity:number = 0;
  usedQuantity:number = 0;
  unitType?:string;
  isEdit: boolean = false;
}
export class ItemUpdateModel{
  id?:number;
  itemName?: string;
  requiredQuantity:number = 0;
  usedQuantity:number = 0;
  newUsedQuantity:number = 0;
  unitType?:string;
  isEdit: boolean = false;
}
export class EventCreateDTO{
  id?:number;
  title?:string;
  description?:string;
  communityId?:number;
  scheduledStartDate?:string;
  scheduledEndDate?:string;
  uploadedImages?:string[];
  newUploadedImages?:string[];
  usedItems?:ItemModel[];
  newUsedItems?:ItemModel[];
  totalBill?:number;
  totalPaid?:number;
  deposit?:number;
  
}