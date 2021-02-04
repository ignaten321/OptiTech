import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { RegisterModel } from './entities/registerModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public registerModel: RegisterModel;
  public isAllInputField: boolean;
  public isOnblur = false;

  @ViewChild('container1', { static: false }) container1: ElementRef;
  @ViewChild('container2', { static: false }) container2: ElementRef;
  @ViewChild('container3', { static: false }) container3: ElementRef;

  click$: Observable<any> = fromEvent(document, 'click');
  input$: Observable<any> = fromEvent(document, 'input');


  private subscribeToObservables() {
    this.click$.subscribe((x) => this.fillValueInForm(x.toElement.name));
    this.input$.subscribe((x) => {
      this.fillValueInForm(x.target.attributes.class.value,
        (document.querySelector(`.${x.target.attributes.class.value}`) as HTMLTextAreaElement).value);
    });
  }


  ngOnInit() {
    this.registerModel = new RegisterModel();
    this.subscribeToObservables();
  }

  private fillValueInForm(inputName: string, data?: string) {
    if (inputName === 'email') { this.registerModel.email = data; }
    if (inputName === 'userPassword') { this.registerModel.password = data; }
    if (inputName === 'userPassword2') {

      this.registerModel.password2 = data;
      if (this.isOnblur) {
        if (this.registerModel.password !== this.registerModel.password2) {
          this.container3.nativeElement.innerHTML = `<p>password do not match</p`;
        } else {
          this.container3.nativeElement.innerHTML = ``;
        }
      }
    }
    if (inputName === 'register') { this.validationForm(); }
    if (this.registerModel.password && this.registerModel.password2 && this.registerModel.password) {
      this.isAllInputField = true;
    } else {
      this.isAllInputField = false;
    }

  }

  public onblurValidation() {
    if (this.registerModel.password !== this.registerModel.password2) {
      this.container3.nativeElement.innerHTML = `<p>password do not match</p`;
    } else {
      this.container3.nativeElement.innerHTML = ``;
    }
  }

  private validationForm() {
    let isValid = true;

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(String(this.registerModel.email).toLowerCase()) === false) {
      this.container1.nativeElement.innerHTML = `<p>wrong mail format</p`;
      isValid = false;
    } else {
      this.container1.nativeElement.innerHTML = ``;
    }

    if (this.registerModel.password.length <= 4 && isValid) {
      this.container2.nativeElement.innerHTML = `<p>too short password</p`;
      isValid = false;
    } else {
      this.container2.nativeElement.innerHTML = ``;
    }

    if (this.registerModel.password !== this.registerModel.password2 && isValid) {
      this.container3.nativeElement.innerHTML = `<p>password do not match</p`;
      isValid = false;
    } else {
      this.container3.nativeElement.innerHTML = ``;
    }

    if (isValid) {
      alert(`Email: ${this.registerModel.email}, Password: ${this.registerModel.password}`);
    }

  }


}