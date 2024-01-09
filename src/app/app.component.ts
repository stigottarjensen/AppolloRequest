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
  filterTypes: string[] = ['equal', 'in', 'like', 'between'];
  fieldType = [];
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
          element.strRTW = JSON.stringify(this.rtw.RTW, null, '  ');
          element.RTW = JSON.parse(element.strRTW);
          element.RTW.PAYLOAD.request_name = element.table_name;
          element.fields.forEach((field: any) => {
            field.checked = false;
            field.selectedFilter = 'equal';
            field.filter_values = '';
            field.filter_number_values = '';
            field.to_date = '';
            field.filter_date_values = [0, 0];
            field.filter_ids = [1,2,3,4,5,6,7,8,9];
          });
        });
        console.log(this.jsonResult);
      });
  }

  templateChange(event: any, element: any) {
    element.strRTW = JSON.stringify(element.RTW, null, '  ');
  }

  checkChange(event: any, field: any, element: any) {
    if (event) element.RTW.PAYLOAD.fields.push(field.field_name);
    else
      element.RTW.PAYLOAD.fields = element.RTW.PAYLOAD.fields.filter(
        (f: string) => f !== field.field_name
      );
    element.strRTW = JSON.stringify(element.RTW, null, '  ');
  }

  selectChange(event: any, field: any, element: any) {
    console.log(event);
    const fi = element.RTW.PAYLOAD.filters.filter(
      (f: any) => f.fields === field.field_name
    );
    if (fi.length > 0) fi[0].type = event;
    this.filterValueChange('text: called by selectChange', field, element);
  }

  filterValueChange(event: any, field: any, element: any) {
    console.log(field,element);
    
    if (!event || event === '') {
      element.RTW.PAYLOAD.filters.filter((element: any) => {
        element.field !== field.field_name;
      });
      return;
    }
    const splitCount = field.selectedFilter === 'between' ? 2 : 50;
    const splitted: boolean =
      field.selectedFilter === 'in' || field.selectedFilter === 'between';
    const cleanFilterValues = field.filter_values.replace(/\s+/g, ' ').trim();
    const fi = element.RTW.PAYLOAD.filters.filter(
      (f: any) => f.fields === field.field_name
    );

    const arr = splitted
      ? cleanFilterValues.split(' ', splitCount)
      : [cleanFilterValues];
    const valueArr =
      field.field_type === 'number' &&
      (field.selectedFilter === 'in' || field.selectedFilter === 'between')
        ? arr.map(Number)
        : arr;

    if (
      field.selectedFilter === 'between' &&
      field.to_date &&
      field.to_date.length > 4
    )
      valueArr.push(field.to_date);

    if (fi.length > 0) fi[0].values = valueArr;
    else {
      element.RTW.PAYLOAD.filters.push({
        fields: field.field_name,
        values: valueArr,
        type: field.selectedFilter,
        id: field.filter_ids.shift()
      });
    }
    element.strRTW = JSON.stringify(element.RTW, null, '  ');
  }
}
