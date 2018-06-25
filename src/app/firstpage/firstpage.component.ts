import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})

export class FirstpageComponent implements OnInit {
  totalDbSize = 0;
  totalKvp = 0;
  numDbs = 0;
  crudCommits = 0;
  transactionLatency = 0;
  minTransactionLatency = 50;
  maxTransactionLatency = 0;
  peersList = [];


  constructor(private communicationService: CommunicationService) {
    communicationService.stateChange.subscribe((newState) => {
      this.renderUI(newState.state);
    });
  }

  ngOnInit() {
  }

  renderUI(newState) {
    this.totalDbSize = newState.totaldbsize;
    this.totalKvp = newState.totalkvp;
    this.crudCommits = newState.crudcommits;
    this.numDbs = newState.numdbs;
    this.peersList = newState.peersList;
    this.transactionLatency = newState.transactionLatency;
    if (newState.transactionLatency < this.minTransactionLatency) {
      this.minTransactionLatency = newState.transactionLatency;
    }
    if (newState.transactionLatency > this.maxTransactionLatency) {
      this.maxTransactionLatency = newState.transactionLatency;
    }
  }
}
