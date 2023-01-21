import { Component, OnInit } from '@angular/core';
import { Butler } from '@services/butler.service';
import { AuthRESTService } from '@services/authREST.service';
import { DataApiService } from '@services/data-api.service'; 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: []
})
export class AuthComponent implements OnInit {

  constructor(
    public _butler:Butler,
    public AuthRESTService:AuthRESTService, 
    public dataApiService: DataApiService
    ) { }

  ngOnInit(): void {
  }

}
