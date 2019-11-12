<template>
 <v-card
    flat
    color="#161715"
    dark
      >
    <v-list>
<v-list-group  :value="false">
<template v-slot:activator>
<v-subheader>Time:</v-subheader>
</template>
     <v-card-text>
      <v-slider
         v-model="ti"
         class="align-center"
          step="1"
          min="1"
          max="13"
          hide-details
        >
         <template v-slot:append>
          {{timeValue[ti]}}
            </template>
        </v-slider>
    </v-card-text>
</v-list-group>
</v-list>
  <v-list>
<v-list-group  :value="false">
<template v-slot:activator>
    <v-subheader>Liquidation Volume:</v-subheader>
</template>
     <v-card-text>
      <v-slider
        v-model="lv"
        step="1"
         min="1"
          max="13"
        hide-details
     >
  <template v-slot:append>
          {{volumeValue[lv]}}
        </template>
     </v-slider>
    </v-card-text>
</v-list-group>
</v-list>



<v-list>
<v-list-group  :value="false">
<template v-slot:activator>
<v-subheader>Upper Zones</v-subheader>
</template>
    <v-card-text>
      <v-slider
        v-model="u1"
        step="1"
        hide-details
        >
        <template v-slot:append>
                    {{u1}}
        </template>
        </v-slider>
    </v-card-text>

<v-card-text>
      <v-slider
        v-model="u2"
        step="1"
        hide-details
        >
        <template v-slot:append>
          {{u2}}
        </template>
        </v-slider>
    </v-card-text>


<v-card-text>
      <v-slider
        v-model="u3"
        step="1"
        hide-details
        >
        <template v-slot:append>
          {{u3}}
        </template>
        </v-slider>
    </v-card-text>
</v-list-group>
</v-list>
<v-list>
<v-list-group  :value="false">
<template v-slot:activator>
<v-subheader>Lower Zones</v-subheader>
</template>

    <v-card-text>
      <v-slider
        v-model="l1"
        step="1"
        hide-details
        >
        <template v-slot:append>
          {{l1}}
        </template>
        </v-slider>
    </v-card-text>

<v-card-text>
      <v-slider
        v-model="l2"
        step="1"
        hide-details
        >
        <template v-slot:append>
          {{l2}}
        </template>
        </v-slider>
    </v-card-text>


<v-card-text>
      <v-slider
        v-model="l3"
        step="1"
        hide-details
        >
        <template v-slot:append>
          {{l3}}
        </template>
        </v-slider>
    </v-card-text>
</v-list-group>
</v-list> 
            <v-card-actions>
              <v-btn text @click="updateOptions()" >Apply</v-btn>
            </v-card-actions>
  </v-card>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import { VUEX_UPPER_LIQUIDATION_LEVERAGE_1,
         VUEX_UPPER_LIQUIDATION_LEVERAGE_2,
         VUEX_UPPER_LIQUIDATION_LEVERAGE_3,
         VUEX_LOWER_LIQUIDATION_LEVERAGE_1,
         VUEX_LOWER_LIQUIDATION_LEVERAGE_2,
         VUEX_LOWER_LIQUIDATION_LEVERAGE_3, 
         VUEX_SET_LIQUIDATION_VOLUME,
         VUEX_SET_LIQUIDATION_TIMEINTERVAL,
         VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS,
         VUEX_SET_LIQUIDATION_ZONES
        } from '../../store/constants/bitmex'
export default {
  name: 'liquidationOptions',
  
  data() {
    return {
      step:"120",
      min:"120",
      max:"2880",
      crosshairSwitch: true,
      
      volumeValue: {
          "1":"1M","2":"2M",
          "3":"5M","4":"10M","5":"15M",
          "6":"20M","7":"25M","8":"30M",
          "9":"50M","10":"100M","11":"200M",
          "12": "500M", "13": "1B",
      },
        timeValue: {
        "1": "5M","2":"10M","3": "15M",
        "4":"30M","5":"1H","6":"2H",
        "7":"4H","8":"6H","9":"8H",
        "10":"10H","11":"12H","12":"24H",
        "13":"48H"
      }
    }
  },
  methods: {
        ...mapActions({ 
    }),
    updateOptions() { 
        this.applyLiquidationOptions({userClick: true})
        this.updateZones({userClick: true})
    },
...mapActions({
  setl1: VUEX_LOWER_LIQUIDATION_LEVERAGE_1,
  setl2: VUEX_LOWER_LIQUIDATION_LEVERAGE_2,
  setl3: VUEX_LOWER_LIQUIDATION_LEVERAGE_3,
  setu1: VUEX_UPPER_LIQUIDATION_LEVERAGE_1,
  setu2: VUEX_UPPER_LIQUIDATION_LEVERAGE_2,
  setu3: VUEX_UPPER_LIQUIDATION_LEVERAGE_3,
  setlv: VUEX_SET_LIQUIDATION_VOLUME,
  setti: VUEX_SET_LIQUIDATION_TIMEINTERVAL,
  applyLiquidationOptions: VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS,
  updateZones: VUEX_SET_LIQUIDATION_ZONES

})
  },

  computed: {
 ...mapState({
    lowerLiquidationLeverage1: state => state.bitmex.lowerLiquidationVal1,
    lowerLiquidationLeverage2: state => state.bitmex.lowerLiquidationVal2,
    lowerLiquidationLeverage3: state => state.bitmex.lowerLiquidationVal3,
    upperLiquidationLeverage1: state => state.bitmex.upperLiquidationVal1,
    upperLiquidationLeverage2: state => state.bitmex.upperLiquidationVal2,
    upperLiquidationLeverage3: state => state.bitmex.upperLiquidationVal3,
    liquidationVolume: state => state.bitmex.liquidationVolume,
    liquidationTimeInterval: state => state.bitmex.liquidationTimeInterval,
 }),

 lv: {
   get() {
     return Object.keys(this.volumeValue).find(key => this.volumeValue[key] === this.liquidationVolume);
   },   
   set(value) {
     this.setlv(this.volumeValue[value])
   }
 },
 ti: {
   get() {
        return Object.keys(this.timeValue).find(key => this.timeValue[key] === this.liquidationTimeInterval);
   }, 
   set(value) {
     this.setti(this.timeValue[value])
   }
  },

  l1: {
    get(){
      return this.lowerLiquidationLeverage1
    },
    set(value){
      this.setl1(value)
    }
  },
  l2: {
    get(){
      return this.lowerLiquidationLeverage2
    },
    set(value){
      this.setl2(value)
    }
  },
  l3: {
    get(){
      return this.lowerLiquidationLeverage3
    },
    set(value){
      this.setl3(value)
    }
  },
  u1: {
    get(){
      return this.upperLiquidationLeverage1
    },
    set(value){
      this.setu1(value)
    }
  },
  u2: {
    get(){
      return this.upperLiquidationLeverage2
    },
    set(value){
      this.setu2(value)
    }
  },
  u3: {
    get(){
      return this.upperLiquidationLeverage3
    },
    set(value){
      this.setu3(value)
    }
  },
  },

  mounted() {

  },
  components: {
         
       },
}
</script>

<style>
.cross-space {
margin-top:-20px;
}

</style>