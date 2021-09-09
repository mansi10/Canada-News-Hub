import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isShowHeader: boolean = false
  constructor(public dataservice: DataService, private router: Router) { }

  ngOnInit(): void {
    if(!this.dataservice.getLoginStatus()){
      this.router.navigateByUrl("/signin")
    }


    if(this.dataservice.userData.Role == 'Auditor' || this.dataservice.userData.Role == 'Admin'){
      this.isShowHeader = true  
    }
  }

  logout(){
    this.dataservice.logout();
    this.router.navigateByUrl("/signin")
  }
}
