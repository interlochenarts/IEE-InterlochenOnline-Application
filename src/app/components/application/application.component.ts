// noinspection JSIgnoredPromiseFromCall

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AppDataService} from '../../services/app-data.service';
import {RouterLink} from '../../_classes/router-link';
import {combineLatest} from 'rxjs';
import {ApplicationData} from '../../_classes/application-data';
import {StateCode} from '../../_classes/state-code';
import {CountryCode} from '../../_classes/country-code';

@Component({
  selector: 'iee-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applicationId: string;
  transactionId: string;
  isSaving = false;
  routerLinks: Array<RouterLink> = new Array<RouterLink>();
  routerIndex = -1;
  showBackLink = false;
  showNextLink = true;
  disableNextLink = false;
  showSaveAndQuit = true;
  applicationData: ApplicationData = new ApplicationData();
  @ViewChild('applicationTop') applicationTopRef: ElementRef;

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];

  get nextLinkDisabled() {
    return this.disableNextLink;
  }

  constructor(private appDataService: AppDataService, private activatedRoute: ActivatedRoute, private router: Router) {

    const linkObservable = this.appDataService.routerLinks.asObservable();
    const routerEvents = router.events;

    combineLatest([linkObservable, routerEvents]).subscribe(results => {
      const [links, event] = results;
      this.routerLinks = links;

      if (event instanceof NavigationEnd) {
        this.routerIndex = links.findIndex(l => l.link === event.urlAfterRedirects);
        this.showBackLink = this.routerIndex > 0 && !this.transactionId;
        this.showNextLink = this.routerIndex !== (links.length - 1) && !this.transactionId;
        this.showSaveAndQuit = this.routerIndex !== (links.length - 1) && !this.transactionId;
      }
    });

    appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });
    appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      this.applicationId = p.get('appId');
      if (this.applicationId) {
        this.appDataService.applicationId.next(this.applicationId);
        this.appDataService.getApplicationData(this.applicationId);
      } else {
        console.error('ERROR: No Application ID found.');
      }
      this.transactionId = p.get('txnId');
      if (this.transactionId) {
        this.appDataService.transactionId.next(this.transactionId);
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.disableNextLink = event.urlAfterRedirects.toLowerCase().includes('review')
          && !this.applicationData.isComplete(this.countryCodes, this.stateCodes);
      }
    });

    this.appDataService.getCountryData();
    this.appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });
    this.appDataService.getStateData();
    this.appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });

    this.appDataService.isSaving.asObservable().subscribe(next => {
      this.isSaving = next;
    });
    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.applicationData = appData;
      }
    });
  }

  saveAndQuit(): void {
    this.appDataService.saveApplication();
    this.appDataService.isSaving.asObservable().subscribe(saving => {
      if (!saving) {
        // leave app after save
        window.location.assign('/interlochen');
      }
    });
  }

  saveAndNext(): void {
    if (this.isSaving === false && this.disableNextLink === false) {
      this.appDataService.saveApplication();
      this.scrollToTop();
      this.router.navigate([this.routerLinks[this.routerIndex + 1].link]);
    }
  }

  saveAndBack(): void {
    if (this.isSaving === false) {
      this.appDataService.saveApplication();
      this.scrollToTop();
      this.router.navigate([this.routerLinks[this.routerIndex - 1].link]);
    }
  }

  scrollToTop = () => {
    const scrollTo: number = window.scrollY + this.applicationTopRef.nativeElement.getBoundingClientRect().top;
    window.scroll({top: scrollTo, left: 0, behavior: 'instant'});
  }
}
