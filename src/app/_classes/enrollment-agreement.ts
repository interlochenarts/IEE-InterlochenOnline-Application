export class EnrollmentAgreement {
  public signature: string;
  public birthdate: string;
  public acceptanceChecked: boolean;

  birthdateYear: string;
  birthdateMonth: string;
  birthdateDay: string;

  public canCheckAcceptance(): boolean {
    return !!this.signature && !!this.birthdate;
  }

  public isComplete(): boolean {
    return !!this.signature && !!this.birthdate && this.acceptanceChecked;
  }
}
