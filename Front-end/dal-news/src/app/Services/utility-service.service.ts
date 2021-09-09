import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  modalTitle:any;
  isAuditor: boolean= false;
  
  constructor(private httpservice: HttpService) { }

  publishNotification(){
    
  }
}
