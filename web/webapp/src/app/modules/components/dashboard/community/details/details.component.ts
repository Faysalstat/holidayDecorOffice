import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [DatePipe],
})
export class DetailsComponent implements OnInit {
  communityId!: number;
  communityDetails!: any;
  accountHistory: any[] = [];
  showAccountHistory: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.communityId = +params['id'];
      if (this.communityId) {
        this.fetchCommunityDetails(this.communityId);
      }
    });
  }
  fetchCommunityDetails(id: number) {
    this.communityService.getCommunityById(id).subscribe({
      next: (res) => {
        console.log(res);
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
  editCommunity() {
    this.router.navigate(['community/edit', this.communityId]); // Navigate to the edit route with the item ID
  }
  goBack() {
    this.router.navigate(['community/list']);
  }
  showAccountHistoryRecords() {
    this.showAccountHistory = !this.showAccountHistory;
    if (this.showAccountHistory) {
      this.communityService
        .getAllTnxHistoryByCommunityId(this.communityId)
        .subscribe({
          next: (res) => {
            this.accountHistory = res.body;
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
  }
}
