<template>
    <section>
<div id="grid">
  <div class="layer-position" >
 <grid-layout 
 :layout.sync="layout" 
 :col-num="12" 
 :col-width="12" 
 :row-height="30" 
 :is-draggable="true" 
 :is-resizable="resizable" 
 :is-mirrored="false" 
 :vertical-compact="false" 
 :margin="[10, 10]" 
 :use-css-transforms="true">
        <grid-item v-for="item in layout" ref="grid" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.id">
            <MDRGuageChart :title="guageInterval1" :cats="[guageCat1, guageCat2, guageCat3]" ref="guage1" class="bottom-guage-margin" v-if="item.i == '1'" v-show="widget_1 == true" />
            <MDRGuageChart :title="guageInterval2" :cats="[guageCat1, guageCat2, guageCat3]" ref="guage2" class="bottom-guage-margin" v-if="item.i == '2'" v-show="widget_2 == true" />
            <MDRGuageChart :title="guageInterval3" :cats="[guageCat1, guageCat2, guageCat3]" ref="guage3" class="bottom-guage-margin" v-if="item.i == '3'" v-show="widget_3 == true" />
            <LiquidationChart v-if="item.i == '0'"/>
            </grid-item> 
        </grid-layout>
  </div>
</div>
    </section>
</template>

<script>
    import VueGridLayout from 'vue-grid-layout'
    import LiquidationChart from '../components/LiquidationChart/LiquidationChart'
    import MDRGuageChart from '../components/MDRGuageChart/MDRGuageChart'
  import {
        mapState,
        mapActions
    } from 'vuex'
    import {
    VUEX_MDR_REQUEST,
    VUEX_MDRLIVE_REQUEST
    } from "@/store/constants/ui";
    import {
        VUEX_WIDGET_OPTION_1,
        VUEX_WIDGET_OPTION_2,
        VUEX_WIDGET_OPTION_3,
        VUEX_WIDGET_OPTION_4,
        VUEX_WIDGET_OPTION_5,
        VUEX_MDR_SWITCH,

    } from '@/store/constants/ui'
    
    var liquidationPageLayout = [
{ "x": 0, "y": 0, "w": 12, "h": 1, "i": "0", static: true },
        {
            "x": 0,
            "y": 5,
            "w": 1,
            "h": 3,
            "i": "1"
        },
        {
            "x": 4,
            "y": 5,
            "w": 1,
            "h": 3,
            "i": "2"
        },
        {
            "x": 8,
            "y": 5,
            "w": 1,
            "h": 3,
            "i": "3"
        }
    ]

    export default {
        name: 'liquidationlayoutPage',

        data() {
            return {
                layout: liquidationPageLayout,
                resizable: true,
            }
        },
        watch: {
            guageLiveWatch: function() {
                this.bandValues()
            },
        },
        methods: {
    ...mapActions({
        requestGuageMDR: VUEX_MDR_REQUEST,
        requestLiveMDR: VUEX_MDRLIVE_REQUEST
    }),
      calcValue(band, min, max) {
         let value = ((band - min) * 100) / (max - min)
         return Math.round(value)
        },
    
    bandValues() {
        //if (this.$refs.gauge1 != undefined) {
        if (true) {
            let int1 = this.guageInterval1
            let int2 = this.guageInterval2
            let int3 = this.guageInterval3
            let int4 = this.guageInterval4
            let int5 = this.guageInterval5
            let cat1 = this.guageCat1
            let cat2 = this.guageCat2
            let cat3 = this.guageCat3

            let band1 = this.calcValue(this.mdrDataLive[cat1], this.mdrDataInterval[int1][cat1].min, this.mdrDataInterval[int1][cat1].max)
            let band2 = this.calcValue(this.mdrDataLive[cat2], this.mdrDataInterval[int1][cat2].min, this.mdrDataInterval[int1][cat2].max)
            let band3 = this.calcValue(this.mdrDataLive[cat3], this.mdrDataInterval[int1][cat3].min, this.mdrDataInterval[int1][cat3].max)
            let band4 = this.calcValue(this.mdrDataLive[cat1], this.mdrDataInterval[int2][cat1].min, this.mdrDataInterval[int2][cat1].max)
            let band5 = this.calcValue(this.mdrDataLive[cat2], this.mdrDataInterval[int2][cat2].min, this.mdrDataInterval[int2][cat2].max)
            let band6 = this.calcValue(this.mdrDataLive[cat3], this.mdrDataInterval[int2][cat3].min, this.mdrDataInterval[int2][cat3].max)
            let band7 = this.calcValue(this.mdrDataLive[cat1], this.mdrDataInterval[int3][cat1].min, this.mdrDataInterval[int3][cat1].max)
            let band8 = this.calcValue(this.mdrDataLive[cat2], this.mdrDataInterval[int3][cat2].min, this.mdrDataInterval[int3][cat2].max)
            let band9 = this.calcValue(this.mdrDataLive[cat3], this.mdrDataInterval[int3][cat3].min, this.mdrDataInterval[int3][cat3].max)
            
            this.$refs.guage1[0].$refs.guage.options.series[0].data[0].y = band1
            this.$refs.guage1[0].$refs.guage.options.series[1].data[0].y = band2
            this.$refs.guage1[0].$refs.guage.options.series[2].data[0].y = band3
            this.$refs.guage2[0].$refs.guage.options.series[0].data[0].y = band4
            this.$refs.guage2[0].$refs.guage.options.series[1].data[0].y = band5
            this.$refs.guage2[0].$refs.guage.options.series[2].data[0].y = band6
            this.$refs.guage3[0].$refs.guage.options.series[0].data[0].y = band7
            this.$refs.guage3[0].$refs.guage.options.series[1].data[0].y = band8
            this.$refs.guage3[0].$refs.guage.options.series[2].data[0].y = band9
            }

        }
        },
        computed: {
     ...mapState({
                guageIntervalWatch: state => state.ui.guageIntervalWatch,
                guageLiveWatch: state => state.ui.guageLiveWatch,
                mdr_switch_value: state => state.ui.mdr_guage_switch,

                widget_1: state => state.ui.widget_switch_1,
                widget_2: state => state.ui.widget_switch_2,
                widget_3: state => state.ui.widget_switch_3,
                widget_4: state => state.ui.widget_switch_4,
                widget_5: state => state.ui.widget_switch_5,

                mdrDataLive: state => state.ui.mdrLive,
                mdrDataInterval: state => state.ui.mdrInterval,
                guageInterval1: state => state.ui.guageInterval1,
                guageInterval2: state => state.ui.guageInterval2,
                guageInterval3: state => state.ui.guageInterval3,
                guageInterval4: state => state.ui.guageInterval4,
                guageInterval5: state => state.ui.guageInterval5,
                guageCat1: state => state.ui.guageCat1,
                guageCat2: state => state.ui.guageCat2,
                guageCat3: state => state.ui.guageCat3,
            }),
        },
        mounted() {
            this.requestGuageMDR()
            let that = this
            setInterval(function() {
            that.requestLiveMDR()
            }, 5000)
            setInterval(function() {
            that.requestGuageMDR()
            }, 10*60*1000)
        },
        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            LiquidationChart,
            MDRGuageChart,
        },
    }
</script>

<style>
  html {
       overflow-y: hidden;
    }

.layer-position {
    background-color:rgba(29, 29, 31, 0.493);
    position: relative;
    top: -1vh;
    height:130vh;
    }
#grid {
  display: grid;
  grid-template-columns: 1fr;
  height: auto;
}
#grid > div {
  padding: 0px;
}
</style>