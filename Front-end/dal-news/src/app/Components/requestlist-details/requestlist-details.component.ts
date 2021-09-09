import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/Services/http-service.service';
import { UtilityService } from 'src/app/Services/utility-service.service';

@Component({
  selector: 'app-requestlist-details',
  templateUrl: './requestlist-details.component.html',
  styleUrls: ['./requestlist-details.component.css']
})
export class RequestlistDetailsComponent implements OnInit {

  accepted: boolean;

  confirmed: boolean;

  originalRequestTypeValue: string;

  enableConfirmBtn: boolean = false;

  requestType: string;

  selectedType: string;

  selectedRole: string;

  originalRoleValue: string;

  isRoleChangeRequest: boolean;

  isDiffLess: boolean;

  constructor(public dialogRef: MatDialogRef<RequestlistDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public util: UtilityService, private httpService: HttpService, ) { 
    
    // data= dialogRef.componentInstance.data;
    data=[
       {requesterName: 'Johny Bravo', email : 'abc@gmail.ca', requestType: 'Auditor', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Pending'}
     ]  
    util.modalTitle="User Details";
  }

  ngOnInit(): void {
  }

// getData(){
//   this.httpservice.getServiceCall("/requests")
//     .subscribe((result: any)=>{
//       this.data= result.results;
//       console.log(result)
//       return this.data;
//     },
//     (error: any)=>{
//       console.log(error)
//     })
// }

  close() {
    this.dialogRef.close({event: 'close', data: this.data});
  }

  Approve(requestType: any){

    //if condition based on action to be updated later
    if(requestType == "Create Post"){
      this.createNews();
    }
    else if(requestType == "Update Post"){
      this.editNews()
    }
    else if(requestType == "Delete Post"){
      this.deleteNews()
    }

  }

createNews(){
  this.httpService.postServiceCall('/news/savePost', this.data)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        alert("Request Successfully approved.")
      }
    },
    (error:any)=>{
      console.log(error);
      alert("Something went wrong!")
  })
}

editNews(){
  this.httpService.postServiceCall('/news/updatePost', this.data)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        alert("Request Successfully approved.")
      }
    },
    (error:any)=>{
      console.log(error);
      alert("Something went wrong!")
  })

}

deleteNews(){
  this.httpService.postServiceCall('/news/deletePost', this.data)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        alert("Request Successfully approved.")
      }
    },
    (error:any)=>{
      console.log(error);
      alert("Something went wrong!")
  })

}

Declined(){
  this.httpService.postServiceCall('/news/decline', this.data)
    .subscribe( (result:any)=>{
      console.log(result)
      if(result.status){
        alert("Request Successfully approved.")
      }
    },
    (error:any)=>{
      console.log(error);
      alert("Something went wrong!")
  })

}

}
