import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoService } from 'src/app/modules/shared-services/photo.service';
import { BASE_URL } from 'src/app/utils/urls.const';

@Component({
  selector: 'app-image-modal',
  template: `
    <h2 mat-dialog-title>Preview Images</h2>
    <mat-dialog-content>
      <p class="text-center" *ngIf="data.length == 0">
        No Image available to preview
      </p>
      <div *ngIf="data.length > 0" class="mt-5">
        <!-- Carousel -->
        <div id="demo" class="carousel slide" data-bs-ride="carousel">
          <!-- Indicators/dots -->
          <div class="carousel-indicators">
            <button
              *ngFor="let image of data; let i = index"
              type="button"
              [attr.data-bs-target]="'#demo'"
              [attr.data-bs-slide-to]="i"
              [class.active]="i === 0"
              [attr.aria-current]="i === 0 ? 'true' : null"
              [attr.aria-label]="'Slide ' + (i + 1)"
            ></button>
          </div>

          <!-- The slideshow/carousel -->
          <div class="carousel-inner">
            <div
              *ngFor="let image of data; let i = index"
              class="carousel-item"
              [class.active]="i === 0"
            >
              <img
                [src]="getImageUrl(image)"
                alt="Uploaded Image"
                class="d-block mx-auto img-fluid"
                style="max-height: 400px;"
              />
            </div>
          </div>

          <!-- Left and right controls/icons -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="btn btn-danger" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .carousel {
        height: 400px;
        background-color: #363636;
      }
    `,
  ],
})
export class ImageModalComponent {
  base = BASE_URL;
  responsiveOptions: any[] | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5,
      },
      {
        breakpoint: '768px',
        numVisible: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ];
  }
  getImageUrl(image: string) {
    return `${BASE_URL}/uploads/${image}`;
  }
}
