<template>
    <v-card style="padding-bottom:20px; background:black;">
        <v-card-actions class="black">
            <strong class="font-offwhite size-20 mx-2">ZONE SETTINGS</strong>
            <v-spacer></v-spacer>
            <v-btn color="#c03500" class="zone-settings-button font-white" small text @click="showZonesModal()">CLOSE</v-btn>
            </v-card-actions>
                <v-card>
                <v-container color="#161715">
                    <v-card-actions>
                        <v-btn color="#3aafef" class="font-white"  text @click="decreaseInterval()">LESS</v-btn>  
                        <v-btn color="black" class="font-white middle-button disable-events"  text >{{ interval }}</v-btn>                  
                        <v-btn color="#3aafef" class="font-white"  text @click="increaseInterval()">MORE</v-btn>                  
                    </v-card-actions>
                    <br />
                    <v-card-actions>
                        <v-btn color="#3aafef" class="font-white"  text @click="decreaseVolume()">LESS</v-btn>  
                        <v-btn color="black" class="font-white middle-button disable-events"  text >{{ volume }}</v-btn>                  
                        <v-btn color="#3aafef" class="font-white "  text @click="increaseVolume()">MORE</v-btn>                  
                    </v-card-actions>
                    <br />
                    <v-card-actions style="margin-left:8px">
                        <v-btn color="#3aafef" class="font-white button-left-margin"  text @click="decreaseLeverage()">TIGHT</v-btn>
                        <input  v-model="leverage" class="font-white middle-button-border middle-button centered-input"/>                 
                        <v-btn color="#3aafef" class="font-white button-right-margin"  text @click="increaseLeverage()">WIDE</v-btn>             
                    </v-card-actions>
                    <br />
                    <v-card-actions>
                        <v-btn color="#202020" class="settings-bar-button font-white" small text @click="addCustomLines({above:true, below:false})">INSERT ABOVE PRICE</v-btn>                     
                    </v-card-actions>
                    <v-card-actions>
                        <v-btn color="#202020" class="settings-bar-button font-white" small text @click="addCustomLines({above:true, below:true})">INSERT BOTH</v-btn>                                                   
                    </v-card-actions>
                    <v-card-actions>
                        <v-btn color="#202020" class="settings-bar-button font-white" small text @click="addCustomLines({above:false, below:true})">INSERT BELOW PRICE</v-btn>                                                 
                    </v-card-actions>
                </v-container>
            </v-card>
        <v-card-actions>
            <v-btn color="#c03500" class="mx-3 font-white" @click="undoMagicLine()" text>UNDO</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#c03500" class="font-white" text @click="clearAllLiquidations()">CLEAR</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="#c03500" class="mx-3 font-white" text @click="save()">SAVE</v-btn>
        </v-card-actions>
        <v-card-actions>
            <v-btn small color="#3aafef" class="font-white mx-3 button-width" text @click="setDefault()">DEFAULT</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    import liquidationOptions from '@/components/drawerOptions/liquidationOptions'
    import {
        VUEX_SHOW_ZONES_MODAL,
        VUEX_SHOW_PRESET_MODAL
    } from '@/store/constants/ui'

    import mdrOptions from '@/components/drawerOptions/mdrOptions'
    import {   
            VUEX_INCREMENT_LIQUIDATION_VOLUME,
            VUEX_DECREMENT_LIQUIDATION_VOLUME,
            VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL,
            VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL,
            VUEX_INCREMENT_LIQUIDATION_LEVERAGE,
            VUEX_DECREMENT_LIQUIDATION_LEVERAGE,
            VUEX_SET_LIQUIDATION_LEVERAGE,
            VUEX_SET_DEFAULT_LIQUIDATIONS,
            VUEX_CLEAR_ALL_LIQUIDATIONS,
            VUEX_ADD_CUSTOM_LIQUIDATION_LINES,
            VUEX_UNDO_MAGIC_LINE
    } from '../../store/constants/bitmex'


    export default {
        name: 'drawerContainer',

        data() {
            return {

            }
        },
        methods: {
            ...mapActions({
                increaseVolume: VUEX_INCREMENT_LIQUIDATION_VOLUME,
                decreaseVolume: VUEX_DECREMENT_LIQUIDATION_VOLUME,
                increaseInterval: VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL,
                decreaseInterval: VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL,
                increaseLeverage: VUEX_INCREMENT_LIQUIDATION_LEVERAGE,
                decreaseLeverage: VUEX_DECREMENT_LIQUIDATION_LEVERAGE,
                setLeverage: VUEX_SET_LIQUIDATION_LEVERAGE,
                showZonesModal: VUEX_SHOW_ZONES_MODAL,
                setDefault: VUEX_SET_DEFAULT_LIQUIDATIONS,
                clearAllLiquidations: VUEX_CLEAR_ALL_LIQUIDATIONS,
                addCustomLines: VUEX_ADD_CUSTOM_LIQUIDATION_LINES,
                togglePresetModal: VUEX_SHOW_PRESET_MODAL,
                undoMagicLine: VUEX_UNDO_MAGIC_LINE,
            }),
            save() {
                this.showZonesModal()
                this.togglePresetModal()
            }
        },

        computed: {
            ...mapState({
                page_name: state => state.ui.page_name,
                volume: state => state.bitmex.liquidationVolume,
                interval: state => state.bitmex.liquidationTimeInterval,
                leverageState: state => state.bitmex.liquidationLeverage
            }),

            leverage: {
                get() {
                    return this.leverageState
                },
                set(val) {
                    this.setLeverage(val)
                }
            }
        },

        mounted() {

        },
        components: {
            liquidationOptions,
            mdrOptions,
        },
    }
</script>

<style scoped>
    .title-mdr {
        font-size: 20px;
    }

    .middle-button {
        width: 130px;
    }
    .middle-height {
        height: 50px;
    }
.middle-button-border {
  border: 2px solid #575757;
  color: white;
  cursor: pointer;
  height: 37px;
    }
.button-right-margin {
    left:8px;
}

.button-left-margin {
    right:8px;
}
.settings-bar-button {
    width: 340px;
    font-size: 15px;
}
.disable-events {
  pointer-events: none
}

input { 
    text-align: center; 
}

.black {
    background-color:black
    }

        .nowrap {
        white-space: nowrap;
    }

    .cursor {
        cursor: pointer;
    }
    .black {
    background-color:black
    }
    .zone-settings-button {
        width: 200px;
    }
    .font-offwhite {
        color: rgb(177, 174, 174);
    }
    .font-white {
        color: rgb(252, 252, 252) !important;
    }
    .size-20 {
        font-size: 18px;
    }
    .button-width {
        width: 352px;
        top:5px;
    }
</style>