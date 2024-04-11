import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../_classes/application-data';
import {AppDataService} from '../../services/app-data.service';

@Component({
  selector: 'iee-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  appData: ApplicationData;
  isSaving = false;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      } else {
        this.appData = new ApplicationData();
      }
    });

    this.appDataService.isSaving.asObservable().subscribe(next => {
      this.isSaving = next;
    });
  }

  saveApplication(): void {
    this.appDataService.saveApplication();
  }
}
