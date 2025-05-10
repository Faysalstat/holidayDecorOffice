import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-modal',
  template: `
    <h2 mat-dialog-title>Preview Items</h2>
    <mat-dialog-content>
    <div class="card">
    <p-table [value]="data" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header">
            <tr>
                <th>Name</th>
                <th>Required</th>
                <th>Used</th>
                <th>Available</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
            <tr>
                <td>{{ product.itemName }}</td>
                <td>{{ product.requiredQuantity }} {{product.unitType}}</td>
                <td>{{ product.usedQuantity }}</td>
                <td>{{ product.requiredQuantity -  product.usedQuantity}} {{product.unitType}}</td>
            </tr>
        </ng-template>
    </p-table>
</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
    <button type="button" class="btn btn-danger" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class ItemModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string[]) {}
}
