import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Butler } from "@services/butler.service";

import { AuthRESTService } from '@services/authREST.service';
export interface PartInterface {

}
export interface MessageInterface {

}
export interface ChatInterface {

}
export interface CarInterface {
}
export interface MemberInterface {

}
export interface CardInterface {
	id?:string;

}
export interface TicketInterface {

}
export interface SerialInterface {
	serialT:string,
}
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
	ticket: Observable<any>;
	cards:any;
	chat:any;
	messages:any;
	chats:any;
	cars:any;
	parts:any;
	branch:any;
	cierre:any;
	serial:any;
	transactions:any;
  constructor(
  	public butler:Butler, 

  	private AuthRESTService:AuthRESTService,
 	 private http: HttpClient
  	) {}
  	headers : HttpHeaders = new HttpHeaders({  		
		  "Content-Type":"application/json"	
	});

	deleteOrder(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/orders/${id}/?access_token$={token}`;
		return this.http
		.delete<PartInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deletePart(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/products/${id}/?access_token$={token}`;
		return this.http
		.delete<PartInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteCar(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/cars/${id}/?access_token$={token}`;
		return this.http
		.delete<CarInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteChat(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/chats/${id}/?access_token$={token}`;
		return this.http
		.delete<ChatInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteMessage(idChat: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/messages?filter[where][idChat]=${idChat}/?access_token$={token}`;
		return this.http
		.delete<MessageInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	deleteMember(id: string){
		const token = this.AuthRESTService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/cards/${id}/?access_token$={token}`;
		return this.http
		.delete<MemberInterface>(url_api, {headers: this.headers})
		.pipe(map(data => data));
	}
	getTransationByBranch(branch: string){
		const url_api = `https://db.zofricars.com:9001/api/transactions?filter[where][idBranch]=${branch}`;
		this.transactions = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}

	getAllProducts(){
		const url_api = 'https://db.zofricars.com:9001/api/products';
		return this.http.get(url_api);
	}
	getAllCars(){
		const url_api = 'https://db.zofricars.com:9001/api/cars';
		return this.http.get(url_api);
	}

	getAllChats(){
		const url_api = 'https://db.zofricars.com:9001/api/chats';
		return this.http.get(url_api);
	}
	getMessagesBy(idChat: string){
		const url_api = `https://db.zofricars.com:9001/api/messages?filter[where][idChat]=${idChat}`;
		this.messages = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}


	
	getAllCards(){
		const url_api = 'https://db.zofricars.com:9001/api/cards';
		return this.http.get(url_api);
	}

	getAllOrders(){
		const url_api = 'https://db.zofricars.com:9001/api/orders';
		return this.http.get(url_api);
	}
	getAllTransactions(){
		const url_api = 'https://db.zofricars.com:9001/api/transactions';
		return this.http.get(url_api);
	}
	getProduct(id: string){
		const url_api = `https://db.zofricars.com:9001/api/products/${id}`;
		return this.http.get(url_api);
	}

	getCierresByBranch(branch: string){
		const url_api = `https://db.zofricars.com:9001/api/infos?filter[where][idBranch]=${branch}`;
		this.cierre = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}


	carUpdate(car :CarInterface, id: string){
		// let token = this.authService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/cars/${id}`;
		return this.http
		.put<CarInterface>(url_api, car)
		.pipe(map(data => data));
	}
	partUpdate(part :PartInterface, id: string){
		// let token = this.authService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/products/${id}`;
		return this.http
		.put<PartInterface>(url_api, part)
		.pipe(map(data => data));
	}
	cardUpdate(card :CardInterface, id: string){
		// let token = this.authService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/cards/${id}`;
		return this.http
		.put<CardInterface>(url_api, card)
		.pipe(map(data => data));
	}

	memberUpdate(member :MemberInterface, id: string){
		// let token = this.authService.getToken();
		const url_api=`https://db.zofricars.com:9001/api/cards/${id}`;
		return this.http
		.put<MemberInterface>(url_api, member)
		.pipe(map(data => data));
	}
	getPartsById(userId: string){
		const url_api = `https://db.zofricars.com:9001/api/products?filter[where][userId]=${userId}`;
		this.parts = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}
	getCarsById(userId: string){
		const url_api = `https://db.zofricars.com:9001/api/cars?filter[where][userId]=${userId}`;
		this.cars = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}
	getCardByUserId(userId: string){
		const url_api = `https://db.zofricars.com:9001/api/cards?filter[where][userd]=${userId}`;
		this.cards = this.http.get(url_api);
		return ( this.http.get(url_api));		
	}
	getSerialT(branch: string){
		const url_api = `https://db.zofricars.com:9001/api/branchs/${branch}`;
		this.branch = this.http.get(url_api);
		this.butler.serialT=this.branch.serialT;
		return ( this.branch);		
	}
	// setSerialT(branch: string){
	// 	const url_api = `https://db.zofricars.com:9001/api/branchs/${branch}`;
	// 	this.branch = this.http.get(url_api);
	// 	this.butler.serialT=this.branch.serialT;
	// 	return ( this.branch);		
	// }
	setSerialT(serial:SerialInterface, branch: string){
		// let token = this.authService.getToken();
		const url_api = `https://db.zofricars.com:9001/api/branchs/${branch}`;
		return this.http
		.put<SerialInterface>(url_api, serial)
		.pipe(map(data => data));
	}


	saveCard(card :CardInterface){
		const url_api='https://db.zofricars.com:9001/api/cards';
		return this.http
		.post<CardInterface>(url_api, card)
		.pipe(map(data => data));
	}
	saveMessage(message:MessageInterface){
		const url_api='https://db.zofricars.com:9001/api/messages';
		return this.http
		.post<MessageInterface>(url_api, message)
		.pipe(map(data => data));
	}

	saveCar(car :CarInterface){
		const url_api='https://db.zofricars.com:9001/api/cars';
		return this.http
		.post<CarInterface>(url_api, car)
		.pipe(map(data => data));
	}
	savePart(part :PartInterface){
		const url_api='https://db.zofricars.com:9001/api/products';
		return this.http
		.post<PartInterface>(url_api, part)
		.pipe(map(data => data));
	}
	saveTicket(ticket :TicketInterface){
		const url_api='https://db.zofricars.com:9001/api/transactions';
		return this.http
		.post<TicketInterface>(url_api, ticket)
		.pipe(map(data => data));
	}
}