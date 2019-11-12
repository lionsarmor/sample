<template>
    <v-app id="inspire" dark>
        <v-toolbar app fixed clipped-left dark>
            <img src="@/static/favicon.svg" height="30px" width="30px" />
            <widgetOptions v-if="loggedIn == true" />
            <div class="text-center nowrap">
                    <v-dialog v-model="zonesModal" persistent max-width="400" v-if="loggedIn == true">
                        <template v-slot:activator="{ on }">
                            <v-btn color="#3ab0f0" small dark v-on="on" @click="showZonesModal()">ZONES</v-btn>
                        </template>
                        <liquidationOptions />
                    </v-dialog>

                <v-dialog v-model="preset" persistent max-width="400" v-if="loggedIn == true">
                    <template v-slot:activator="{ on }">
                    <v-btn color="#3ab0f0" small dark v-on="on" @click="togglePresetModal()">PRESETS</v-btn>
                     </template>
                     <presetContainer/>
                </v-dialog>

            </div>
            <v-spacer></v-spacer>
            <span class="price mx-4" style="font-weight:900" v-if="ohlc.length !=0">
                {{ ohlc[ohlc.length-1][4].toFixed(1)}}
            </span>
           <!-- <v-spacer></v-spacer> -->
            <v-icon class="mx-1 cursor">far far fa-comment-alt</v-icon>
            <v-icon class="mx-3 cursor" @click="toggleCrosshair()">fas far fa-crosshairs</v-icon>
        </v-toolbar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
    import {
        VUEX_PAGE_NAME,
        VUEX_SHOW_ZONES_MODAL,
        VUEX_SHOW_PRESET_MODAL
    } from '@/store/constants/ui'
    import {
        VUEX_TOGGLE_CROSSHAIR
    } from '@/store/constants/bitmex'

    import {
        mapState,
        mapActions
    } from 'vuex'
    import {
        VUEX_POST_USER_LOGOUT
    } from './store/constants/authentication'
    import liquidationOptions from './components/drawerOptions/liquidationOptions'
    import presetContainer from './components/drawerOptions/presetContainer'
    import widgetOptions from '@/components/drawerOptions/widgetOptions'

    export default {
        name: 'app',

        data() {
            return {
                drawer: false,
                options_menu: false,
                dialogPreset: false
            }
        },
        methods: {
            ...mapActions({
                stateLogout: VUEX_POST_USER_LOGOUT,
                updatePage: VUEX_PAGE_NAME,
                showZonesModal: VUEX_SHOW_ZONES_MODAL,
                toggleCrosshair: VUEX_TOGGLE_CROSSHAIR,
                togglePresetModal: VUEX_SHOW_PRESET_MODAL,
            }),
            options_button(val) {
                this.options_menu = !val
            },
            logout() {
                this.stateLogout();
                this.updatePage('');
            },

            login() {
                this.$router.push("/login")
            },

            register() {
                this.$router.push("/register")
            },

            liquidation() {
                this.$router.push("/liquidations")
            },
            MDRData() {
                this.$router.push("/MDR")
            }
        },

        computed: {
            ...mapState({
                loggedIn: state => state.authentication.authenticated,
                ohlc: state => state.bitmex.ohlc,
                zonesModal: state => state.ui.zonesModal,
                preset: state => state.ui.presetsDialog
            }),

            ...mapState({
                page_name: state => state.ui.page_name
            })
        },
        mounted() {

        },
        components: {
            liquidationOptions,
            widgetOptions,
            presetContainer
        },
    }
</script>

<style>
    .price {
        font-size: "40px"
    }

    .drawer-space {
        top: 0vh;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
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