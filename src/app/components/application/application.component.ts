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

  constructor(private appDataService: AppDataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      this.applicationId = p.get('appId');
      if (this.applicationId) {
        this.appDataService.applicationId.next(this.applicationId);
        this.appDataService.getApplicationData(this.applicationId);
      }
    });

    this.appDataService.getCountryData();
    this.appDataService.getStateData();
  }

  saveApplication(): void {
    this.appDataService.saveApplication();
  }
}
