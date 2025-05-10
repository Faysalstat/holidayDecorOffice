import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root',
})
export class PdfMakeService {
  constructor() {}
  public async downloadWorkOrder(workOrder: any, date: string) {
    const doc = new jsPDF();
    await this.buildWorkOrder(doc, workOrder);
    return doc.save('workOrder_' + date + 'Printing_Copy');
  }
  async buildWorkOrder(doc: any, workOrder: any) {
    autoTable(doc, {
      body: [
        [
          {
            content: 'Doggy Duty',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#787878',
            },
          },
        ],
      ],
      theme: 'plain',
      // styles: {
      //   fillColor: '#3366ff'
      // }
    });
    autoTable(doc, {
      head: [
        [
          'SN',
          'Comunity Name',
          'Address',
          'Manager',
          'Contact No',
          'Garbage Bins QNT',
          'Pet Station QNT',
        ],
      ],
      body: workOrder.orders,
      theme: 'striped',
      headStyles: {
        fillColor: '#787878',
      },
    });
  }

  generateInvoice(invoiceData: any): void {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage('assets/img/holiday-decor-logo.png', 'PNG', 30, 30, 60, 60); // Increased the size of the logo
    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Community Decor Services', 100, 40, {
      align: 'left',
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Festive Street', 110, 60, { align: 'left' });
    doc.text('Phone: (555) 123-4567', 110, 75, { align: 'left' });
    doc.text('Email: info@decorservices.com', 110, 90, {
      align: 'left',
    });

    // Line
    doc.setDrawColor(200);
    doc.line(40, 105, pageWidth - 40, 105);

    // Invoice Meta
    let leftY = 125;
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 40, leftY);

    doc.setFont('helvetica', 'normal');
    leftY += 20;
    doc.text(`Invoice #: ${invoiceData.invoiceNo}`, 40, leftY);
    leftY += 15;
    doc.text(`Date Issued: ${invoiceData.issueDate}`, 40, leftY);
    leftY += 15;
    doc.text(`Service Date: ${invoiceData.serviceDate}`, 40, leftY);

    // Bill To
    let rightY = 125;
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', pageWidth - 40, rightY, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    rightY += 20;
    doc.text(invoiceData.customer.name, pageWidth - 40, rightY, {
      align: 'right',
    });
    rightY += 15;
    doc.text(invoiceData.customer.address1, pageWidth - 40, rightY, {
      align: 'right',
    });
    rightY += 15;
    doc.text(invoiceData.customer.address2, pageWidth - 40, rightY, {
      align: 'right',
    });
    const finalY = 200;
    const totalsX = 40; // Adjusted to the left
    const totalsY = finalY + 30;
    const lineHeight = 24;

    // Line
    doc.setDrawColor(200);
    doc.line(40, 200, pageWidth - 40, 200);
    // Subtotal
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80); // dark gray
    doc.setFont('helvetica', 'bold');
    doc.text(`Subtotal:`, totalsX, totalsY);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${invoiceData.subtotal.toFixed(2)}`, pageWidth - 40, totalsY, {
      align: 'right',
    });

    // Tax
    doc.setFont('helvetica', 'bold');
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, totalsY + lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `$${invoiceData.tax.toFixed(2)}`,
      pageWidth - 40,
      totalsY + lineHeight,
      { align: 'right' }
    );

    // Total with emphasis

    doc.setTextColor(80, 80, 80); // dark gray
    doc.setFont('helvetica', 'bold');
    doc.text(`Total:`, totalsX, totalsY + lineHeight * 2 );
    doc.text(
      `$${invoiceData.total.toFixed(2)}`,
      pageWidth - 40,
      totalsY + lineHeight * 2 ,
      { align: 'right' }
    );

    doc.setTextColor(80, 80, 80); // dark gray
    doc.setFont('helvetica', 'bold');
    doc.text(`Paid:`, totalsX, totalsY + lineHeight * 3);
    
    doc.text(
      `$${invoiceData.paid.toFixed(2)}`,
      pageWidth - 40,
      totalsY + lineHeight * 3,
      { align: 'right' }
    );

    // Line
    doc.setDrawColor(200);
    doc.line(
      40,
      totalsY + lineHeight * 4,
      pageWidth - 40,
      totalsY + lineHeight * 4
    );
    // Total Amount to Pay
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80); // dark gray
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount to Pay:`, totalsX, totalsY + lineHeight * 5 + 5);
    doc.setTextColor(255, 0, 0); // red
    doc.text(
      `$${invoiceData.amountoPay.toFixed(2)}`,
      pageWidth - 40,
      totalsY + lineHeight * 5 + 5,
      { align: 'right' }
    );
    
    
    // // Footer
    // doc.setFontSize(10);
    // doc.setFont('helvetica', 'normal');
    // doc.setTextColor(0);
    // doc.text(
    //   'Note: Decoration items will be collected within 7 days.',
    //   pageWidth/2,
    //   totalsY + 200,{ align: 'center' }
    // );
    // doc.text(
    //   'For inquiries, contact: info@decorservices.com',
    //   pageWidth/2,
    //   totalsY + 215,{ align: 'center' }
    // );

    // Save
    doc.save(`${invoiceData.invoiceNo}.pdf`);
  }

  // getTotalAmount(invoices:any[]): number {
  //   return invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  // }
  getInvoiceStatus(invoices: any[]): string {
    return invoices?.some((inv) => inv.status === 'pending')
      ? 'pending'
      : 'completed';
  }

  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      newDate.getMonth() +
      1 +
      '/' +
      newDate.getDate() +
      '/' +
      newDate.getFullYear()
    );
  }

  //   generatePDF(invoice: any) {
  //     const doc = new jsPDF();

  //     // Title
  //     doc.setFontSize(22);
  //     doc.text('Invoice', 14, 22);

  //     // Add invoice details
  //     doc.setFontSize(12);
  //     doc.text(`Invoice Date: ${invoice.invoiceDate}`, 14, 40);
  //     doc.text(`Status: ${invoice.status}`, 14, 50);

  //     // Community details
  //     doc.text('Community Details:', 14, 70);
  //     doc.text(`Community Name: ${invoice.community.communityName}`, 14, 80);
  //     doc.text(`Address: ${invoice.community.communityAddress}`, 14, 90);
  //     doc.text(`Phone: ${invoice.community.phone}`, 14, 100);
  //     doc.text(`Email: ${invoice.community.email}`, 14, 110);

  //     // Add a horizontal line
  //     doc.line(14, 115, 200, 115);

  //     // Table of Costs
  //     autoTable(doc, {
  //       head: [['Item', 'Quantity', 'Cost per Unit', 'Total']],
  //       body: [
  //         ['Garbage Bins', invoice.totalGarbageBins, invoice.costPerGarbageBins, invoice.totalGarbageBins * invoice.costPerGarbageBins],
  //         ['Pet Stations', invoice.totalPetStations, invoice.costPerPetStations, invoice.totalPetStations * invoice.costPerPetStations],
  //         ['Bag Replacements', invoice.totalBagReplaced, invoice.costPerBagReplaced, invoice.totalBagReplaced * invoice.costPerBagReplaced],
  //       ],
  //       startY: 120,
  //     });

  //     // Total Amount
  //     doc.setFontSize(12);
  //     doc.text(`Total Amount: $${invoice.totalAmount}`, 14, doc.autoTable.previous.finalY + 10);

  //     // Save the PDF
  //     doc.save('invoice.pdf');
  //   }
}
