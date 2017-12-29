import { BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GuessTheNumberComponent } from './guess-the-number/guess-the-number.component';
import {HttpModule} from '@angular/http';
import {ApiServiceService} from "./apiService.service";
import {StorageService} from "./storageService.service";

@NgModule({
  declarations: [
    AppComponent,
    GuessTheNumberComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ApiServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
