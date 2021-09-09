import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  userData: any;
  mode: string = "A";
  postDetails: any;

  constructor() {
   }

   resetPostDetails(){
     this.postDetails = null
     this.mode = "A"
   }

   logout(){
    this.userData.loginStatus = false
   }

   getLoginStatus(){
     if(this.userData){
       return this.userData.loginStatus;
     }
     else{
       return false
     }
   }

   setLoggedInUser(obj :any){
     console.log(obj)
    this.userData = obj
   }

}
