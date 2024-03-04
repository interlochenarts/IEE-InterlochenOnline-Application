import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppDataService} from '../../../../services/app-data.service';
import {ApplicationData} from '../../../../_classes/application-data';
import {Payment} from '../../../../_classes/payment';
import {Parent} from '../../../../_classes/parent';
import {Router} from '@angular/router';
import {Program} from '../../../../_classes/program';

declare const Visualforce: any;

@Component({
  selector: 'iee-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentReceived = false;
  hasCode = false;
  useCredit = false;
  transactionId: string;
  appData: ApplicationData = new ApplicationData();
  selectedPrograms: Array<Program>;
  registeredPrograms: Array<Program>;
  isLoading: boolean;
  enteredCode: string;
  totalTuition: number;
  timer: number;

  userType = 'student';
  credentialStatus: string;

  get feeCoveredByCredit(): boolean {
    return this.appData.payment.useCredit && this.appData.payment.credits >= this.appData.payment.amountOwed;
  }

  constructor(private appDataService: AppDataService, private router: Router) {
  }

  ngOnInit(): void {
    this.transactionId = null;
    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
        this.paymentReceived = appData.payment.paidOnLoad && !appData.isRegistered ? appData.payment.paidOnLoad : this.paymentReceived;
        this.isLoading = true;
        // Load payment info in case they picked programs since the data was last loaded
        // noinspection JSUnresolvedReference
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.getPaymentJSON',
          this.appData.appId,
          result => {
            if (result && result !== 'null') {
              this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
              this.hasCode = this.appData.payment.waiverCode != null;
              this.totalTuition = this.appData.payment.appliedCredits + this.appData.payment.appliedWaivers;
              this.totalTuition += this.appData.payment.amountOwed + this.appData.payment.amountPaid;
            }
            this.isLoading = false;
          },
          {buffer: false, escape: false}
        );

        this.selectedPrograms = this.appData.acProgramData?.programs.filter(p => p.isSelected && (!p.isRegistered || (p.isRegistered && p.lessonCountAdd > 0)));
        // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
        this.selectedPrograms.sort(Program.sort);

        // Only registered programs
        this.registeredPrograms = this.appData.acProgramData?.programs.filter(p => p.isSelected && p.isRegistered && (!p.lessonCountAdd || p.lessonCountAdd === 0));
        // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
        this.registeredPrograms.sort(Program.sort);
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId && this.transactionId !== trxId && this.appData) {
        this.transactionId = trxId;
        this.isLoading = true;
        this.timer = setInterval(() => this.checkPayment(), 1500);
      }
    });

    this.appDataService.getUserType();
    this.appDataService.userType.asObservable().subscribe(type => {
      this.userType = type;
    });
    this.appDataService.credentialStatus.asObservable().subscribe(status => {
      this.credentialStatus = status;
    });
  }
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  canPay(): boolean {
    return !this.paymentReceived && this.appData.payment.amountOwed !== 0.00 && !this.feeCoveredByCredit;
  }

  confirmCredit(): void {
    // Do VF here to call confirmCredit function, set .credit to response... add to applied? figure out new owed?

    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.confirmCredit',
      this.appData.appId, this.appData.payment.useCredit,
      (result: string) => {
        if (result && result !== 'null') {

          this.useCredit = false;
          this.appData.payment.useCredit = false;
          this.appData.payment.amountOwed -= +result;
          this.appData.payment.credits -= +result;
          this.appData.payment.appliedCredits += +result;
          // Only set tuition paid if this actually covered the fee completely
          if (this.appData.payment.amountOwed <= 0) {
            this.appData.payment.tuitionPaid = true;
            this.paymentReceived = true;
          }
        } else {
          console.error('error applying Credits for app id: ' + this.appData.appId);
          console.dir(result);
        }
      },
      {buffer: false, escape: false}
    );
  }
  applyCode(): void {
    this.isLoading = true;
    this.useCredit = this.appData.payment.useCredit;
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.applyFeeWaiver',
      this.appData.appId, this.enteredCode,
      (result: string) => {
        if (result && result !== 'null') {
          this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
          this.appData.payment.useCredit = this.useCredit;
          this.paymentReceived = this.appData.payment.tuitionPaid;
          this.appDataService.paymentReceived.next(this.paymentReceived);
        } else {
          console.error('error applying code for app id: ' + this.appData.appId);
          console.dir(result);
        }
        this.isLoading = false;
      },
      {buffer: false, escape: false}
    );
  }

  addProgramsWithWaiver(): void {
    this.isLoading = true;
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addProgramsWithWaiver',
      this.appData.appId,
      (result: string) => {
        if (result && result !== 'null') {
          this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
          this.paymentReceived = this.appData.payment.tuitionPaid;
          this.appDataService.paymentReceived.next(this.paymentReceived);
          this.selectedPrograms = null;
        } else {
          console.error('error adding program with waiver for app id: ' + this.appData.appId);
          console.dir(result);
        }
        this.isLoading = false;
      },
      {buffer: false, escape: false}
    );
  }

  removeCode(waiverCode): void {
    this.isLoading = true;
    this.useCredit = this.appData.payment.useCredit;
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeFeeWaiver',
      this.appData.appId,
      waiverCode,
      (result: string) => {
        if (result && result !== 'null') {
          this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
          this.appData.payment.useCredit = this.useCredit;
          this.paymentReceived = this.appData.payment.tuitionPaid;
          this.appDataService.paymentReceived.next(this.paymentReceived);
          this.enteredCode = null;
        } else {
          console.error('error removing code for app id: ' + this.appData.appId);
          console.dir(result);
        }
        this.isLoading = false;
      },
      {buffer: false, escape: false}
    );
  }
  get codeDisabled(): boolean {
    return this.appData.payment.waiverCode != null && this.appData.payment.waiverDescription === 'Waiver applied';
  }
  get achAmount(): number {
    // Assigned for convenience and because linting was yelling at me
    const amountOwed = this.appData.payment.amountOwed;
    const spendableCredit = this.appData.payment.spendableCredit;
    return this.appData.payment.useCredit ? amountOwed - spendableCredit : amountOwed;
  }

  sendParentCredentials(parent: Parent): void {
    this.appDataService.sendParentCredentials(parent, this.appData.student);
  }
  checkPayment(): void {
    this.isLoading = true;
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getPaymentJSON',
      this.appData.appId,
      (result: string) => {
        if (result && result !== 'null') {
          this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
          this.hasCode = this.appData.payment.waiverCode != null;
          this.totalTuition = this.appData.payment.appliedCredits + this.appData.payment.appliedWaivers;
          this.totalTuition += this.appData.payment.amountOwed + this.appData.payment.amountPaid;
          if (this.appData.payment.amountOwed <= 0) {
            clearInterval(this.timer);

            this.selectedPrograms?.forEach(program => { program.registeredDate = new Date().toLocaleDateString()});
            this.selectedPrograms = null;
            this.appData.payment.tuitionPaid = true;
            this.paymentReceived = true;
            this.appDataService.paymentReceived.next(this.paymentReceived);

            // Mark selected app choices as registered
            this.appData.acProgramData.programs.forEach(program => { program.isRegistered = true;});
            this.appData.isRegistered = true;

            // Only registered programs
            this.registeredPrograms = this.appData.acProgramData?.programs.filter(p => p.isSelected && p.isRegistered && (!p.lessonCountAdd || p.lessonCountAdd === 0));
            // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
            this.registeredPrograms.sort(Program.sort);

            this.transactionId = null;
            this.appDataService.transactionId.next(null);

            this.isLoading = false;
          }
        }
      },
      {buffer: false, escape: false}
    );
  }
}
