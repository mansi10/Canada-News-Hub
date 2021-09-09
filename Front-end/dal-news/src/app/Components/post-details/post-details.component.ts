import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data-service.service';
import { HttpService } from 'src/app/Services/http-service.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  constructor(private router : Router, private httpservice: HttpService, private dataservice: DataService) { }
  addPostForm: FormGroup
  previewImg: string | ArrayBuffer
  postDetails: any
  isEdit: boolean = false
  ngOnInit(): void {
    var title = ""
    var desc = ""
    this.postDetails = this.dataservice.postDetails
    if(this.dataservice.mode == "E"){
      this.isEdit = true
      this.previewImg = this.postDetails.NewsImageURL
      title = this.postDetails.NewsTitle
      desc = this.postDetails.NewsDescription
    }
    else{
      this.isEdit = false
    }
    this.addPostForm = new FormGroup({
      'title' : new FormControl( title, {validators: [Validators.required]}),
      'content': new FormControl(desc, {validators: Validators.required}),
      'image':  new FormControl()
    })
  }

save(){
  if(this.isEdit){
    this.Edit()
  }
  else{
    this.Create()
  }
}
  Create() { 
    let TS = Date.now()
    let image: File = this.addPostForm.value.image;
    let data: FormData = new FormData();
    data.append("title", this.addPostForm.value.title )
    data.append("content", this.addPostForm.value.content )
    data.append("image", image , this.addPostForm.value.title )
    data.append("createdBy", this.dataservice.userData.FirstName + " " + this.dataservice.userData.LastName ) 
    data.append("requestType", "Create Post" ) 

    this.httpservice.postServiceCall("/requests",data)
    .subscribe((result: any)=>{
      console.log(result)
      if(result.status){
        alert("Create Post Request Successfully Raised!")
        this.httpservice.publishNotification()
        .subscribe((result)=>{
          console.log(result)
        })
        this.router.navigateByUrl("/main/news")
      }
    },
    (error: any)=>{
      console.log(error)
      alert("Something went wrong!")
    })
    
  }

  Edit(){
        let req= {
      "NewsId": this.dataservice.postDetails.NewsId ,
      "title": this.addPostForm.value.title ,
      "content": this.addPostForm.value.content,
      "NewsImageURL": this.postDetails.NewsImageURL,
      "requestBy": this.dataservice.userData.FirstName + " " + this.dataservice.userData.LastName,
      "requestType": "Update Post" ,
  
    }
    this.httpservice.postServiceCall("/requests/update",req)
    .subscribe((result: any)=>{
      console.log(result)
      if(result.status){
        alert("Update Post Request Successfully Raised!")
        this.httpservice.publishNotification()
        .subscribe((result)=>{
          console.log(result)
        })

        this.router.navigateByUrl("/main/news")
      }
    },
    (error: any)=>{
      console.log(error)
      alert("Something went wrong!")
    })

  }


  imagePicked(event: any){
    const file =  event.target.files[0];
    this.addPostForm.patchValue({
      image: file
    });
    this.addPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.result.toString().split(';')[0].includes('image')){
      this.previewImg =  reader.result 
      }
      else{
        this.previewImg = ""
      }
    }
    reader.readAsDataURL(file)
  }
}
