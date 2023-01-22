import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Butler } from "@services/butler.service";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  constructor(
  	public butler:Butler, 
 	 private http: HttpClient
  	) {}
	registerUpload(image: any){
		this.butler.partImages.push(image);	
	}
}