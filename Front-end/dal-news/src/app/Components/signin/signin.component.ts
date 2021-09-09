import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data-service.service';
import { HttpService } from 'src/app/Services/http-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  LoginFormGroup: FormGroup
  Email: "";
  Password: "";
  loggedInStatus: string;
  loggedinUser: any;

  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private router: Router, private dataservice :DataService) { }

  ngOnInit(): void {
    this.loginForm();
  }

  loginForm(){
    this.LoginFormGroup = this.formBuilder.group({

      Email: ['', [Validators.required, Validators.pattern("([a-zA-Z0-9-_.]+[@]+[a-zA-Z0-9-_.]+[.]+[a-zA-Z0-9]+[a-zA-Z0-9]+)")]],

      Password: ['', [Validators.required, Validators.minLength(8)]]
    },
  );
  }

  login(){
    this.httpService.postServiceCall('/user/signin', this.LoginFormGroup.value)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        console.log(result.message)
        this.dataservice.setLoggedInUser(result.data);
        this.router.navigate(['/main/news']);
        // this._snackBar.open(result.message ,  'Dismiss', {
        //   duration: 3000,
        // });
      }
      else{
        console.log(result.message)
        // this._snackBar.open(result.message ,  'Dismiss', {
        //   duration: 3000,
        // });
      }
    },
    (error:any)=>{
      console.log(error);
      this.setUserLoggedInStatus(error.error);
  })
  }

  setUserLoggedInStatus(result: any) {
    this.loggedInStatus = status;
  }
  getUserLoggedInStatus(){
    return this.loggedInStatus;
  }

  public getLoggedinUser(){
    return this.loggedinUser;
  }  

  public setLoggedinUser(user : any){
    this.loggedinUser = user;
  }
  
  gotoRegister(){
    this.router.navigate(["/register"]);
    
  }

}
