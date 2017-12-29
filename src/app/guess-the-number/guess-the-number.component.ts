import { Component, OnInit } from '@angular/core';
import {ApiServiceService} from "../apiService.service";
import {StorageService} from "../storageService.service";

@Component({
  providers: [StorageService],
  selector: 'app-guess-the-number',
  templateUrl: './guess-the-number.component.html',
  styleUrls: ['./guess-the-number.component.css']
})
export class GuessTheNumberComponent implements OnInit {
  url1 = 'https://guessing-game-backend-v90sychixp46.runkit.sh/status';
  url2 = 'https://guessing-game-backend-v90sychixp46.runkit.sh/range';
  serverError = false;
  errorMessage;
  numberOfTries = 0;
  originalMinRange;
  originalMaxRange;
  minRange;
  maxRange;
  loadedMinAndMax = false;
  randomNumber = -9999;
  userPickNumber = false;
  numberFound = false;
  previousRandom;
  gameOutput = 'loading data from server... ';
  dataFromLocalStorage;

  constructor(private apiServiceService: ApiServiceService, private storageService: StorageService) {
  }

  ngOnInit() {
    if (this.getDataFromLocalStorage() === false) {
    const promise = this.apiServiceService.getServerInfo(this.url1)
      .then((data) => {
        if (data[0] !== true) throw new Error('server not enabled'); else {
          this.apiServiceService.getServerInfo(this.url2)
            .then((data2) => {
              this.originalMinRange = data2[0], this.originalMaxRange = data2[1];
              this.minRange = this.originalMinRange;
              this.maxRange = this.originalMaxRange;
              this.loadedMinAndMax = true;
              this.gameOutput = 'Think of a number between ' + this.minRange + ' and ' + this.maxRange;
            }).catch(error => {
            console.log(error), this.errorMessage = error, this.serverError = true;
          });
        }
      })
      .catch(error => {
        console.log(error), this.errorMessage = error, this.serverError = true;
      }); }
  }
  getDataFromLocalStorage() {
    this.dataFromLocalStorage = this.storageService.read('data');
    if (this.dataFromLocalStorage !== null ) {
      this.numberOfTries = this.dataFromLocalStorage['numberOfTries']
      this.minRange = this.dataFromLocalStorage['minRange']
      this.maxRange = this.dataFromLocalStorage['maxRange']
      this.userPickNumber = this.dataFromLocalStorage['userPickNumber']
      this.numberFound = this.dataFromLocalStorage['numberFound']
      this.originalMaxRange = this.dataFromLocalStorage['originalMaxRange'];
      this.originalMinRange = this.dataFromLocalStorage['originalMinRange'];
      this.gameOutput = this.dataFromLocalStorage['gameOutput'];
      this.randomNumber = this.dataFromLocalStorage['randomNumber'];
      this.previousRandom = this.dataFromLocalStorage['previousRandom'];
      this.loadedMinAndMax = true; return true; } else {
      return false; }}

  userChooseNumber() {
    this.userPickNumber = true;
    this.GuessNumber();
  }
  numberIsLower() {
   this.maxRange = this.randomNumber - 1;
    this.GuessNumber();
  }
  numberIsBigger() {
    this.minRange = this.randomNumber + 1;
    this.GuessNumber();
  }
  GuessNumber() {
    this.previousRandom = this.randomNumber;
    this.randomNumber = this.randomIntFromInterval(this.minRange , this.maxRange);
    if (this.previousRandom !== this.randomNumber) {
      this.gameOutput = 'i guess your number is ' + this.randomNumber;
      this.numberOfTries++;
    }
  }
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  foundTheNumber() {
    this.numberFound = true;
    this.gameOutput = 'I\'ve guessed your number in ' + this.numberOfTries + ' tries' ;
  }
  restartGame() {
    this.numberOfTries = 0;
    this.minRange = this.originalMinRange
    this.maxRange = this.originalMaxRange;
    this.userPickNumber = false;
    this.numberFound = false;
    this.gameOutput = 'think of a number between ' + this.minRange + ' and ' + this.maxRange;
}
  onRefresh() {
    const dataToLocalStorage = { 'numberOfTries': this.numberOfTries, 'minRange': this.minRange, 'maxRange': this.maxRange ,
      'userPickNumber': this.userPickNumber, 'numberFound': this.numberFound, 'gameOutput' : this.gameOutput
    , 'originalMinRange': this.originalMinRange, 'originalMaxRange': this.originalMaxRange,
      'randomNumber' : this.randomNumber , 'previousRandom' : this.previousRandom};
    this.storageService.write('data', dataToLocalStorage);
  }
}
