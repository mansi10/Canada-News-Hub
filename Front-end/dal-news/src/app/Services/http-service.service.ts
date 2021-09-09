import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  localURL = "http://localhost:3000/api";
  ProdURL = ""
  isPROD :boolean = true;
  URL:string 
  constructor(private http: HttpClient) { 
    this.URL = window.location.hostname == 'localhost'?this.localURL:this.ProdURL
    console.log(this.URL)
  }

  getServiceCall(path: string){
    return this.http.get(this.URL + path);
  }

  postServiceCall(path: string, data:any ){
    
    return this.http.post(this.URL + path, data);
  }

  putServiceCall(path: string, data:any ){
    return this.http.put(this.URL + path, data);
  }

  deleteServiceCall(path: string, data:any ){
    return this.http.delete(this.URL + path, data);
  }

  publishNotification(){
    let url = ""
    //url = "https://8k96107e17.execute-api.us-east-1.amazonaws.com/NewsLambdaFunction"
    return this.http.get(url);
  }
}
