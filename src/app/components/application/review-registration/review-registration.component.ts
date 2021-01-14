import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';

@Component({
  selector: 'iee-review-and-submit',
  templateUrl: './review-registration.component.html',
  styleUrls: ['./review-registration.component.css']
})
export class ReviewRegistrationComponent implements OnInit {

  appData: ApplicationData;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      }
    });
  }
}
