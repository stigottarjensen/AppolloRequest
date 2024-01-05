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
  filterTypes: string[] = ['none', 'equal', 'in', 'like', 'between'];
  rtw: any = {
    RTW: {
      TIMESTAMP: '',
      SENDER: 'The Stig',
      RECEIVER: 'Chessmaster Levang',
      TOPIC: 'queryrequest',
      REFID: 'uuid',
      PAYLOAD: {
        request_name: '',
        fields: [],
        filters: [],
        template: '',
      },
    },
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const date = new Date();
    date.getTime();
    this.http
      .get('http://localhost:8778/AbisDB2JSON/abis/hive', {
        withCredentials: true,
      })
      .subscribe((result: any) => {
        this.jsonResult = result;
        this.jsonResult.forEach((element: any) => {
          element.open = false;
          element.filter_template = '';
          element.RTW = JSON.parse(JSON.stringify(this.rtw.RTW));
          element.RTW.PAYLOAD.request_name = element.table_name;
          element.fields.forEach((field: any) => {
            field.checked = false;
            field.selectedFilter = 'none';
            field.filter_values = '';
          });
        });
        console.log(this.jsonResult);
      });
  }

  anyChange(event: any) {
    console.log(event);
  }
}
