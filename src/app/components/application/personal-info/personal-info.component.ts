import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';

@Component({
  selector: 'iee-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  appData: ApplicationData;

  constructor() { }

  ngOnInit(): void {
  }

}
