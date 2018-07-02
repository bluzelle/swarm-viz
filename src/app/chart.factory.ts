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
      const colorsBack = states.map((a) => 'rgba(255, 255, 255,0.0)');
      colorsBack[colorsBack.length - 1] = 'rgba(255, 255, 255,1.0)';
      const colorsBorder = states.map((a) => 'rgba(255, 255, 255,0.0)');
      colorsBorder[colorsBorder.length - 1] = 'rgba(255, 255, 255,0.5)';
      chartLine.data.labels = labels;
      chartLine.data.datasets[0].data  = values;
      chartLine.data.datasets[0].pointBackgroundColor = colorsBack;
      chartLine.data.datasets[0].pointBorderColor = colorsBorder;
      chartLine.update();
    }

    renderDefaultDogLineChart(chartEntry: ChartMapEntry, percentage) {
      const values = [percentage,  100 - percentage];
      const colors = ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.2)'];
      chartEntry.chart.data.datasets[0].data = values;
      chartEntry.chart.data.datasets[0].backgroundColor = colors;
      chartEntry.chart.update();
    }

    renderDefaultDogChart(chartEntry: ChartMapEntry, rangeStart: number, rangeEnd: number) {
      const values = R.range(0, 200).map((a) => a % 2 === 0 ? 1 : 2);
      const colors = R.range(0, 200).map((a) => {
        if (a > rangeStart && a < rangeEnd) {
          return 'rgba(255,255,255,0.0)';
        } else {
          return a % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.0)';
        }
      });
      chartEntry.chart.data.datasets[0].data = values;
      chartEntry.chart.data.datasets[0].backgroundColor = colors;
      chartEntry.chart.update();
    }

    getStackedBarChart(ctx) {
      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
              label: 'My First dataset',
              backgroundColor: 'rgb(255, 255, 255)',
              borderColor: 'rgba(255, 255, 255,0.0)',
              data: []
          }, {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255, 255, 255,0.5)',
            borderColor: 'rgba(255, 255, 255,0.0)',
            data: R.range(0, 20).map ( (a) => Math.floor(Math.random() * (20 - 5 + 1)) + 5 )
        }]
        },
        options: {
          title: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 20
            }
          },
          responsive: true,
          legend: {display: false},
          scales: {
            xAxes: [{
              stacked: true,
              display: false
            }],
            yAxes: [{
              stacked: true,
              display: false
            }]
          }
        }
      });
    }

    getVerticalBarChart(ctx) {
      return new Chart(ctx, {
        type: 'horizontalBar',
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
          }]
        },
        options: {
          title: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          responsive: true,
          legend: {display: false},
          scales: {
            xAxes: [{
              stacked: true,
              display: false
            }],
            yAxes: [{
              stacked: true,
              display: false
            }]
          }
        }
      });
    }

    getDoughnutLineChart(ctx) {
      return new Chart(ctx, {
          // The type of chart we want to create
          type: 'doughnut',
          data: {
              labels: [],
              datasets: [{
                  label: 'My First dataset',
                  backgroundColor: 'rgb(255, 255, 255)',
                  borderColor: 'rgba(255, 255, 255,0.0)',
                  data: []
              }]
          },
          options: {
            cutoutPercentage: 99,
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
    getDoughnutChart(ctx) {
      return new Chart(ctx, {
          // The type of chart we want to create
          type: 'doughnut',
          data: {
              labels: [],
              datasets: [{
                  label: 'My First dataset',
                  backgroundColor: 'rgb(255, 255, 255)',
                  borderColor: 'rgba(255, 255, 255,0.0)',
                  data: []
              }]
          },
          options: {
            cutoutPercentage: 90,
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
                    pointBorderWidth: 2,
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
