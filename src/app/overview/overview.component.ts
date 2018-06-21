import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

import { ChartUtils } from './chartUtils';
import * as bluzelle from 'bluzelle';
import * as R from 'ramda';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  chartUtils = new ChartUtils();
  totalDbSize = 0;
  totalKvp = 0;
  numDbs = 0;
  crudCommits = 0;
  peersList = [];

  @ViewChild('dbSizeChart') dbSizeChartElement: ElementRef;
  @ViewChild('totalKvpChart') totalKvpChartElement: ElementRef;
  constructor() {

  }

  ngOnInit() {
    const TIMEOUT = 100;
    const NUMBER_ENTRIES_CACHE = 15;


    const ctxDbSize = this.dbSizeChartElement.nativeElement.getContext('2d');
    const chartDBSize = this.chartUtils.getDefaultLineChart(ctxDbSize);

    const ctxTotalKvp = this.totalKvpChartElement.nativeElement.getContext('2d');
    const chartTotalKvp = this.chartUtils.getDefaultLineChart(ctxTotalKvp);


    const charts: Array<ChartMapEntry> = [
      new ChartMapEntry('ChartDBSize', chartDBSize, (state) => state.totaldbsize),
      new ChartMapEntry('ChartTotalKvp', chartTotalKvp, (state) => state.totalkvp),
    ];

    bluzelle.connect('ws://127.0.0.1:8100', '');

    const initialStates = R.map((a) => {
      return {};
    }, R.range(0, NUMBER_ENTRIES_CACHE));
    this.update(initialStates, charts, TIMEOUT);
  }

  update(states, charts, timeout) {
    const stateHandling = (state) => {
      const renderCharts = R.curry(this.renderCharts)(charts).bind(this);
      const processPipe = R.pipe(this.updateStates, renderCharts);
      this.renderUI(state);
      this.update(processPipe(states, state), charts, timeout);
    };
    setTimeout(() => { bluzelle.state().then(stateHandling); }, timeout);
  }

  renderUI(newState) {
    this.totalDbSize = newState.totaldbsize;
    this.totalKvp = newState.totalkvp;
    this.crudCommits = newState.crudcommits;
    this.numDbs = newState.numdbs;
    this.peersList = newState.peersList;
  }

  updateStates(states, newState): Array<any> {
    const [head, ...tail] =  R.append(newState, states);
    return tail;
  }


  renderCharts(charts: Array<ChartMapEntry>, states: Array<any>): Array<any> {
    R.forEach((entry) => this.renderChart(entry, states), charts);
    return states;
  }

  renderChart(chartEntry: ChartMapEntry, states: Array<any>) {
    const chartLine = chartEntry.chart;
    const labels = states.map((a) => '');
    const values = states.map(chartEntry.extractor);
    chartLine.data.labels = labels;
    chartLine.data.datasets[0].data  = values;
    chartLine.update();
  }




}
export class ChartMapEntry {
  key: String;
  chart: any;
  extractor: any;
  constructor(key: String, chart: any, extractor: Function) {
    this.key = key;
    this.chart = chart;
    this.extractor = extractor;
  }
}
