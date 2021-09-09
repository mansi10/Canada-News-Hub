import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data-service.service';
import { HttpService } from 'src/app/Services/http-service.service';
import { UtilityService } from 'src/app/Services/utility-service.service';
import { CommentComponent } from '../comment/comment.component';
import { PostDetailsComponent } from '../post-details/post-details.component';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {
  listPosts:any [];
  constructor(public dataservice: DataService, private httpseervice: HttpService,private utilityService: UtilityService, public dialog: MatDialog, private router : Router) { }

  ngOnInit(): void {
    this.getData();
  }

  addPost(){
    this.utilityService.publishNotification();
  }

  deletePost(news: any){
    news.requestBy = this.dataservice.userData.FirstName + " " + this.dataservice.userData.LastName
    this.httpseervice.postServiceCall("/requests/delete",news)
      .subscribe((result: any)=>{
        if(result.status){
          alert("Deleted Request Successfully Created!")
          this.httpseervice.publishNotification()
          .subscribe((result)=>{
            console.log(result)
          })
        }
      },(error: any)=>{
        console.log(error)

      })
  }
  editPost(news: any){
    this.dataservice.postDetails = news
    this.dataservice.mode = "E"
    this.router.navigateByUrl("/main/news-details")
  }

  comment(NewsId: any){
    const dialogRef = this.dialog.open(CommentComponent,{
      width:"60%",
      height:"80%",
      data: {
        newsID: NewsId
      }
    });
  }
  getData(){
    this.httpseervice.getServiceCall('/news')
    .subscribe((result: any)=>{
      console.log(result)
      if(result.status){
      this.listPosts = result.results
      }
    },(error)=>{
      console.log(error)
      alert("Something went wrong!")
    })
  }
}
