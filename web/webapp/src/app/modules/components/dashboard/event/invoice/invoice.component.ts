import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { PdfMakeService } from 'src/app/services/pdf-make.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  displayedColumns: string[] = ['totalBill', 'totalPaid', 'totalDue'];
  constructor(
    public dialogRef: MatDialogRef<InvoiceComponent>,
    private pdfMakeService: PdfMakeService,
    private communityService: CommunityService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public invoice: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getMonth()+1)+"/"+(newDate.getDate()) + '/' + newDate.getFullYear()
    );
  }
 


  getStatusClass(status:string): string {
    return status === 'pending'
      ? 'bg-warning text-dark'
      : 'bg-success';
  }
  downloadInvoice(): void {
    const invoiceData = {
      invoiceNo: 'INV-2025-0012',
      issueDate: '2025-05-09',
      serviceDate: '2025-05-08',
      customer: {
        name: 'John Smith',
        address1: '789 Holiday Lane',
        address2: 'Snowville, CA 90210'
      },
      items: [
        { name: 'LED String Lights', qty: 10, unitPrice: 15 },
        { name: 'Christmas Tree Setup', qty: 1, unitPrice: 100 },
        { name: 'Outdoor Wreaths', qty: 3, unitPrice: 25 }
      ],
      subtotal: 325,
      taxRate: 10,
      tax: 32.5,
      total: 357.5,
      paid:100,
      amountoPay:237.5
    };

    this.pdfMakeService.generateInvoice(invoiceData);
  }
  payInvoice() {
    // this.communityService.payInvoice(this.invoice.id).subscribe({
    //   next: (response) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Invoice paid successfully',
    //     });
    //     this.communityService.fetchInvoiceList.emit();
    //     this.dialogRef.close();
    //   },
    //   error: (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'An error occurred while paying invoice',
    //     });
    //   },
    // })
  }

}
