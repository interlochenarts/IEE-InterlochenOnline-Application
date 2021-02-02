export class EnrollmentAgreement {
  signature: string;

  birthdateYear: string;
  birthdateMonth: string;
  birthdateDay: string;
  birthdate: string;

  public updateBirthdate(): void {
    if (this.birthdateYear && this.birthdateMonth && this.birthdateDay) {
      this.birthdate = `${this.birthdateYear}-${this.birthdateMonth}-${this.birthdateDay}`;
    } else {
      this.birthdate = null;
    }
  }
}
