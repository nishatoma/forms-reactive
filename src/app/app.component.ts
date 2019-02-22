import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        // You can provide one or multiple validators via an array.
        // this.forbiddenNames.bind(this) makes sure we are calling it
        // from app component.
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
    // this.signupForm.valueChanges.subscribe(
    //   (value) => {
    //     console.log(value);
    //   }
    // )
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );

    // Setting values now
    this.signupForm.setValue({
      'userData': {
        'username': 'Max',
        'email': 'max@tst.com',

      },
      'gender': 'male',
      'hobbies': []
    })
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  addHobby() {
    const control = new FormControl(null, Validators.required);
    // We need to cast to a form array
    (<FormArray>this.signupForm.get('hobbies')).push(control)
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  // Asynchronous validator!
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test') {
          resolve({'emailWrong': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  hasError(path: string, errName: string): boolean {
    return this.signupForm.get(path).hasError(errName);
  }
}
