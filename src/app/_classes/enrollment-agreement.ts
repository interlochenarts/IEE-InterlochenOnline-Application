export class EnrollmentAgreement {
  public signature: string;
  public birthdate: string;

  birthdateYear: string;
  birthdateMonth: string;
  birthdateDay: string;

  public updateBirthdate(): void {
    if (this.birthdateYear && this.birthdateMonth && this.birthdateDay) {
      this.birthdate = `${this.birthdateYear}-${this.birthdateMonth}-${this.birthdateDay}`;
    } else {
      this.birthdate = null;
    }
  }
}
