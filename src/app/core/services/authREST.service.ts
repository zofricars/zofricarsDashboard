import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable }  from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UserInterface } from '@interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthRESTService {

  constructor(private http: HttpClient) { }

	headers : HttpHeaders = new HttpHeaders({
		"Content-Type":"application/json"
		});

	//registerUser( email: string, password: string,status :string,userType :string){
	registerUser( email: string, password: string){
		const url_api ='https://db.buckapi.us:9001/api/Users';
		return this.http
		//.post<UserInterface>(url_api,{email,password,status,userType},{headers:this.headers})
		.post<UserInterface>(url_api,{email,password},{headers:this.headers})
		.pipe(map(data => data));
	}

	loginUser(email:string, password:string):Observable<any>{
		const url_api ='https://db.buckapi.us:9001/api/Users/login?include=user';
		return this.http
		.post<UserInterface>(url_api,{email,password},{headers:this.headers})
		.pipe(map(data => data));
	}

  	setUser(user:UserInterface):void{
  		let user_string = JSON.stringify(user);
  		localStorage.setItem("currentUser",user_string);
  	}	
  	setToken(token:any): void{
  		localStorage.setItem("accessToken",token);
  	}

	getToken(){
	 	return localStorage.getItem("accessToken");
	  }
	getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("currentUser");
	    if (user_string ) {
		      let user: UserInterface = JSON.parse(user_string!);
		      return user;
		    } else { 
		      return null!;
			}
  		}
	 logoutUser(){
	  	let accessToken = localStorage.getItem('accessToken');
		  	const url_api = 'https://db.buckapi.us:9001/api/users/logout?access_token=${accessToken}';
		   	localStorage.removeItem('accessToken');
		  	localStorage.removeItem('currentUser');
		  	return this.http.post<UserInterface>(url_api,{headers: this.headers});
	 	}
}