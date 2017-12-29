import {Injectable, OnInit} from "@angular/core";
import { Http, Response} from '@angular/http';

@Injectable()
export class ApiServiceService   {
  constructor(private http: Http) {}
  getServerInfo(url: string): Promise<any> {
    const arr: Array<any> = [];
    return this.http
      .get(url)
      .toPromise()
      .then((res) => {
        const body = res.json();
        for (const key in body)  {
          arr.push(body[key]); }
        return arr;
      })
      .catch(error => {throw new Error(error); });
  }
}
