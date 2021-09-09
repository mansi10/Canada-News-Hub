import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/Services/http-service.service';
import { UtilityService } from 'src/app/Services/utility-service.service';
import { RequestlistDetailsComponent } from '../requestlist-details/requestlist-details.component';

export interface DialogData {
  animal: string;
  name: string;
}

export interface PeriodicElement {
  requesterName: string;
  requestType: string;
  requestModificationDate: string;
  requestStatus: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {requesterName: 'Johny Bravo', requestType: 'Auditor', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Pending'},
  {requesterName: 'Popeye', requestType: 'Auditor', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Accepted'},
  {requesterName: 'Dexter', requestType: 'Auditor', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Rejected'},
  {requesterName: 'Oswald', requestType: 'Reader', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Pending'},
  {requesterName: 'Noddy', requestType: 'Reader', requestModificationDate: '2021-06-06 15:00:00', requestStatus: 'Pending'}
]

@Component({
  selector: 'app-requestlist-dashboard',
  templateUrl: './requestlist-dashboard.component.html',
  styleUrls: ['./requestlist-dashboard.component.css']
})
export class RequestlistDashboardComponent implements OnInit {
  // let myCompOneObj= new RequestlistDetailsComponent();

  displayedColumns: string[] = ['RequesterName', 'RequestType', 'CreatedOn', 'Status'];
  dataSource = ELEMENT_DATA;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ref: ChangeDetectorRef, public dialog: MatDialog, public util: UtilityService, private httpservice: HttpService) { }

  ngOnInit(): void {
    this.getNewsList();
  }

  getNewsList(){
    this.httpservice.getServiceCall("/requests")
    .subscribe((result: any)=>{
      console.log(result)
      var temp: any[] = result.results
      temp = temp.sort((x: any, y: any)=>{
        return x.CreatedOn - y.CreatedOn;
    })
      this.dataSource= temp;
      this.ref.detectChanges()
    },
    (error: any)=>{
      console.log(error)
      alert("Something went wrong!")
    })
  }

  openDialog(index: number) {
    const dialogRef = this.dialog.open(RequestlistDetailsComponent, {
      data: this.dataSource[index],
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getNewsList();
    });
  }

}
