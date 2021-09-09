import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/Services/http-service.service';
import { UtilityService } from 'src/app/Services/utility-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  ProfileFormGroup: FormGroup
  Role:string;
  FirstName: "";
  LastName: "";
  Email: "";
  Password: "";
  ConfirmPassword: "";
  ReasonForBeingAuditor: ""
  private _snackBar: any;
  message: string;

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private router: Router, public util: UtilityService) { }

  ngOnInit(): void {
    this.registerForm();
    this.Role="Reader";
  }

  isAuditorResponse(){
    this.util.isAuditor = ! this.util.isAuditor;
  }

  registerForm(){
    this.ProfileFormGroup = this.formBuilder.group({

      Role: ['', Validators.required], 

      FirstName: ['', [Validators.required, Validators.pattern("([a-zA-Z0-9 ]+)")] ],

      LastName: ['', [Validators.required, Validators.pattern("([a-zA-Z0-9 ]+)")] ],

      Email: ['', [Validators.required, Validators.pattern("([a-zA-Z0-9-_.]+[@]+[a-zA-Z0-9-_.]+[.]+[a-zA-Z0-9]+[a-zA-Z0-9]+)")]],

      Password: ['', [Validators.required, Validators.minLength(8)]],

      ConfirmPassword: ['', Validators.required],

      ReasonForBeingAuditor: ['',[Validators.required, Validators.maxLength(200) ]]
   },
   {
        validator: this.checkPassword()
   });
  }


  checkPassword() {
    return (group: FormGroup) => {
      const password = group.controls['Password'];
      const confirmPassword = group.controls['ConfirmPassword'];
      if (confirmPassword.errors && confirmPassword.errors.mismatch) {
        return;
      }
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      }
    }
  }

  submitRegistration(){
    this.httpService.postServiceCall('/user/register', this.ProfileFormGroup.value)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        console.log(result.message)
        // this.message="Registration is successful";
        // this._snackBar.open(this.message ,  'Dismiss', {
        //   duration: 3000,
        // });
        alert('Registration is successful')
        this.router.navigate(['/signin']);
      }
      else{
        console.log(result.message)
        this.message="Error in registration";
        // this._snackBar.open(this.message ,  'Dismiss', {
        //   duration: 3000,
        // });
      }
    },
    (error:any)=>{
      console.log(error);
  })
}

  login(){
    this.router.navigate(["/signin"]);
  }

}
