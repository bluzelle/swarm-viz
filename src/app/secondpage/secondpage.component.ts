import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../communication.service';

import { ChartFactory,  ChartMapEntry } from '../../chart.factory';

@Component({
  selector: 'app-secondpage',
  templateUrl: './secondpage.component.html',
  styleUrls: ['./secondpage.component.css']
})
export class SecondpageComponent implements OnInit {
  totalKvp = 0;
  totalDbSize = 0;
  transactionLatency = 0;

  @ViewChild('dbSizeChart') dbSizeChartElement: ElementRef;
  @ViewChild('totalKvpChart') totalKvpChartElement: ElementRef;
  @ViewChild('transactionLatencyChart') transactionLatencyChart: ElementRef;
  chartFactory = new ChartFactory();

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {
    const ctxDbSize = this.dbSizeChartElement.nativeElement.getContext('2d');
    const chartDBSize = this.chartFactory.getDefaultLineChart(ctxDbSize);

    const ctxTotalKvp = this.totalKvpChartElement.nativeElement.getContext('2d');
    const chartTotalKvp = this.chartFactory.getDefaultLineChart(ctxTotalKvp);

    const ctxTransactionLat = this.transactionLatencyChart.nativeElement.getContext('2d');
    const chartTransactionLat = this.chartFactory.getDefaultLineChart(ctxTransactionLat);


    const charts: Array<ChartMapEntry> = [
      new ChartMapEntry('ChartDBSize', chartDBSize, (state) => state.totaldbsize),
      new ChartMapEntry('ChartTotalKvp', chartTotalKvp, (state) => state.totalkvp),
      new ChartMapEntry('ChartTransactionLatency', chartTransactionLat, (state) => state.transactionLatency)
    ];

    const self = this;
    this.communicationService.stateChange.subscribe((newState) => {
      self.chartFactory.renderCharts(charts, newState.states);
      self.renderUI(newState.state);
    });


  }

  renderUI(newState) {
    this.totalKvp = newState.totalkvp;
    this.totalDbSize = newState.totaldbsize;
    this.transactionLatency = newState.transactionLatency;
  }

}
