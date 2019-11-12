import {
   VUEX_PAGE_NAME,
   VUEX_MDR_SWITCH,
   VUEX_WIDGET_OPTION_1,
   VUEX_WIDGET_OPTION_2,
   VUEX_WIDGET_OPTION_3,
   VUEX_WIDGET_OPTION_4,
   VUEX_WIDGET_OPTION_5,
   VUEX_BAND_1,
   VUEX_BAND_2,
   VUEX_BAND_3,
   VUEX_GUAGE_2,
   VUEX_GUAGE_3,
   VUEX_GUAGE_1,
   VUEX_CAT_1,
   VUEX_CAT_2,
   VUEX_CAT_3,
   VUEX_SET_APPLY_MDR_OPTIONS,
   VUEX_MDR_REQUEST,
   VUEX_MDRLIVE_REQUEST,
   VUEX_MDR_SUCCESS,
   VUEX_MDR_FAILURE,
   VUEX_MDRLIVE_SUCCESS,
   VUEX_MDRLIVE_FAILURE,
   VUEX_SET_GUAGE_INTERVAL,
   VUEX_SET_GUAGE_LIVE,
   VUEX_SAVE_INTERVAL_OPTION,
   VUEX_SHOW_ZONES_MODAL,
   VUEX_SHOW_PRESET_MODAL
   } from '../constants/ui'
   
   import { 
      VUEX_CREATE_PRESET_NAME,
      VUEX_GET_PRESETS,
      VUEX_SET_LIQUIDATION_LEVERAGE
   } from '../constants/bitmex'


   import MDRService from "@/api/MDRService";
   import { stat } from 'fs';


   const state = {
   zonesModal: false,
   guageIntervalWatch:0,
   guageLiveWatch:0,
   page_name: '',
   mdr_guage_switch: false,
   widget_switch_1: false,
   widget_switch_2: false,
   widget_switch_3: false,
   widget_switch_4: false,
   widget_switch_5: false,
   band_1: '',
   band_2: '',
   band_3: '',
   guage_2: 7,
   guage_3: 10,
   guage_1: 1,
   cat_1: 1,
   cat_2: 2,
   cat_3: 3,
   mdrInterval: '',
   mdrLive: '',
   guageInterval1: '',
   guageInterval2: '',
   guageInterval3: '',
   guageCat1: '',
   guageCat2: '',
   guageCat3: '',
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
    presetsDialog: false,
}
   
   const getters = {
   
   }
   
   const actions = {

   [VUEX_SHOW_PRESET_MODAL]: async({commit, dispatch}) => {
      dispatch(VUEX_CREATE_PRESET_NAME)
      dispatch(VUEX_GET_PRESETS)
      commit(VUEX_SHOW_PRESET_MODAL)
   },

   [VUEX_SHOW_ZONES_MODAL]: async ({dispatch, commit}) => {
      dispatch(VUEX_SET_LIQUIDATION_LEVERAGE, 50)
      commit(VUEX_SHOW_ZONES_MODAL)
   },
   
   [VUEX_MDR_REQUEST]: async ({ dispatch, state, commit }, update) => {
   let guage_val1 = state.guage_1
   let guage_val2 = state.guage_2
   let guage_val3 = state.guage_3
   let cat_val1 = state.cat_1
   let cat_val2 = state.cat_2
   let cat_val3 = state.cat_3
   let symbol = "btc"
   let exchanges = ["bitmex"]
   let timeIntervals = [state.validIntervals[guage_val1],state.validIntervals[guage_val2],state.validIntervals[guage_val3]]
   let percentsAway = ["cat"+cat_val1,"cat"+cat_val2,"cat"+cat_val3]
   
   let options = {
   "guage1" :state.validIntervals[guage_val1],
   "guage2" :state.validIntervals[guage_val2],
   "guage3" :state.validIntervals[guage_val3],
   "cat1" :"cat"+cat_val1,
   "cat2" :"cat"+cat_val2,
   "cat3" :"cat"+cat_val3
   }

   commit(VUEX_SAVE_INTERVAL_OPTION, options);

   try {
   await MDRService.MDR(
   symbol,
   exchanges,
   timeIntervals,
   percentsAway
   
   ).then(payload => {
   dispatch(VUEX_MDR_SUCCESS, { data: payload, update: update });
   });
   } catch (err) {
   dispatch(VUEX_MDR_FAILURE, err);
   }
   try {
      await MDRService.MDRLive(
      symbol,
      exchanges,
      timeIntervals,
      
      ).then(payload => {
      dispatch(VUEX_MDRLIVE_SUCCESS, { data: payload, update: update });
      });
      } catch (err) {
      dispatch(VUEX_MDRLIVE_FAILURE, err);
      }
   },

   [VUEX_MDRLIVE_REQUEST]: async ({ dispatch, state}, update) => {
      let guage_val1 = state.guage_1
      let guage_val2 = state.guage_2
      let guage_val3 = state.guage_3
      let cat_val1 = state.cat_1
      let cat_val2 = state.cat_2
      let cat_val3 = state.cat_3
      let percentsAway = ["cat"+cat_val1,"cat"+cat_val2,"cat"+cat_val3]
      let symbol = "btc"
      let exchanges = ["bitmex"]
      let timeIntervals = [state.validIntervals[guage_val1],state.validIntervals[guage_val2],state.validIntervals[guage_val3]]
      try {
         await MDRService.MDRLive(
         symbol,
         exchanges,
         timeIntervals,
         
         ).then(payload => {
         dispatch(VUEX_MDRLIVE_SUCCESS, { data: payload, update: update });
         let currentMdrInterval = JSON.parse(JSON.stringify(state.mdrInterval))
         for (let eachInterval in timeIntervals) {
            for (let eachCat in percentsAway) {
               if (currentMdrInterval[timeIntervals[eachInterval]][percentsAway[eachCat]].min>payload[percentsAway[eachCat]]){
                  currentMdrInterval[timeIntervals[eachInterval]][percentsAway[eachCat]].min = payload[percentsAway[eachCat]]
               }
               if (currentMdrInterval[timeIntervals[eachInterval]][percentsAway[eachCat]].max<payload[percentsAway[eachCat]]){
                  currentMdrInterval[timeIntervals[eachInterval]][percentsAway[eachCat]].max = payload[percentsAway[eachCat]]
               }
            }
         }
         dispatch(VUEX_MDR_SUCCESS, { data: currentMdrInterval, update: update })
         });
         } catch (err) {
            console.log(err)
         dispatch(VUEX_MDRLIVE_FAILURE, err);
         }
      },

   [VUEX_MDR_SUCCESS]: async ({ commit }, payload) => {
   commit(VUEX_SET_GUAGE_INTERVAL, payload);
   },
   
   [VUEX_MDR_FAILURE]: async err => {
   //alert("Failed to fetch MDR DATA. Contact admin.", err);
   },
   [VUEX_MDRLIVE_SUCCESS]: async ({ commit }, payload) => {
      commit(VUEX_SET_GUAGE_LIVE, payload);
      },
      
   [VUEX_MDRLIVE_FAILURE]: async err => {
   //alert("Failed to fetch MDR DATA. Contact admin.", err);
   },
   
   [VUEX_SET_APPLY_MDR_OPTIONS]: async ({ dispatch, state }, payload) => {
   if (payload != undefined && payload.userClick) {
   dispatch(VUEX_MDR_REQUEST)
   }
   },
   
   [VUEX_PAGE_NAME]: async ({ commit }, payload) => {
   commit(VUEX_PAGE_NAME, payload)
   },
   
   [VUEX_MDR_SWITCH]: async ({ commit }, payload) => {
   commit(VUEX_MDR_SWITCH, payload)
   },
   
   [VUEX_GUAGE_2]: async ({ commit }, payload) => {
   commit(VUEX_GUAGE_2, payload)
   },
   
   [VUEX_GUAGE_3]: async ({ commit }, payload) => {
   commit(VUEX_GUAGE_3, payload)
   },
   [VUEX_GUAGE_1]: async ({ commit }, payload) => {
   commit(VUEX_GUAGE_1, payload)
   },
   [VUEX_CAT_2]: async ({ commit }, payload) => {
   commit(VUEX_CAT_2, payload)
   },
   
   [VUEX_CAT_3]: async ({ commit }, payload) => {
   commit(VUEX_CAT_3, payload)
   },
   [VUEX_CAT_1]: async ({ commit }, payload) => {
   commit(VUEX_CAT_1, payload)
   },
   [VUEX_WIDGET_OPTION_1]: async ({ commit }, payload) => {
   commit(VUEX_WIDGET_OPTION_1, payload)
   },
   
   [VUEX_WIDGET_OPTION_2]: async ({ commit }, payload) => {
   commit(VUEX_WIDGET_OPTION_2, payload)
   },
   
   [VUEX_WIDGET_OPTION_3]: async ({ commit }, payload) => {
   commit(VUEX_WIDGET_OPTION_3, payload)
   },

   [VUEX_WIDGET_OPTION_4]: async ({ commit }, payload) => {
      commit(VUEX_WIDGET_OPTION_4, payload)
      },

   [VUEX_WIDGET_OPTION_5]: async ({ commit }, payload) => {
      commit(VUEX_WIDGET_OPTION_5, payload)
      },
   }



   const mutations = {

   [VUEX_SHOW_PRESET_MODAL]: (state) => {
       state.presetsDialog = !state.presetsDialog 
   },   


   [VUEX_SHOW_ZONES_MODAL]: (state) => {
      state.zonesModal = !state.zonesModal
   },

   [VUEX_SAVE_INTERVAL_OPTION]: (state, payload) => {
      state.guageInterval1 = payload.guage1
      state.guageInterval2 = payload.guage2
      state.guageInterval3 = payload.guage3
      state.guageCat1 = payload.cat1
      state.guageCat2 = payload.cat2
      state.guageCat3 = payload.cat3
   },
   [VUEX_SET_GUAGE_INTERVAL]: (state, payload) => {
   state.mdrInterval = payload.data;
   state.guageIntervalWatch+=1
   },
   [VUEX_SET_GUAGE_LIVE]: (state, payload) => {
      state.mdrLive = payload.data;
      state.guageLiveWatch+=1
   },
   [VUEX_PAGE_NAME]: (state, payload) => {
   state.page_name = payload
   },
   
   [VUEX_MDR_SWITCH]: (state, payload) => {
   state.mdr_guage_switch = payload
   },
   
   [VUEX_WIDGET_OPTION_1]: (state, payload) => {
   state.widget_switch_1 = payload
   },
   
   [VUEX_WIDGET_OPTION_2]: (state, payload) => {
   state.widget_switch_2 = payload
   },
   
   [VUEX_WIDGET_OPTION_3]: (state, payload) => {
   state.widget_switch_3 = payload
   },

   [VUEX_WIDGET_OPTION_4]: (state, payload) => {
      state.widget_switch_4 = payload
      },

   [VUEX_WIDGET_OPTION_5]: (state, payload) => {
         state.widget_switch_5 = payload
      },
   
   [VUEX_BAND_1]: (state, payload) => {
   state.band_1 = payload
   },
   [VUEX_BAND_2]: (state, payload) => {
   state.band_2 = payload
   },
   [VUEX_BAND_3]: (state, payload) => {
   state.band_3 = payload
   },

   [VUEX_CAT_1]: (state, payload) => {
   state.cat_1 = payload
   },
   [VUEX_CAT_2]: (state, payload) => {
   state.cat_2 = payload
   },
   [VUEX_CAT_3]: (state, payload) => {
   state.cat_3 = payload
   },
   
   [VUEX_GUAGE_2]: (state, payload) => {
   state.guage_2 = payload
   },
   [VUEX_GUAGE_3]: (state, payload) => {
   state.guage_3 = payload
   },
   [VUEX_GUAGE_1]: (state, payload) => {
   state.guage_1 = payload
   },
   }
   
   export default {
   state,
   getters,
   actions,
   mutations
   }