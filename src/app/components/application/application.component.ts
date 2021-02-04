import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppDataService} from '../../services/app-data.service';

@Component({
  selector: 'iee-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applicationId: string;
  transactionId: string;

  constructor(private appDataService: AppDataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      this.applicationId = p.get('appId');
      if (this.applicationId) {
        this.appDataService.applicationId.next(this.applicationId);
        this.appDataService.getApplicationData(this.applicationId);
      }
      this.transactionId = p.get('txnId');
      if (this.transactionId) {
        this.appDataService.transactionId.next(this.transactionId);
        console.log('WEEE! ' + this.transactionId);
        // Do some work here to verify the transaction id instead of trusting them?
      }
    });
  }

  saveApplication(): void {
    this.appDataService.saveApplication();
  }
}
