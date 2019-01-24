import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CommunicationService } from '../communication.service';
import { ChartFactory,  ChartMapEntry } from '../../app/chart.factory';


@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {
  MIN_LATENCY = 40;
  MAX_LATENCY = 1000;

  private chartFactory = new ChartFactory();

  @ViewChild('performanceGraph') transactionLatencyChart: ElementRef;
  private charts = [];

  constructor(private communicationService: CommunicationService) {
    communicationService.stateChange.subscribe((newState) => {
      this.chartFactory.renderCharts(this.charts, newState.states);
    });
  }

  ngOnInit() {
    const ctxTransactionLatTop = this.transactionLatencyChart.nativeElement.getContext('2d');
    const chartTransactionLatTop = this.chartFactory.getDefaultLineChart(ctxTransactionLatTop);
    this.charts = [new ChartMapEntry('NoDBChart', chartTransactionLatTop, (state) => state.totaldbsize)];
  }


}
