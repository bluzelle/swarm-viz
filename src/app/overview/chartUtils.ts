import { Chart } from 'chart.js';

export class ChartUtils {
    constructor() {

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
