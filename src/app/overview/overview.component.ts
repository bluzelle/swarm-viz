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

  TIMEOUT = 100;
  NUMBER_ENTRIES_CACHE = 15;

  chartFactory = new ChartFactory();
  stateUtils = new StateUtils();
  totalDbSize = 0;
  totalKvp = 0;
  numDbs = 0;
  crudCommits = 0;
  peersList = [];

  @ViewChild('overviewContainer') overviewContainer: ElementRef;
  @ViewChild('dbSizeChart') dbSizeChartElement: ElementRef;
  @ViewChild('totalKvpChart') totalKvpChartElement: ElementRef;


  constructor(private communicationService: CommunicationService) {
    communicationService.change.subscribe(rotation => {
      this.renderSatelliteEffect(rotation.newRotation, rotation.rotation, this.overviewContainer, {start: 0.3, end: 0.8});
    });
  }

  ngOnInit() {

    this.overviewContainer.nativeElement.style.top = '160px';
    this.overviewContainer.nativeElement.style.left = '100px';
    this.overviewContainer.nativeElement.style.width = '700px';
    this.overviewContainer.nativeElement.style.height = '300px';
    this.overviewContainer.nativeElement.style.opacity = '0.0';


    const ctxDbSize = this.dbSizeChartElement.nativeElement.getContext('2d');
    const chartDBSize = this.chartFactory.getDefaultLineChart(ctxDbSize);

    const ctxTotalKvp = this.totalKvpChartElement.nativeElement.getContext('2d');
    const chartTotalKvp = this.chartFactory.getDefaultLineChart(ctxTotalKvp);


    const charts: Array<ChartMapEntry> = [
      new ChartMapEntry('ChartDBSize', chartDBSize, (state) => state.totaldbsize),
      new ChartMapEntry('ChartTotalKvp', chartTotalKvp, (state) => state.totalkvp),
    ];

    bluzelle.connect('ws://127.0.0.1:8100', '');

    const initialStates = R.map((a) => {
      return {};
    }, R.range(0, this.NUMBER_ENTRIES_CACHE));

    this.update(initialStates, charts, this.TIMEOUT);
  }

  update(states, charts, timeout) {
    const stateHandling = (state) => {
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
  }

  renderSatelliteEffect(rotation, rotationNew, container: ElementRef, area) {
    const rotYDelta = (rotationNew.y - rotation.y);
    const delta = 0.3;
    let factor = 0;
    if (rotation.y > (area.start - delta)) {
      factor = 1;
    }
    if (rotation.y < (area.end + delta)) {
      factor = -1;
    }
    console.log(rotation.y);
    const rotY =  rotYDelta * factor;




    const left = +container.nativeElement.style.left.replace('px', '');
    const posX = left + (rotY * -100);
    container.nativeElement.style.left =  '' + posX + 'px';


     const op = +container.nativeElement.style.opacity;
     const opacity = op + (rotY * 10);
     container.nativeElement.style.opacity = '' +  opacity;

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



