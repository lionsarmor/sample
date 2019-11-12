<template>
  <highcharts
    ref="chart"
    :constructor-type="'stockChart'"
    :options="chartOptions"
    :updateArgs="updateArgs"
  ></highcharts>
</template>

<script>
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
import mapInit from "highcharts/modules/map";
import dragTools from "highcharts/modules/drag-panes";
import annotations from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import indicators from "highcharts/indicators/indicators";
import allIndicators from "highcharts/indicators/indicators-all";
import stockTools from "highcharts/modules/stock-tools";

import {
  VUEX_GET_REQUEST_OHLC,
  VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS,
  VUEX_GET_USER_SETTINGS,
  VUEX_GET_LIQUIDATION_BUBBLES,
  VUEX_LEVERAGES_LONG,
  VUEX_LEVERAGES_SHORT,
  VUEX_UPDATE_MAGIC_LINES,
  VUEX_UPDATE_FROM_LOCAL_STORAGE
} from "../../store/constants/bitmex";
import { mapState, mapActions } from "vuex";



export default {
  data() {
    return {
      chart: null,
      updateArgs: [true, true, { duration: 1000 }],
      pointStartSet: false,
      initialSet: false,
      prevUpdateTime: 0,
      chartOptions: {
        series: [
          {
            type: "candlestick",
            data: [],
            xAxis: 0,
            dataGrouping: {
              enabled: false
            },
            tooltip: {
              pointFormat: ''
            }
          },
          {
            type: "bubble",
            plotBorderWidth: 1,
            xAxis: 0,
            data: [],
            maxSize:'10%',
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat:
                            '<tr><th>Price: </th><td>{point.y}</td></tr><br>' +
                            '<tr><th>Volume: </th><td>{point.z}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            }
          },
        ],
        mapNavigation: {
            enabled: true,
            enableButtons: false
         },
        chart: {
          height: window.innerHeight - 64,
          width: window.innerWidth,
          zoomType: "xy",
          animation: false,
          panning: true,
          panKey: "ctrl",
          zoomKey: "alt",
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [[0, "#000000"], [1, "#333533"]]
          },
          resetZoomButton: {
            position: {
              align: "left",
              x: 10,
              y: 10
            }
          }
        },
        scrollbar: {
          enabled: false
        },
        rangeSelector: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: true
        },
        plotOptions: {
          candlestick: {
            color: "#cc0000",
            upColor: "#00cc66",
            lineColor: "#cc0000",
            upLineColor: "#00cc66", // docs
            states: {
                inactive: {
                  opacity: 1
              }
            }
          },
          spline: {
              states: {
                inactive: {
                  opacity: 1
              }
            }
          },
          bubble: {
            tooltip: {
              enabled: true
            },
            color: "#33ccff"
          }
        },
        xAxis: [
          {
            crosshair: {
              snap: true,
              label: {
                enabled: false
              }
            },
            overscroll: 60000 * 20
          }],
        yAxis: [
          {
            gridLineColor: "grey",
            lineColor: "grey",
            gridLineWidth: ".5px",
            minorGridLineColor: "transparent",
            visible: true,
            crosshair: {
              snap: false,
              label: {
                enabled: true,
                format: "{value:.2f}"
              }
            }
          }
        ]
      }
    };
  },

  computed: {
    ...mapState({
      ohlc: state => state.bitmex.ohlc,
      simpleAveragePoints: state => state.bitmex.simpleAveragePoints,
      liquidationBubbles: state => state.bitmex.liquidationBubbles,
      forceKeyRender: state => state.bitmex.ForceRenderChart,
      updateLineCharts: state => state.bitmex.updateLineCharts,
      clearAllSeries: state => state.bitmex.clearAllSeries,
      toggleCrosshair: state=> state.bitmex.crosshair,
      updatedMagicLines: state => state.bitmex.updateMagicLines,
      magiclinecolorscheme: state => state.bitmex.magiclinecolorscheme,
    })
  },

  watch : {
    toggleCrosshair: function() {
      this.crosshair()
    },
    clearAllSeries: function() {
      this.clearSeries()
    },
    forceKeyRender: function() {
      this.processNewLines()
    },
    updatedMagicLines: function() {
      this.updateEachMagicLine()
      this.getLiquidationBubbles()
    }, 
    liquidationBubbles: function() {
      this.setBubbles()
    }
  },
  methods: {
    ...mapActions({
      setBitmexData: VUEX_GET_REQUEST_OHLC,
      applyLiquidationOptions: VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS,
      getUserSettingsAndLiquidations: VUEX_GET_USER_SETTINGS,
      getLiquidationBubbles: VUEX_GET_LIQUIDATION_BUBBLES,
      getNewMagicPoints: VUEX_UPDATE_MAGIC_LINES,
      updateFromStorage: VUEX_UPDATE_FROM_LOCAL_STORAGE,
    }),
    crosshair(){
      if ('crosshair' in this.$refs.chart.chart.xAxis[0]) {
        delete this.$refs.chart.chart.xAxis[0]['crosshair']
        delete this.$refs.chart.chart.yAxis[0]['crosshair']
      } else {
        this.$refs.chart.chart.xAxis[0]['crosshair'] ={
              snap: true,
              label: {
                enabled: false
              }
           }
        this.$refs.chart.chart.yAxis[0]['crosshair'] = {
              snap: false,
              label: {
                enabled: true,
                format: "{value:.2f}"
              }
            }
      }
    },
    resize() {
      let toolBarCompensate =
        screen.width == document.body.clientWidth ? 0 : 64;

      this.$refs.chart.chart.update({
        chart: {
          height: window.innerHeight - toolBarCompensate,
          width: window.innerWidth
        }
      });
    },
    clearSeries() {
        let seriesL = this.$refs.chart.chart.series.length
        for (let i=2; i<seriesL; i++){
          this.$refs.chart.chart.series[this.$refs.chart.chart.series.length-1].remove(true)
        }
        this.$refs.chart.chart.series.length = 2
        return
    },

    setBubbles: async function() {
      this.$refs.chart.chart.series[1].setData(this.liquidationBubbles)
    },
    updateCandles: async function() {
      let data = JSON.parse(JSON.stringify(this.ohlc))
      if (this.prevUpdateTime == 0 && data.length > 0) {
              this.prevUpdateTime = data[data.length-1][0]
      }
      if (this.prevUpdateTime != data[data.length-1][0]) {
      let xExtremes = this.$refs.chart.chart.xAxis[0].getExtremes()
      let yExtremes = this.$refs.chart.chart.yAxis[0].getExtremes()
      this.$refs.chart.chart.series[0].setData(data);
      this.$refs.chart.chart.xAxis[0].setExtremes(xExtremes.min, xExtremes.max, false, false)
      this.$refs.chart.chart.yAxis[0].setExtremes(yExtremes.min, yExtremes.max, false, false)
      this.prevUpdateTime = data[data.length-1][0]
      } else {
        this.$refs.chart.chart.series[0].setData(data);
      }

    },
    updateEachMagicLine() {
      let that = this
      that.$refs.chart.chart.series.forEach(series => {
        that.simpleAveragePoints.forEach(lines => {
          if (lines.seriesname == series.name) {
            let magicLine = []
            lines.averages.forEach(avg => {
            magicLine.push({y: avg.average, x: avg.updated, dataLabels: { enabled: false, x: 100, y:-5, color: lines.color, textOutline: "0px",  style: {  textOutline: "0px", fontSize: '16px', fontWeight: "normal" }}})
          })
          magicLine[magicLine.length-1].dataLabels.enabled = true
          magicLine[magicLine.length-1].dataLabels.formatter = function() {return this.y.toFixed(2) + " " + lines.seriesname}
          series.setData(magicLine)
          }
        })
      })
    },
    processNewLines() {
      let that = this

      // REMOVE SERIES IF SIMPLEAVERAGESPOINTS IS EMPTY
      if (this.simpleAveragePoints.length == 0) {
        this.clearSeries()
        return
      }
      this.$refs.chart.chart.series.length = 2
      this.simpleAveragePoints.forEach(averageSeries => {
        let lineWidth = (averageSeries.ml == true) ? 3 : 1
        try {
          that.$refs.chart.chart.addSeries({
            type: "spline",
            name: averageSeries.seriesname,
            data: [],
            xAxis: 0,
            color: averageSeries.color,
            lineWidth: lineWidth,
            turboThreshold: 0,
            opacity: 1,
            dataGrouping: {
              enabled: false
            },
            tooltip: {
              pointFormat: ''
            }
          })
          let magicLine = []
          averageSeries.averages.forEach(avg => {
            magicLine.push({y: avg.average, x: avg.updated, dataLabels: { enabled: false, x: 100, y:-5, color: averageSeries.color, textOutline: "0px",  style: {  textOutline: "0px", fontSize: '16px', fontWeight: "normal" }}})
          })
          magicLine[magicLine.length-1].dataLabels.enabled = true
          magicLine[magicLine.length-1].dataLabels.formatter = function() {return this.y.toFixed(2) + " " + averageSeries.seriesname}
          that.$refs.chart.chart.series[that.$refs.chart.chart.series.length-1].setData(magicLine)
        } catch (err) {
          console.log(err)
        }

      })
    }
  },
  mounted() {
    window.onresize = this.resize;
    this.updateFromStorage()
    this.setBitmexData();
    this.getLiquidationBubbles()
    let that = this;
    setInterval(function() {
      that.getNewMagicPoints()
    }, 30000)
    setInterval(function() {
      that.updateCandles()
    }, 1000);
  }
};
</script>

<style lang="scss">
@import "../../assets/gui.css";

@import "../../assets/popup.css";

.datalabels-ml {
  color: "red"
}
</style>
