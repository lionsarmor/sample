<template>
<section>
<br />
    <v-card flat color="#161715">
        <v-subheader class="title-mdr">MDR Options</v-subheader>
        <v-list>
            <v-list-group :value="false">
                <template v-slot:activator>
                    <v-subheader>Bands:</v-subheader>
                </template>
<v-card-text>
      <v-slider
        v-model="c1"
        step="1"
        min="1"
        max="8"
        hide-details
        >
        <template v-slot:append>
          <strong class="nowrap">{{catsDisplays[validCats[c1]]}}</strong>
        </template>
        </v-slider>
    </v-card-text>

<v-card-text>
      <v-slider
        v-model="c2"
        step="1"
        min="1"
        max="8"
        hide-details
        >
        <template v-slot:append>

          {{catsDisplays[validCats[c2]]}}
        </template>
        </v-slider>
    </v-card-text>

                <v-card-text>
      <v-slider
        v-model="c3"
        step="1"
        min="1"
        max="8"
        hide-details
        >
        <template v-slot:append>
          {{catsDisplays[validCats[c3]]}}
        </template>
        </v-slider>
    </v-card-text>

            </v-list-group>
        </v-list>

        <v-list>
            <v-list-group :value="false">
                <template v-slot:activator>
                    <v-subheader>Guages:</v-subheader>
                </template>
<v-card-text>
      <v-slider
        v-model="g1"
        step="1"
        min="1"
        max="10"
        hide-details
        >
        <template v-slot:append>
        <strong class="nowrap">
          {{times[validIntervals[g1]]}}
        </strong>
        </template>
        </v-slider>
    </v-card-text>

<v-card-text>
      <v-slider
        v-model="g2"
        step="1"
        min="1"
        max="10"
        hide-details
        >
        <template v-slot:append>
        <strong class="nowrap">
          {{times[validIntervals[g2]]}}
        </strong>  
        </template>
        </v-slider>
    </v-card-text>

    <v-card-text>
      <v-slider
        v-model="g3"
        step="1"
        min="1"
        max="10"
        hide-details
        >
        <template v-slot:append>
        <strong class="nowrap">
          {{times[validIntervals[g3]]}}
        </strong>
        </template>
        </v-slider>
                </v-card-text>
            </v-list-group>
        </v-list>
        <v-card color="#161715" dark>
            <v-card-actions>
                <v-btn text @click="updateMDROptions()">Apply</v-btn>
            </v-card-actions>
        </v-card>
    </v-card>
</section>
</template>
<script>
import {mapState, mapActions} from 'vuex'
    import {
    VUEX_PAGE_NAME,
    VUEX_MDR_SWITCH,
    VUEX_WIDGET_OPTION_1,
    VUEX_WIDGET_OPTION_2,
    VUEX_WIDGET_OPTION_3,
    VUEX_BAND_1,
    VUEX_BAND_2,
    VUEX_BAND_3,
    VUEX_CAT_1,
    VUEX_CAT_2,
    VUEX_CAT_3,
    VUEX_GUAGE_2,
    VUEX_GUAGE_3,
    VUEX_GUAGE_1,
    VUEX_MDR_REQUEST,
    VUEX_SET_APPLY_MDR_OPTIONS
    
    } from '@/store/constants/ui'

    export default {
        name: 'liquidationOptions',
        data() {
            return {
value: null,

validIntervals: {
      "1": 10,
      "2": 30,
      "3": 60,
      "4": 240,
      "5": 480,
      "6": 720,
      "7": 1440,
      "8": 10080,
      "9": 20160,
      "10": 43200,
    },
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
    catsDisplays: {
      0.25: '0.25%',
      0.5: '0.5%',
      1: '1%',
      2.5: '2.5%',
      5: '5%',
      10: '10%',
      15: '15%',
      20: '20%',
    },
}
        },
        methods: {
            ...mapActions({
                mdr_widget_switch: VUEX_MDR_SWITCH,
                setG2: VUEX_GUAGE_2,
                setG3: VUEX_GUAGE_3,
                setG1: VUEX_GUAGE_1,
                setC2: VUEX_CAT_2,
                setC3: VUEX_CAT_3,
                setC1: VUEX_CAT_1,
                applyMDROptions: VUEX_SET_APPLY_MDR_OPTIONS,
            }),
            switch_mdr(val) {
                this.mdr_widget_switch(val)
            },
            updateMDROptions(){
            this.applyMDROptions({userClick: true})
            }
        },

        computed: {
            ...mapState({
                mdr_switch_value: state => state.ui.mdr_guage_switch,
                guageMDR2: state => state.ui.guage_2,
                guageMDR3: state => state.ui.guage_3,
                guageMDR1: state => state.ui.guage_1,
                catMDR2: state => state.ui.cat_2,
                catMDR3: state => state.ui.cat_3,
                catMDR1: state => state.ui.cat_1,

            }),
c1: {
    get(){
      return this.catMDR1
    },
    set(value){
      this.setC1(value)
    }
  },
  c2: {
    get(){
      return this.catMDR2
    },
    set(value){
      this.setC2(value)
    }
  },
  c3: {
    get(){
      return this.catMDR3
    },  
    set(value){
      this.setC3(value)
    }
  },
  g2: {
 get(){
      return this.guageMDR2
    },
    set(value){
      this.setG2(value)
    }
  },
  g3: {
    get(){
      return this.guageMDR3
    },
    set(value){
      this.setG3(value)
    }
  },
    g1: {
    get(){
      return this.guageMDR1
    },
    set(value){
      this.setG1(value)
    }
  },
        },
        mounted() {

        },
        components: {
        },
    }
</script>

<style lang="scss" scoped>
    .cross-space {
        margin-top: -20px;
    }

    .title-mdr {
        font-size: 20px;
    }

    .button-title {
        position: relative;
        top: 7px;
    }
    .nowrap {
      white-space: nowrap;
    }
</style>