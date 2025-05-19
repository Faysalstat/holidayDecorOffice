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
    console.log(this.invoice);
    const paddedInvoiceId = String(this.invoice.id).padStart(4, '0');
    const invoiceData = {
      invoiceNo: `INV-${paddedInvoiceId}`,
      issueDate: this.invoice.invoiceDate,
      serviceDate: `${this.invoice.scheduledStartDate} to ${this.invoice.scheduledEndDate}`,
      customer: {
      name: this.invoice.communityName,
      address1: this.invoice.communityAddress,
      address2: this.invoice.email
      },
      items: this.invoice.items,
      subtotal: this.invoice.subtotal,
      taxRate: this.invoice.taxRate,
      tax: this.invoice.tax,
      total: this.invoice.total,
      paid: this.invoice.paid,
      amountoPay: this.invoice.amountoPay,
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
