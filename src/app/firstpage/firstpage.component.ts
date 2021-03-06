import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { ChartFactory,  ChartMapEntry } from '../../app/chart.factory';
import * as R from 'ramda';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})

export class FirstpageComponent implements OnInit {
  MIN_LATENCY = 40;
  MAX_LATENCY = 1000;

  chartFactory = new ChartFactory();
  chartNoDBEntry = null;
  chartDBSize = null;
  chartKVP = null;
  chartCRUD = null;
  chartPeers = null;
  charts = [];

  totalDbSize = 0;
  totalKvp = 0;
  numDbs = 0;
  crudCommits = 0;
  transactionLatency = 0;
  minTransactionLatency = 50;
  maxTransactionLatency = 0;
  endPeers = 0;
  avgLatency = 0;
  avgDBSize = 0;
  peersList = [];

  @ViewChild('doughnut') doughnut: ElementRef;
  @ViewChild('doughnutDB') doughnutDB: ElementRef;
  @ViewChild('doughnutKVP') doughnutKVP: ElementRef;
  @ViewChild('doughnutCRUD') doughnutCRUD: ElementRef;
  @ViewChild('doughnutPeers') doughnutPeers: ElementRef;

  @ViewChild('transactionLatencyChart') transactionLatencyChart: ElementRef;
  @ViewChild('transactionLatencyChartTop') transactionLatencyChartTop: ElementRef;
  @ViewChild('barChart') barChartElem: ElementRef;
  @ViewChild('barChartHorizontal') barChartHorizontal: ElementRef;



  constructor(private communicationService: CommunicationService) {
    communicationService.stateChange.subscribe((newState) => {
      this.renderUI(newState.state, newState.states);
      const randomStartNoDB = Math.floor(Math.random() * (50 - 0 + 1)) + 0;
      const randomEndNoDB = Math.floor(Math.random() * (130 - 90 + 1)) + 90;

      const randomStartDBSize =  Math.floor(Math.random() * (200 - 100 + 1)) + 100;
      const randomEndDBSize = 200;

      const randomStartCRUD =  Math.floor(Math.random() * (200 - 100 + 1)) + 100;
      const randomEndCRUD = 200;

      const percentageKVP = (newState.state.totalkvp - 800) / 2.0;

      this.chartFactory.renderDefaultDogChart(this.chartNoDBEntry, randomStartNoDB, randomEndNoDB);
      this.chartFactory.renderDefaultDogChart(this.chartDBSize, randomStartDBSize, randomEndDBSize);
      this.chartFactory.renderDefaultDogChart(this.chartCRUD, randomStartCRUD, randomEndCRUD);
      this.chartFactory.renderDefaultDogLineChart(this.chartKVP, percentageKVP);
      this.chartFactory.renderCharts(this.charts, newState.states);
    });
  }

  private fastUpate(timeout: number) {
      const startPeers = 0;
      this.endPeers += 1;
      if (this.endPeers > 100) {
        this.endPeers = 0;
      }
      this.chartFactory.renderDefaultDogLineChart(this.chartPeers, this.endPeers);
      setTimeout(this.fastUpate.bind(this), timeout);
  }

  ngOnInit() {
    const ctx = this.doughnut.nativeElement.getContext('2d');
    const noDBChart = this.chartFactory.getDoughnutChart(ctx);
    this.chartNoDBEntry = new ChartMapEntry('NoDBChart', noDBChart, (state) => state.totaldbsize);

    const ctxDBSize = this.doughnutDB.nativeElement.getContext('2d');
    const dbSizeChart = this.chartFactory.getDoughnutChart(ctxDBSize);
    this.chartDBSize = new ChartMapEntry('DBSizeChart', dbSizeChart, (state) => state.totaldbsize);

    const ctxKVP = this.doughnutKVP.nativeElement.getContext('2d');
    const KVPChart = this.chartFactory.getDoughnutChart(ctxKVP);
    this.chartKVP = new ChartMapEntry('chartKVP', KVPChart, (state) => state.totaldbsize);

    const ctxCRUD = this.doughnutCRUD.nativeElement.getContext('2d');
    const CRUDChart = this.chartFactory.getDoughnutChart(ctxCRUD);
    this.chartCRUD = new ChartMapEntry('chartCRUD', CRUDChart, (state) => state.totaldbsize);

    const ctxPeers = this.doughnutPeers.nativeElement.getContext('2d');
    const peersChart = this.chartFactory.getDoughnutChart(ctxPeers);
    this.chartPeers = new ChartMapEntry('chartCRUD', peersChart, (state) => state.totaldbsize);

    const ctxTransactionLatTop = this.transactionLatencyChartTop.nativeElement.getContext('2d');
    const chartTransactionLatTop = this.chartFactory.getDefaultLineChart(ctxTransactionLatTop);

    const ctxBarChart = this.barChartElem.nativeElement.getContext('2d');
    const chartBar  = this.chartFactory.getStackedBarChart(ctxBarChart);
    const barChart  = new ChartMapEntry('barChart', chartBar, (state) => state.transactionLatency);

    const ctxBarChartHorizontal = this.barChartHorizontal.nativeElement.getContext('2d');
    const chartBarHorizontal  = this.chartFactory.getStackedBarChart(ctxBarChartHorizontal);
    const barChartHorizontal  = new ChartMapEntry('barChart', chartBarHorizontal, (state) => state.transactionLatency);

    this.charts = [
      new ChartMapEntry('ChartTransactionLatencyTop', chartTransactionLatTop, (state) => state.transactionLatency),
      barChart,
      barChartHorizontal
    ];
    this.fastUpate(500);
  }

  renderUI(newState, states) {
    this.totalDbSize = newState.totaldbsize;
    this.totalKvp = newState.totalkvp;
    this.crudCommits = newState.crudcommits;
    this.numDbs = newState.numdbs;
    this.peersList = newState.peersList;
    this.transactionLatency = newState.transactionLatency;
    this.avgDBSize = Math.round(this.totalDbSize / this.numDbs);
    const v = R.sum(R.map((a) => a.transactionLatency, states));
    this.avgLatency = Math.round(v / states.length);
    const validated = this.validateLatency(newState.transactionLatency, this.MIN_LATENCY, this.MAX_LATENCY);
    if (newState.transactionLatency < this.minTransactionLatency && validated) {
      this.minTransactionLatency = newState.transactionLatency;
    }
    if (newState.transactionLatency > this.maxTransactionLatency && validated) {
      this.maxTransactionLatency = newState.transactionLatency;
    }
  }
  private validateLatency(latency, min, max) {
    return latency > min && latency < max;
  }
}
