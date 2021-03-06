import Chart from 'chart.js';
import { COLORS } from '../../constants/colors';

export default (function () {
  // ------------------------------------------------------
  // @Line Charts
  // ------------------------------------------------------

  const lineChartBox = document.getElementById('line-chart');

  if (lineChartBox) {
    const lineCtx = lineChartBox.getContext('2d');
    lineChartBox.height = 140;

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['0338', '0339', '0340', '0341', '0342', '0343', '0344'],
        datasets: [ {
          label                : '1102',
          backgroundColor      : 'rgba(0, 128, 255, 0.5)',
          borderColor          : COLORS['blue-500'],
          pointBackgroundColor : COLORS['blue-700'],
          borderWidth          : 1,
          data                 : [17.5, 18, 17, 17.5, 18, 18, 17],
        }, {
          label                : '1103',
          backgroundColor      : 'rgba(0, 102, 204, 0.5)',
          borderColor          : COLORS['green-500'],
          pointBackgroundColor : COLORS['green-700'],
          borderWidth          : 1,
          data                 : [17,19,20,17.5,18,18,17.5],
        }, {
          label                : '1104',
          backgroundColor      : 'rgba(255, 51, 51, 0.5)',
          borderColor          : COLORS['red-500'],
          pointBackgroundColor : COLORS['red-700'],
          borderWidth          : 1,
          data                 : [17.5,17,18,17.5,17,17.5,17.5],
        }, {
          label                : '1105',
          backgroundColor      : 'rgba(255, 51, 51, 0.5)',
          borderColor          : COLORS['red-500'],
          pointBackgroundColor : COLORS['red-700'],
          borderWidth          : 1,
          data                 : [17,17.5,18,17.5,17.5,17.2,18.5],
        }, {
          label                : '1106',
          backgroundColor      : 'rgba(255, 51, 51, 0.5)',
          borderColor          : COLORS['red-500'],
          pointBackgroundColor : COLORS['red-700'],
          borderWidth          : 1,
          data                 : [16.5,19,18.1,17.9,17,17.2,18.5],
        }, {
          label                : '1107',
          backgroundColor      : 'rgba(255, 51, 51, 0.5)',
          borderColor          : COLORS['red-500'],
          pointBackgroundColor : COLORS['red-700'],
          borderWidth          : 1,
          data                 : [18.5,17.5,17.5,17,18,18.5,18.5],
        }],
      },

      options: {
        legend: {
          display: false,
        },
      },

      scales: {
                    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Drone ID'
                            }
                        }],
                    yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                                max: 200
                            }
                        }]
                }

    });
  }

  // ------------------------------------------------------
  // @Bar Charts
  // ------------------------------------------------------

  const barChartBox = document.getElementById('bar-chart');

  if (barChartBox) {
    const barCtx = barChartBox.getContext('2d');

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label           : 'Dataset 1',
          backgroundColor : COLORS['deep-purple-500'],
          borderColor     : COLORS['deep-purple-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }, {
          label           : 'Dataset 2',
          backgroundColor : COLORS['light-blue-500'],
          borderColor     : COLORS['light-blue-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }],
      },

      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
      },
    });
  }

  // ------------------------------------------------------
  // @Area Charts
  // ------------------------------------------------------

  const areaChartBox = document.getElementById('area-chart');

  if (areaChartBox) {
    const areaCtx = areaChartBox.getContext('2d');

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          backgroundColor : 'rgba(3, 169, 244, 0.5)',
          borderColor     : COLORS['light-blue-800'],
          data            : [10, 50, 20, 40, 60, 30, 70],
          label           : 'Dataset',
          fill            : 'start',
        }],
      },
    });
  }

  // ------------------------------------------------------
  // @Scatter Charts
  // ------------------------------------------------------

  const scatterChartBox = document.getElementById('scatter-chart');

  if (scatterChartBox) {
    const scatterCtx = scatterChartBox.getContext('2d');

    Chart.Scatter(scatterCtx, {
      data: {
        datasets: [{
          label           : 'My First dataset',
          borderColor     : COLORS['red-500'],
          backgroundColor : COLORS['red-500'],
          data: [
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 },
            { x: 70, y: 80 },
            { x: 90, y: 100 },
            { x: 110, y: 120 },
            { x: 130, y: 140 },
          ],
        }, {
          label           : 'My Second dataset',
          borderColor     : COLORS['green-500'],
          backgroundColor : COLORS['green-500'],
          data: [
            { x: 150, y: 160 },
            { x: 170, y: 180 },
            { x: 190, y: 200 },
            { x: 210, y: 220 },
            { x: 230, y: 240 },
            { x: 250, y: 260 },
            { x: 270, y: 280 },
          ],
        }],
      },
    });
  }
}())
