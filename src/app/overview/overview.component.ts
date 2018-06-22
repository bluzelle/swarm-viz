import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommunicationService } from '../communication.service';

import { ChartFactory,  ChartMapEntry } from './chart.factory';
import { StateUtils } from './stateUtils';

import * as bluzelle from 'bluzelle';
import * as R from 'ramda';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  TIMEOUT = 1000;
  NUMBER_ENTRIES_CACHE = 15;

  chartFactory = new ChartFactory();
  stateUtils = new StateUtils();
  totalDbSize = 0;
  totalKvp = 0;
  numDbs = 0;
  crudCommits = 0;
  transactionLatency = 0;
  peersList = [];

  @ViewChild('overviewContainer') overviewContainer: ElementRef;
  @ViewChild('dbSizeChart') dbSizeChartElement: ElementRef;
  @ViewChild('totalKvpChart') totalKvpChartElement: ElementRef;
  @ViewChild('transactionLatencyChart') transactionLatencyChart: ElementRef;



  constructor(private communicationService: CommunicationService) {
    communicationService.change.subscribe(rotation => {
      this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.overviewContainer, {start: 0.2, end: 2.0});
      // this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.overviewContainer, {start: 0.8, end: 1.2});
      // this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.overviewContainer, {start: 0.3, end: 0.4});
    });
  }

  ngOnInit() {

    this.overviewContainer.nativeElement.style.top = '160px';
    this.overviewContainer.nativeElement.style.left = '100px';
    this.overviewContainer.nativeElement.style.width = '700px';
    this.overviewContainer.nativeElement.style.height = '300px';
    this.overviewContainer.nativeElement.style.opacity = '1.0';
    this.overviewContainer.nativeElement.style.transform = 'scale(0.0)';


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

    bluzelle.connect('ws://127.0.0.1:8100', '');

    const initialStates = R.map((a) => {
      return {};
    }, R.range(0, this.NUMBER_ENTRIES_CACHE));

    this.update(initialStates, charts, this.TIMEOUT);
  }

  update(states, charts, timeout) {
    const timeNow = Date.now();
    const stateHandling = (state) => {
      state.transactionLatency = Date.now() - timeNow;
      const renderCharts = R.curry(this.chartFactory.renderCharts)(charts).bind(this.chartFactory);
      const processPipe = R.pipe(this.stateUtils.updateStates, renderCharts);
      this.renderUI(state);
      this.update(processPipe(states, state), charts, timeout);
    };
    setTimeout(() => { bluzelle.state().then(stateHandling.bind(this)); }, timeout);
  }

  renderUI(newState) {
    this.totalDbSize = newState.totaldbsize;
    this.totalKvp = newState.totalkvp;
    this.crudCommits = newState.crudcommits;
    this.numDbs = newState.numdbs;
    this.peersList = newState.peersList;
    this.transactionLatency = newState.transactionLatency;
  }

  renderSatelliteEffect(rotation, rotationNew, container: ElementRef, area) {
    const delta = 0.3;
    const start = area.start - delta;
    const end = area.end + delta;

    let factor = 0;
    if (rotation.y > start && rotation.y < area.start) {
      factor = rotationNew.y - area.start;
    }
    if (rotation.y > area.end && rotation.y < end) {
      factor = (delta - (end - rotationNew.y)) * -1;
    }
    factor = Math.round(factor * 10000) / 10000;


    if (factor !== 0) {
      const posX = (factor *  -3000);
      container.nativeElement.style.left =  '' + posX + 'px';

      /*let opacity = factor === 0 ? 0 : 0.1 / (factor * - 20);
      if (opacity < 0.1) {
        opacity = 0;
      }
      container.nativeElement.style.opacity = '' +  opacity;*/

      let scale = Math.abs(0.1 / (factor * - 25));
      if (scale > 1.0) {
        scale = 1.0;
      }
      container.nativeElement.style.transform = 'scale(' + scale + ')';
    }


    /*const width = +container.nativeElement.style.width.replace('px', '');
    const newWidth = width + ((factor / 2) * - 1);
    container.nativeElement.style.width =  '' + newWidth + 'px';

    const height = +container.nativeElement.style.height.replace('px', '');
    const newHeight = height + ((factor / 2) * - 1);
    container.nativeElement.style.height =  '' + newHeight + 'px';*/

    /*const top = +container.nativeElement.style.top.replace('px', '');
    const posY = top  + 0.0;
    container.nativeElement.style.top =  '' + posY + 'px';*/
  }
}



