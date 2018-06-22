import { Chart } from 'chart.js';

import * as R from 'ramda';

export class ChartFactory {
    constructor() {
    }

    generateCharts() {

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

      getDefaultLineChart(ctx) {
          return new Chart(ctx, {
              // The type of chart we want to create
              type: 'line',
              data: {
                  labels: [],
                  datasets: [{
                      label: 'My First dataset',
                      backgroundColor: 'rgb(255, 255, 255)',
                      borderColor: 'rgb(255, 255, 255)',
                      data: [],
                      fill: false,
                      pointBackgroundColor: 'rgba(255, 255, 255,0.0)',
                      pointBorderColor: 'rgba(255, 255, 255,0.0)',
                      lineTension: .5
                  }]
              },
              options: {
                tooltips: {
                  enabled: false
                },
                layout: {
                  padding: {
                      left: 20,
                      right: 20,
                      top: 20,
                      bottom: 20
                  }
                },
                legend: {display: false},
                scales: {
                  gridLines: {
                    display: false
                  },
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    display: false
                  }]
                }
              }
            });
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
