import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';

@Component({
  selector: 'iee-sign-and-pay',
  templateUrl: './sign-and-pay.component.html',
  styleUrls: ['./sign-and-pay.component.css']
})
export class SignAndPayComponent implements OnInit {
  appData: ApplicationData = new ApplicationData();

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      }
    });
  }
}
