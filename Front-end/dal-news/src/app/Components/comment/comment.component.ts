import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/Services/data-service.service';
import { HttpService } from 'src/app/Services/http-service.service';
import { DialogData } from '../requestlist-dashboard/requestlist-dashboard.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  listComment: any
  constructor(private ref: ChangeDetectorRef, private dataservice: DataService, private httpservice: HttpService, @Inject(MAT_DIALOG_DATA) public data: any) { }
  comment: string
  ngOnInit(): void {
    this.getComments()
  }

  getComments() {
    this.httpservice.getServiceCall("/news/getComments/" + this.data.newsID).subscribe(
      (result: any) => {
        console.log(result)
        if (result.status) {
          this.listComment = result.results
          console.log(this.listComment)
          this.ref.detectChanges()
        }
      }, (error: any) => {
        console.log(error)
        alert("Something went wrong!")
      })
  }

  addComment() {
    let req = {
      newsId: this.data.newsID,
      commentedBy: this.dataservice.userData.FirstName + " " + this.dataservice.userData.LastName,
      comment: this.comment
    }
    this.httpservice.postServiceCall("/news/saveComment", req)
      .subscribe((result: any) => {
        console.log(result)

        if (result.status) {
          this.getComments()
          this.comment = ""
        }
      }, (error: any) => {
        console.log(error)
        alert("Something went wrong!")
      })
  }
}
