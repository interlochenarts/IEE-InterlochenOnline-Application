import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AppDataService} from '../../services/app-data.service';
import {RouterLink} from '../../_classes/router-link';
import {combineLatest} from 'rxjs';

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
  showSaveAndQuit = true;

  constructor(private appDataService: AppDataService, private activatedRoute: ActivatedRoute,
              private router: Router) {

    const linkObservable = this.appDataService.routerLinks.asObservable();
    const routerEvents = router.events;

    combineLatest([linkObservable, routerEvents]).subscribe(results => {
      const [links, event] = results;
      this.routerLinks = links;

      if (event instanceof NavigationEnd) {
        this.routerIndex = links.findIndex(l => l.routerLink === event.urlAfterRedirects);
        this.showBackLink = this.routerIndex !== 0;
        this.showNextLink = this.routerIndex !== (links.length - 1);
        this.showSaveAndQuit = this.routerIndex !== (links.length - 1);
      }
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

    this.appDataService.getCountryData();
    this.appDataService.getStateData();
    this.appDataService.isSaving.asObservable().subscribe(next => {
      this.isSaving = next;
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
    if (this.isSaving === false) {
      this.router.navigate([this.routerLinks[this.routerIndex + 1].routerLink]);
      this.appDataService.saveApplication();
    }
  }

  saveAndBack(): void {
    if (this.isSaving === false) {
      this.router.navigate([this.routerLinks[this.routerIndex - 1].routerLink]);
      this.appDataService.saveApplication();
    }
  }
}
