<template>
        <div style="width:180px;height:180px;" class="parent">
            <strong class="guageTitles">{{times[title]}}<br/>(Inner {{validCats[cats[2][cats[2].length -1]]}}%/{{validCats[cats[1][cats[1].length -1]]}}%/{{validCats[cats[0][cats[0].length -1]]}}%)</strong>
            <highcharts 
            ref="guage"
            class="chart" 
            :options="chartOptionsGuage">
            </highcharts>
        </div>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    import HighchartsVue from "highcharts-vue";
    import Highcharts from "highcharts";
    import highchartsMoreInit from "highcharts/highcharts-more";
    import solidGaugeInit from "highcharts/modules/solid-gauge";

    highchartsMoreInit(Highcharts);
    solidGaugeInit(Highcharts);

    export default {
        props: ["points", "units", "title", "cats"],
        data() {
            return {
                colors: null,
                band1: 10,
                band2: 10,
                band3: 10,
                times: {
                10: '10 Minutes',
                30: '30 Minutes',
                60: '1 Hour',
                240: '4 Hours',
                480: '8 Hours',
                720: '12 Hours',
                1440: '24 Hours',
                10080: '7 Days', 
                20160: '14 Days',
                43200: '30 Days',
                },
                    validCats: {
                "1": 0.25,
                "2": 0.5,
                "3": 1,
                "4": 2.5,
                "5": 5,
                "6": 10,
                "7": 15,
                "8": 20,
                },
                chartOptionsGuage: {
                        credits: {
                            enabled: false
                            },
                    chart: {
                        backgroundColor: 'transparent',
                        type: 'solidgauge',
                        height: '90%',
                    },

                    exporting: {
                        enabled: false
                    },

                    title: false,
                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px'
                        },
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
                        positioner: function(labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 8
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [                           
                            { // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: '#0006',
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: '#0006',
                            borderWidth: 0
                        }, { // Track for Stand
                            outerRadius: '62%',
                            innerRadius: '38%',
                            backgroundColor: '#0006',
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                        stops: [
                            [0, '#142F35'], // dark blue
                            [0.1, '#113D4B'],
                            [0.2, '#0D5774'],
                            [0.3, '#07668B'],
                            [0.4, '#0180BD'],
                            [0.5, '#75B9DB'], // white/yellowish
                            [0.6, '#ECEFDC'],
                            [0.7, '#FBFA40'],
                            [0.8, '#FACB03'],
                            [0.9, '#F95A00'],
                            [1, '#82222D'], // red
                        ],
                    },

                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: false,
                                borderRadius: 5,
                                backgroundColor: 'rgba(252, 255, 197, 0.7)',
                                borderWidth: 1,
                                borderColor: '#AAA',
                                y: -6
                            }
                        },
                        solidgauge: {
                            innerRadius: "75%",
                            borderWidth: "100px"
                        }
                    },
                    stockTools: {
                        gui: {
                            className: 'highcharts-bindings-wrapper',
                            enabled: false,
                            toolbarClassName: 'stocktools-toolbar'
                        }
                    },
                    series: [{
                        name: '',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: 0
                        }]
                    }, {
                        name: '',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: 0
                        }]
                    }, {
                        name: '',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: 0
                        }]
                    }]
                }
            };
        },
        watch: {

        },
        methods: {

        },
        mounted() {
},
    }
</script>

<style lang="scss" scoped>
@import '../../assets/gui.css';

.guageTitles {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.884);
    display: inline-block;
}
.parent {
      text-align: center;
}
</style>