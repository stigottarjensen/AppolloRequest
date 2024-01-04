import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AppolloRequest';
  jsonResult: any = 'empty';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const date = new Date();
    date.getTime();
    this.http
      .get('http://localhost:8778/AbisDB2JSON/abis/hive', { withCredentials: true })
      .subscribe((result: any) => {
        console.log(result);
        this.jsonResult = result;
      });
  }
}
