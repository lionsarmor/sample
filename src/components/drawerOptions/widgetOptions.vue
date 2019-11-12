<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="400">
            <template v-slot:activator="{ on }">
                <v-btn color="#3ab0f0" dark small v-on="on">
                    METRICS
                </v-btn>
            </template>
            <v-card style="padding-bottom:20px; background:black;">
                <v-card-actions class="black">
                    <strong class="font-offwhite size-20 mx-2">METRICS SETTINGS</strong>
                    <v-spacer></v-spacer>
                    <v-btn color="#c03500" class="zone-settings-button font-white" small text @click="dialog = false">CLOSE</v-btn>
                </v-card-actions>
                <div style="background-color: #424242">
                    <br>
                    <v-card-actions>
                        <button v-bind:style="MDRButton" v-on:click="getClass('mdr')" class="font-white mdr-button">MDR</button>
                        <button class="font-white mx-2 oi-button" disabled>OI</button>
                        <button class="font-white delta-button" disabled>DELTA</button>
                    </v-card-actions>
                    <v-card-actions>
                        <button v-bind:style="settingsButton" v-on:click="getClass('settings')" class="font-white top-switch-button1">SETTINGS</button>
                        <button v-bind:style="exchangesButton" v-on:click="getClass('exchanges')" class="font-white top-switch-button2">EXCHANGES</button>
                    </v-card-actions>
                    <v-card-actions v-show="tab == 'settings'">
                        <v-btn color="#3aafef" class="font-white button-left-margin mx-3" text @click="decreaseInterval()">LESS</v-btn>
                        <input class="mx-3 font-white middle-button-border middle-button-top centered-input" v-model="times[validIntervals[newInterval]]"/>
                        <v-btn color="#3aafef" class="font-white button-right-margin mx-2" text @click="increaseInterval()">MORE</v-btn>
                    </v-card-actions>
                </div>

                <div class="grid-container" v-show="tab == 'settings'">
                    <div class="grid-item guage"><img src="@/static/inner.svg" height="120px" width="120px" /></div>
                    <div class="grid-item">
                        <div class="grid-container-small">
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white top-button" text @click="increaseCat(3, newCat3)">MORE</v-btn>
                            </div>
                            <div class="grid-item-small"><input small class="font-white middle-button-border middle-button centered-input middle-input" v-model="validCats[newCat3]"/></div>
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white bottom-button" text @click="decreaseCat(3, newCat3)">LESS</v-btn>
                            </div>
                        </div>
                    </div>

                    <div class="grid-item guage"><img src="@/static/middle.svg" height="120px" width="120px" /></div>
                    <div class="grid-item">
                        <div class="grid-container-small">
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white top-button" text @click="increaseCat(2, newCat2)">MORE</v-btn>
                            </div>
                            <div class="grid-item-small"><input small  class="font-white middle-button-border middle-button centered-input middle-input" v-model="validCats[newCat2]"/></div>
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white bottom-button" text @click="decreaseCat(2, newCat2)">LESS</v-btn>
                            </div>
                        </div>
                    </div>
                    <div class="grid-item guage"><img src="@/static/outer.svg" height="120px" width="120px" /></div>
                    <div class="grid-item">
                        <div class="grid-container-small">
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white top-button" text @click="increaseCat(1, newCat1)">MORE</v-btn>
                            </div>
                            <div class="grid-item-small"><input small class="font-white middle-button-border middle-button centered-input middle-input" v-model="validCats[newCat1]"/></div>
                            <div class="grid-item-small">
                                <v-btn small color="#3aafef" class="font-white bottom-button" text @click="decreaseCat(1, newCat1)">LESS</v-btn>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-show="tab == 'exchanges'" style="background-color: #424242">
                    <v-btn id="b1" class="font-white menuButton" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b1')" text>BITMEX</v-btn>
                    <br>
                    <v-btn id="b2" class="font-white menuButton" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b2')" text>BITSTAMP</v-btn>
                    <br>
                    <v-btn id="b3" class="font-white menuButton" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b3')" text>KRAKEN</v-btn>
                    <br>
                    <v-btn id="b4" class="font-white" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b4')" text>GDAX</v-btn>
                    <br>
                    <v-btn id="b5" class="font-white" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b5')" text>BYBIT</v-btn>
                    <br>
                    <v-btn id="b6" class="font-white" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b6')" text>BINANCE</v-btn>
                    <br>
                    <v-btn id="b7" class="font-white" v-bind:style="exchangeButtonMenu" @click="exchangeMenuButton('b7')" text>BITFINEX</v-btn>
                </div>
            </v-card>
            <v-card-actions class="black">
                <v-btn color="#c03500" class="mx-3 font-white" text @click="showRadial(true)">ADD</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="#c03500" class="font-white" text @click="clearRadial()">CLEAR</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="#c03500" class="mx-3 font-white" text @click="dialog = false, updateMDROptions()">SAVE</v-btn>
            </v-card-actions>
        </v-dialog>
    </div>


</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'

    import {

        VUEX_MDR_SWITCH,
        VUEX_PAGE_NAME,
        VUEX_WIDGET_OPTION_1,
        VUEX_WIDGET_OPTION_2,
        VUEX_WIDGET_OPTION_3,
        VUEX_WIDGET_OPTION_4,
        VUEX_WIDGET_OPTION_5,
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
        name: 'widgetOptions',

        data() {
            return {
                nextInterval: 1,
                newInterval: 1,
                newCat1: 5,
                newCat2: 4,
                newCat3: 3,
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
                "1": "0.25%",
                "2": "0.5%",
                "3": "1%",
                "4": "2.5%",
                "5": "5%",
                "6": "10%",
                "7": "15%",
                "8": "20%",
                },
                dialog: false,
                items: ['Guage-1', 'Guage-2', 'Guage-3'],
                value: [],
                tab: 'settings',
                MDRButton: {
                    backgroundColor: '#c03500',
                },
                settingsButton: {
                    backgroundColor: '#c03500',
                },
                exchangesButton: {
                    backgroundColor: '#575757',
                },
                exchangeButtonMenu: {
                    width: '382px',
                    backgroundColor: '#575757'
                }
            }
        },
        methods: {
            ...mapActions({
                widget_switch_1: VUEX_WIDGET_OPTION_1,
                widget_switch_2: VUEX_WIDGET_OPTION_2,
                widget_switch_3: VUEX_WIDGET_OPTION_3,
                widget_switch_4: VUEX_WIDGET_OPTION_4,
                widget_switch_5: VUEX_WIDGET_OPTION_5,
                mdr_widget_switch: VUEX_MDR_SWITCH,
                setG2: VUEX_GUAGE_2,
                setG3: VUEX_GUAGE_3,
                setG1: VUEX_GUAGE_1,
                setC2: VUEX_CAT_2,
                setC3: VUEX_CAT_3,
                setC1: VUEX_CAT_1,
                applyMDROptions: VUEX_SET_APPLY_MDR_OPTIONS,
            }),
            showRadial(val){
                this.setInterval(this.nextInterval, this.newInterval)
                this.updateMDROptions()
                this.setVisible(this.nextInterval, val)
                if (this.nextInterval < 4){
                this.nextInterval += 1
                this.newInterval = this.currentInterval(this.nextInterval)
                }
            },
            clearRadial(){
                if (this.nextInterval > 1){
                this.nextInterval -= 1
                this.setVisible(this.nextInterval, false)
                this.newInterval = this.currentInterval(this.nextInterval)
                }
            },
            decreaseInterval(){
                if (this.newInterval > 1) {
                this.newInterval = (this.newInterval - 1)
                }
            },
            increaseInterval(){
                if (this.newInterval < 10) {
                this.newInterval = (this.newInterval + 1)
                }
            },
            currentInterval(val){
                switch (val){
                    case 1:
                        return this.g1
                        break
                    case 2:
                        return this.g2
                        break
                    case 3:
                        return this.g3
                        break
                }
            },
            currentCat(val){
                switch (val){
                    case 1:
                        return this.c1
                        break
                    case 2:
                        return this.c2
                        break
                    case 3:
                        return this.c3
                        break
                }
            },
            setInterval(interval){
                let value = this.newInterval
                switch (interval){
                    case 1:
                        this.setG1(value)
                        break
                    case 2:
                        this.setG2(value)
                        break
                    case 3:
                        this.setG3(value)
                        break
                }
            },
            setVisible(interval, value){
                switch (interval){
                    case 1:
                        this.widget_switch_1(value)
                        break
                    case 2:
                        this.widget_switch_2(value)
                        break
                    case 3:
                        this.widget_switch_3(value)
                        break
                }
            },
            decreaseCat(cat, val){
                if (val > 1){
                    switch (cat){
                        case 1:
                            this.newCat1 = this.newCat1 - 1
                            break
                        case 2:
                            this.newCat2 = this.newCat2 - 1
                            break
                        case 3:
                            this.newCat3 = this.newCat3 - 1
                            break
                    }
                }
            },
            increaseCat(cat, val){
                if (val < 8){
                    switch (cat){
                        case 1:
                            this.newCat1 = this.newCat1 + 1
                            break
                        case 2:
                            this.newCat2 = this.newCat2 + 1
                            break
                        case 3:
                            this.newCat3 = this.newCat3 + 1
                            break
                    }
                }
            },
            switch_mdr(val) {
                this.mdr_widget_switch(val)
            },
            updateMDROptions(){
            this.c1 = this.newCat1
            this.c2 = this.newCat2
            this.c3 = this.newCat3
            this.applyMDROptions({userClick: true})
            },
            toggle_widget_1(val) {
                this.widget_switch_1(val)
            },
            toggle_widget_2(val) {
                this.widget_switch_2(val)
            },
            toggle_widget_3(val) {
                this.widget_switch_3(val)
            },
            toggle_widget_4(val) {
                this.widget_switch_4(val)
            },
            toggle_widget_5(val) {
                this.widget_switch_5(val)
            },
            exchangeMenuButton(val) {
                let button = document.getElementById(val)
                button.style.backgroundColor = "#c03500"
            },
            clear() {
                for (let i = 1; i < 8; i++) {
                    let button = document.getElementById('b' + i)
                    button.style.backgroundColor = "#595959"
                }
            },
            getClass(val) {
                if (val == 'settings') {
                    this.settingsButton.backgroundColor = '#c03500'
                    this.exchangesButton.backgroundColor = '#595959'
                } else if (val == 'exchanges') {
                    this.settingsButton.backgroundColor = '#595959'
                    this.exchangesButton.backgroundColor = '#c03500'
                }
                this.tab = val
            }
        },
        watch: {
            value: function(val) {
                let guage1 = val.includes("Guage-1");
                let guage2 = val.includes("Guage-2");
                let guage3 = val.includes("Guage-3");
                let guage4 = val.includes("Guage-4");
                let guage5 = val.includes("Guage-5");

                this.toggle_widget_1(guage1)
                this.toggle_widget_2(guage2)
                this.toggle_widget_3(guage3)
                this.toggle_widget_4(guage4)
                this.toggle_widget_5(guage5)

            },
        },
        computed: {
            ...mapState({
                widget_1: state => state.ui.widget_switch_1,
                widget_2: state => state.ui.widget_switch_2,
                widget_3: state => state.ui.widget_switch_3,
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
            this.getClass('settings')
        },
        components: {

        },
    }
</script>

<style scoped>
    .card {
        background: rgba(128, 128, 128, 0.089);
    }

    .title-pos {
        position: relative;
        margin-top: -30px;
    }

    .button-position {
        position: relative;
        top: -25px;
    }

    .button-title {
        position: relative;
        top: 10px;
    }

    .title-button {
        position: relative;
        top: 10px;
        right: 13px;
    }

    .middle-button-border {
        border: 2px solid #575757;
        background-color: transparent;
        color: white;
        cursor: pointer;
        height: 37px;
        width: 352px;
        margin-left: 8px;
        border-radius: 3px;
        margin-top: 10px;
    }

    .top-switch-button1 {
        color: white;
        cursor: pointer;
        height: 27px;
        width: 199.5px;
        margin-left: -7.2px;
        border-radius: 0px;
    }

    .top-switch-button2 {
        color: white;
        cursor: pointer;
        margin-right: -31.5px;
        height: 27px;
        width: 199.5px;
        border-radius: 0px;
    }

    .button-right-margin {
        left: 8px;
    }

    .settings-bar-button {
        width: 340px;
        font-size: 15px;
    }

    .disable-events {
        pointer-events: none
    }

    .nowrap {
        white-space: nowrap;
    }

    .cursor {
        cursor: pointer;
    }

    .black {
        background-color: black
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
        top: 5px;
    }

    .container-height {
        height: 450px;
    }

    .mdr-button {
        width: 118px;
        background: #595959;
        margin-left: -15px;
        height: 27px;
    }

    .oi-button {
        width: 118px;
        background: #595959;
        height: 27px;
        position: relative;
        left: 19px;
    }

    .delta-button {
        width: 118px;
        background: #595959;
        position: relative;
        right: -35.5px;
        height: 27px;
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
        left: 8px;
    }

    .button-left-margin {
        right: 8px;
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
        background-color: black
    }

    .nowrap {
        white-space: nowrap;
    }

    .cursor {
        cursor: pointer;
    }

    .black {
        background-color: black
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
        top: 5px;
    }

    .centered-input {
        position: relative;
        top: -5px;
    }

    .grid-container {
        display: grid;
        grid-template-columns: auto auto;
        background-color: #424242;
        padding: 10px;
    }

    .grid-container-small {
        display: grid;
        grid-template-columns: auto;
        background-color: #424242;
        padding: 0px;
        margin-left: 95px;
    }

    .top-button {
        width: 150px;
    }

    .middle-input {
        width: 150px;
    }

    .bottom-button {
        width: 150px;
    }

    .middle-button-top {
        width: 120px;
    }

    .guage {
        position: relative;
        left: 25px;
    }

    .exchangeButtonMenu-highlight {
        width: '382px';
        background-color: 'purple'
    }
</style>