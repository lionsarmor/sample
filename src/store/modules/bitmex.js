import {
  VUEX_APPEND_NEW_OHLC,
  VUEX_SET_HISTORICAL_OHLC,
  VUEX_GET_REQUEST_OHLC,
  VUEX_GET_REQUEST_OHLC_SUCCESS,
  VUEX_GET_REQUEST_OHLC_FAILURE,
  VUEX_LIQUIDATION_LEVERAGE,
  VUEX_SET_LIQUIDATION_VOLUME,
  VUEX_SET_LIQUIDATION_TIMEINTERVAL,
  VUEX_GET_REQUEST_LIQUIDATIONS,
  VUEX_GET_REQUEST_LIQUIDATIONS_SUCCESS,
  VUEX_GET_REQUEST_LIQUIDATIONS_FAILURE,
  VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS,
  VUEX_SET_SIMPLE_AVERAGE_POINTS,
  VUEX_SAVE_LIQUIDATION_OPTS,
  VUEX_GET_USER_SETTINGS,
  VUEX_SET_USER_SETTINGS,
  VUEX_GET_LIQUIDATION_BUBBLES,
  VUEX_GET_LIQUIDATION_BUBBLES_SUCCESS,
  VUEX_GET_LIQUIDATION_BUBBLES_FAILURE,
  VUEX_SET_LIQUIDATION_BUBBLES,
  VUEX_INCREMENT_LIQUIDATION_VOLUME,
  VUEX_DECREMENT_LIQUIDATION_VOLUME,
  VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL,
  VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL,
  VUEX_INCREMENT_LIQUIDATION_LEVERAGE,
  VUEX_DECREMENT_LIQUIDATION_LEVERAGE,
  VUEX_SET_LIQUIDATION_LEVERAGE,
  VUEX_SET_DEFAULT_LIQUIDATIONS,
  VUEX_DEFAULT_LIQUIDATION_VOLUME,
  VUEX_DEFAULT_LIQUIDATION_INTERVAL,
  VUEX_LEVERAGES_LONG,
  VUEX_LEVERAGES_SHORT,
  VUEX_CLEAR_ALL_LIQUIDATIONS,
  VUEX_ADD_CUSTOM_LIQUIDATION_LINES,
  VUEX_UPDATE_MATCHED_SERIES,
  VUEX_CLEAR_CHART_SERIES,
  VUEX_TOGGLE_CROSSHAIR,
  VUEX_LONG,
  VUEX_SHORT,
  VUEX_UPDATE_MAGIC_LINES,
  VUEX_UPDATE_MAGIC_LINES_SUCCESS,
  VUEX_UPDATE_MAGIC_LINES_FAILURE,
  VUEX_UPDATE_FROM_LOCAL_STORAGE,
  VUEX_GET_REQUEST_LIQUIDATIONS_PROMISE,
  VUEX_FORCE_CHART_RENDER,
  VUEX_SET_MAGIC_PRESETS,
  VUEX_CREATE_PRESET_NAME,
  VUEX_SAVE_PRESETS,
  VUEX_DELETE_PRESETS,
  VUEX_GET_PRESETS,
  VUEX_RENAME_PRESET,
  VUEX_LOAD_PRESET,
  VUEX_UNDO_MAGIC_LINE
} from "../constants/bitmex";

import Bitmex from "../../services/bitmex";
import LiquidationService from "@/api/LiquidationService";
import AuthenticationService from "@/api/AuthenticationService"


const volumeMap = {
  "1M": 1000000,
  "2M": 2000000,
  "5M": 5000000,
  "10M": 10000000,
  "15M": 15000000,
  "20M": 20000000,
  "25M": 25000000,
  "30M": 30000000,
  "50M": 50000000,
  "100M": 100000000,
  "200M": 200000000,
  "500M": 500000000,
  "1B": 1000000000
};

const intervalMap = {
  "5M": 5,
  "10M": 10,
  "15M": 15,
  "30M": 30,
  "1H": 60,
  "2H": 120,
  "4H": 240,
  "6H": 360,
  "8H": 480,
  "10H": 600,
  "12H": 720,
  "24H": 1440,
  "48H": 2880
};

const volumes = [
  { display: "1M", value: 1000000 },
  { display: "2M",  value: 2000000 },
  { display: "5M", value: 5000000 },
  { display: "10M",  value: 10000000 },
  { display: "15M",  value: 15000000 },
  { display: "20M",  value: 20000000 },
  { display: "25M",  value: 25000000 },
  { display: "30M",  value: 30000000 },
  { display: "50M", value: 50000000 },
  { display: "100M", value: 100000000 },
  { display:"200M",  value: 200000000 },
  { display:"500M",  value: 500000000 },
  { display:"1B",   value: 1000000000 },
]

const timeIntervals = [
  {display:"5M", value: 5},
  {display:"10M", value: 10},
  {display:"15M", value: 15},
  {display:"30M", value: 30},
  {display:"1H", value: 60},
  {display:"2H", value: 120},
  {display:"4H", value: 240},
  {display:"6H", value: 360},
  {display:"8H", value: 480},
  {display:"10H", value: 600},
  {display:"12H", value: 720},
  {display:"24H", value: 1440},
  {display:"48H", value: 2880}
]
const state = {
  ohlc: [],
  historicalDataGathered: false,
  liquidationLeverage: 50, 
  selectedVolume: 2,  // Requested default on load increment and decrement
  selectedInterval: 6, // Requested default on load increment and decrement
  liquidationVolume: volumes[2].display, // Requested default on load
  liquidationTimeInterval: timeIntervals[6].display, // Requested default on load
  simpleAveragePoints: [],
  liquidationBubbles: null,
  ForceRenderChart: 0,
  updateLineCharts: 0,
  defaultLines: false,
  clearAllSeries: 0,
  crosshair: 0,
  updateMagicLines: 0,
  magiclinecolorscheme: ["#9C8CFF", "#6F93E8", "#87E0FF", "#6FE8D2", "#7DFFAB","#FF6E6B", "#E851C9", "#CA65FF","#6D51E8", "#4577FF"],
  magicLineColorIndex: 0,
  seriesColorMap: {},
  storedMagicLines: getStoredMagicLines(),
  presets: [],
  currentPresetName: 'None',
  magicUpdateCounter: 0,
};

const getters = {};

const actions = {

  [VUEX_UNDO_MAGIC_LINE]: async ({dispatch, commit}) => {
    commit(VUEX_UNDO_MAGIC_LINE)
    commit(VUEX_CLEAR_CHART_SERIES)
    dispatch(VUEX_UPDATE_FROM_LOCAL_STORAGE)
  },

  [VUEX_LOAD_PRESET]: async ({dispatch, commit}, selectedPresetName) => {
    console.log(state.currentPresetName, state.presets)
    commit(VUEX_CLEAR_CHART_SERIES)
    commit(VUEX_CLEAR_ALL_LIQUIDATIONS)
    for (const preset of state.presets) {
      if (preset.name == selectedPresetName) {
        for (const selectedPreset of preset.presets) {
          await dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_PROMISE, selectedPreset).then(payload => {
            dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_SUCCESS, { data: payload, update: false, render:false })
           }
         )
       }
      }
    }
    commit(VUEX_FORCE_CHART_RENDER)
  },

  [VUEX_RENAME_PRESET]: async({ commit }, payload) => {
    try { 
      await LiquidationService.RenamePreset(payload.name, payload.newName).then(payload =>  {
        commit(VUEX_SET_MAGIC_PRESETS, payload.presets)
      })
    } catch (err) {
      console.log(err)
    }
  },

  [VUEX_GET_PRESETS]: async({commit}) => {
    try {
      await LiquidationService.GetPresets().then(payload => commit(VUEX_SET_MAGIC_PRESETS, payload.presets))
    } catch (err) {
      console.log(err)
    }
  },


  [VUEX_DELETE_PRESETS]: async({commit, dispatch}, payload) => {
    try {
      await LiquidationService.DeletePresets(payload).then(payload => {
        commit(VUEX_SET_MAGIC_PRESETS, payload.presets)
      } )

    } catch (err) {
      console.log(err)
    }
  },

  [VUEX_SAVE_PRESETS]: async({commit}) => {
    try{
      await LiquidationService.SavePresets(state.currentPresetName, state.simpleAveragePoints).then(payload => {
        commit(VUEX_SET_MAGIC_PRESETS, payload.presets)
      })
    } catch (err) {
      console.log(err)
    }
  },

  [VUEX_CREATE_PRESET_NAME]: async ({ commit }) => {
    commit(VUEX_CREATE_PRESET_NAME)
  },

  [VUEX_SET_MAGIC_PRESETS]: async ({commit}, payload) => {
    commit(VUEX_SET_MAGIC_PRESETS, payload)
  },

  [VUEX_UPDATE_FROM_LOCAL_STORAGE]: async ({ commit, dispatch }) => {
    if (state.storedMagicLines.length > 0){
      for (const magicLine of state.storedMagicLines) {
        await dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_PROMISE, magicLine).then(payload => {
           dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_SUCCESS, { data: payload, update: false, render:false })
          }
        )
      }
    }
    commit(VUEX_FORCE_CHART_RENDER)
  },

  [VUEX_UPDATE_MAGIC_LINES]: async ({ commit }) => {
    state.simpleAveragePoints.forEach(async(magicline) => {
      if (magicline.ml == true) {
        try {
          let timeinterval = magicline.interval;
          let volume = magicline.volume;
          let exchange = "bitmex";
          let symbol = "XBTUSD";
          let update = true
          let longleverages = magicline.VUEX_LEVERAGES_LONG
          let shortleverages = magicline.VUEX_LEVERAGES_SHORT
          await LiquidationService.Liquidations(
            timeinterval,
            volume,
            exchange,
            symbol,
            longleverages,
            shortleverages,
            update
          ).then(payload => {
            if (payload != undefined && payload.length > 0 && 'name' in payload && payload.name == "error") {
              commit(VUEX_UPDATE_MAGIC_LINES_FAILURE, payload);
            }
            commit(VUEX_UPDATE_MAGIC_LINES_SUCCESS, { data: payload });
          });
        }
        catch (err) {
          commit(VUEX_UPDATE_MAGIC_LINES_FAILURE, err);
        }

      }

    })

  },
  [VUEX_TOGGLE_CROSSHAIR]: async ({commit}) => {
    commit(VUEX_TOGGLE_CROSSHAIR)
  },

  [VUEX_GET_LIQUIDATION_BUBBLES]: async ({dispatch}) => {
    try{ 
        await LiquidationService.LiquidationBubbles().then(payload => {
          dispatch(VUEX_GET_LIQUIDATION_BUBBLES_SUCCESS, payload)
        }) 
    }
    catch (err) {
       dispatch(VUEX_GET_LIQUIDATION_BUBBLES_FAILURE, err)
    }
  },

  [VUEX_GET_LIQUIDATION_BUBBLES_SUCCESS]: async({commit}, payload) => {
      commit(VUEX_SET_LIQUIDATION_BUBBLES, payload)
  },

  [VUEX_GET_LIQUIDATION_BUBBLES_FAILURE]: async (err) => {
    console.log("Failed to get liquidation bubbles with error: ", err)
  },



  [VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS]: async ({ dispatch }, payload) => {
    dispatch(VUEX_GET_REQUEST_LIQUIDATIONS, payload);
    if (payload != undefined && payload.userClick) {
        dispatch(VUEX_SAVE_LIQUIDATION_OPTS)
    }
  },

  [VUEX_GET_USER_SETTINGS]: async ({commit, dispatch}) => {
    try {
        await AuthenticationService.UserSettings().then(payload => {
            commit(VUEX_SET_USER_SETTINGS, payload)
        }).then(liq => {
            dispatch(VUEX_SET_APPLY_LIQUIDATIONS_OPTIONS)
        })
    } catch (err) {
        console.log("Failed to get user settings. Contact Admin.")

    }
  },

  [VUEX_SAVE_LIQUIDATION_OPTS]: async () => {
      try {
        await LiquidationService.SaveOpts(state.liquidationVolume, state.liquidationTimeInterval).then(console.log("Setting User Options...")).then(console.log("User options successfully set."))
      } catch (err) {
          console.log("Error saving user options. Contact Admin.")
      }
  },

  [VUEX_APPEND_NEW_OHLC]: async ({ commit }, payload) => {
    commit(VUEX_APPEND_NEW_OHLC, payload);
  },

  [VUEX_SET_HISTORICAL_OHLC]: async ({ commit }, payload) => {
    commit(VUEX_SET_HISTORICAL_OHLC, payload);
  },

  [VUEX_GET_REQUEST_OHLC]: async ({ dispatch }) => {
    try {
      await Bitmex.getHistorical()
        .then(payload => {
          dispatch(VUEX_SET_HISTORICAL_OHLC, payload);
        })
        .then(dispatch(VUEX_GET_REQUEST_OHLC_SUCCESS));
    } catch (err) {
      dispatch(VUEX_GET_REQUEST_OHLC_FAILURE);
    }
  },

  [VUEX_GET_REQUEST_OHLC_SUCCESS]: async () => {
    Bitmex.connect();
  },

  [VUEX_GET_REQUEST_OHLC_FAILURE]: async () => {
    console.log("FAILED TO GET OHLC DATA CONTACT ADMIN");
  },

  [VUEX_SET_LIQUIDATION_VOLUME]: async ({ commit }, payload) => {
    commit(VUEX_SET_LIQUIDATION_VOLUME, payload);
  },

  [VUEX_SET_LIQUIDATION_TIMEINTERVAL]: async ({ commit }, payload) => {
    commit(VUEX_SET_LIQUIDATION_TIMEINTERVAL, payload);
  },


  [VUEX_SET_DEFAULT_LIQUIDATIONS]: async ({ commit, dispatch }) => {
    commit(VUEX_CLEAR_CHART_SERIES)
    commit(VUEX_CLEAR_ALL_LIQUIDATIONS)
    commit(VUEX_SET_DEFAULT_LIQUIDATIONS)

    let payload = {}
    payload['update'] = false
    payload['timeinterval'] = intervalMap[VUEX_DEFAULT_LIQUIDATION_INTERVAL]
    payload['volume'] = volumeMap[VUEX_DEFAULT_LIQUIDATION_VOLUME]
    payload[VUEX_LEVERAGES_LONG] = [25,50,100]
    payload[VUEX_LEVERAGES_SHORT] = [25,50,100]
    dispatch(VUEX_GET_REQUEST_LIQUIDATIONS, payload)
  },


  [VUEX_GET_REQUEST_LIQUIDATIONS_PROMISE]: async ({ dispatch }, payload) => {
    return new Promise(async(resolve, reject)=>{
    try {
      let timeinterval = payload.timeinterval || payload.interval;
      let volume = payload.volume;
      let exchange = "bitmex";
      let symbol = "XBTUSD";
      let update = false
      let longleverages = payload.VUEX_LEVERAGES_LONG
      let shortleverages = payload.VUEX_LEVERAGES_SHORT
      await LiquidationService.Liquidations(
        timeinterval,
        volume,
        exchange,
        symbol,
        longleverages,
        shortleverages,
        update
      ).then(payload => {
        resolve(payload)
      })
    }  catch (err) {
      reject(err)
    }
  }) 
},

  [VUEX_GET_REQUEST_LIQUIDATIONS]: async ({ dispatch }, payload) => {
    try {
      let timeinterval = payload.timeinterval;
      let volume = payload.volume;
      let exchange = "bitmex";
      let symbol = "XBTUSD";
      let update = payload.update
      let longleverages = payload.VUEX_LEVERAGES_LONG
      let shortleverages = payload.VUEX_LEVERAGES_SHORT
      await LiquidationService.Liquidations(
        timeinterval,
        volume,
        exchange,
        symbol,
        longleverages,
        shortleverages,
        update
      ).then(payload => {
        if (payload != undefined && payload.length > 0 && 'name' in payload && payload.name == "error") {
          dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_FAILURE, payload);
        }
        dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_SUCCESS, { data: payload, update: update, render: true });
      });
    } catch (err) {
      console.log(err)
      dispatch(VUEX_GET_REQUEST_LIQUIDATIONS_FAILURE, err);
    }
  },

  [VUEX_GET_REQUEST_LIQUIDATIONS_SUCCESS]: async ({ commit }, payload) => {
    commit(VUEX_SET_SIMPLE_AVERAGE_POINTS, payload);
  },

  [VUEX_GET_REQUEST_LIQUIDATIONS_FAILURE]: async err => {
    console.log("Failed to fetch simple averages. Contact admin.", err);
  },

  [VUEX_INCREMENT_LIQUIDATION_VOLUME]: async ({commit}) => {
    commit(VUEX_INCREMENT_LIQUIDATION_VOLUME)
  },

  [VUEX_DECREMENT_LIQUIDATION_VOLUME]: async ({commit}) => {
    commit(VUEX_DECREMENT_LIQUIDATION_VOLUME)
  },
  [VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL]: async ({commit}) => {
    commit(VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL)
  },
  [VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL]: async ({commit}) => {
    commit(VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL)
  },
  [VUEX_INCREMENT_LIQUIDATION_LEVERAGE]: async ({commit}) => {
    commit(VUEX_INCREMENT_LIQUIDATION_LEVERAGE)
  },
  [VUEX_DECREMENT_LIQUIDATION_LEVERAGE]: async ({commit}) => {
    commit(VUEX_DECREMENT_LIQUIDATION_LEVERAGE)
  },

  [VUEX_SET_LIQUIDATION_LEVERAGE]: async ({commit}, payload) => {
    commit(VUEX_SET_LIQUIDATION_LEVERAGE, payload)
  },
  [VUEX_CLEAR_ALL_LIQUIDATIONS]: async ({commit}) => {
    commit(VUEX_CLEAR_ALL_LIQUIDATIONS)
  },

  [VUEX_ADD_CUSTOM_LIQUIDATION_LINES]: async ({ commit, dispatch }, payload) => {
   if (state.defaultLines == true) {
      commit(VUEX_CLEAR_ALL_LIQUIDATIONS)
    }

    let volume = (payload.volume) ? payload.volume : volumeMap[state.liquidationVolume]
    let interval = (payload.timeinterval) ? payload.timeinterval : intervalMap[state.liquidationTimeInterval]
    let leverage = state.liquidationLeverage
    let seriesname = getSeriesName(volume, interval)+"ML"
    let seriesExist = seriesExists(seriesname)
    if (seriesExist) {
        state.simpleAveragePoints.forEach(series => {
          if (series.seriesname == seriesname) {
            if (series.VUEX_LEVERAGES_LONG.includes(leverage) && series.VUEX_LEVERAGES_SHORT.includes(leverage)) {
              alert("Leverage lines for both long and short exist on this TF.")
              return
            }
    
            if (series.VUEX_LEVERAGES_SHORT.includes(leverage) && payload.above == true && payload.below == false) {
              alert("Leverage line above exists on this TF.")
              return
            }
    
            if (series.VUEX_LEVERAGES_LONG.includes(leverage) && payload.above == false && payload.below == true) {
              alert("Leverage line below exists on this TF.")
              return
            }
        
            if (payload.above == true && payload.below == false) {
              if (!series.VUEX_LEVERAGES_SHORT.includes(leverage)) {
                commit(VUEX_UPDATE_MATCHED_SERIES, {series: series.VUEX_LEVERAGES_SHORT, leverage: leverage})
                let data = { data: series, render: true}
                commit(VUEX_CLEAR_CHART_SERIES)
                commit(VUEX_SET_SIMPLE_AVERAGE_POINTS, data)
              }
            }
    
            if (payload.below == true && payload.above == false) {
              if (!series.VUEX_LEVERAGES_LONG.includes(leverage)) {
                commit(VUEX_UPDATE_MATCHED_SERIES, {series: series.VUEX_LEVERAGES_LONG, leverage: leverage})
                let data = { data: series, render: true}
                commit(VUEX_CLEAR_CHART_SERIES)
                commit(VUEX_SET_SIMPLE_AVERAGE_POINTS, data)
              }
            }
    
            if (payload.below == true && payload.above == true) {
              if (!series.VUEX_LEVERAGES_SHORT.includes(leverage)) {
                commit(VUEX_UPDATE_MATCHED_SERIES, {series: series.VUEX_LEVERAGES_SHORT, leverage: leverage})
              }
              if (!series.VUEX_LEVERAGES_LONG.includes(leverage)) {
                commit(VUEX_UPDATE_MATCHED_SERIES, {series: series.VUEX_LEVERAGES_LONG, leverage: leverage})
              }
              let data = { data: series, render: true}
              commit(VUEX_CLEAR_CHART_SERIES)
              commit(VUEX_SET_SIMPLE_AVERAGE_POINTS, data)
            }
    
          }
        })
    } else {
      let newLineData = {volume: volume, timeinterval: interval, update: false}
      if (payload.below == true && payload.above == true) {
          newLineData[VUEX_LEVERAGES_LONG] = [leverage]
          newLineData[VUEX_LEVERAGES_SHORT] = [leverage]
      }

      if  (payload.below == true && payload.above == false) {
        newLineData[VUEX_LEVERAGES_LONG] = [leverage]
        newLineData[VUEX_LEVERAGES_SHORT] = []

      }

      if  (payload.below == false && payload.above == true) {
        newLineData[VUEX_LEVERAGES_SHORT] = [leverage]
        newLineData[VUEX_LEVERAGES_LONG] = []

      }
      commit(VUEX_CLEAR_CHART_SERIES)
      dispatch(VUEX_GET_REQUEST_LIQUIDATIONS, newLineData)
    
    }

  }
};

const mutations = {

  [VUEX_UNDO_MAGIC_LINE]: (state) => {
    let undoML = 1
    let undoLongs = state.storedMagicLines[state.storedMagicLines.length-1].VUEX_LEVERAGES_LONG.length
    let undoShorts = state.storedMagicLines[state.storedMagicLines.length-1].VUEX_LEVERAGES_SHORT.length
    state.undoAmount = undoLongs + undoShorts + undoML
    for (let i=1; i<=state.undoAmount; i++) {
      state.simpleAveragePoints.pop()
    }
    state.storedMagicLines.pop()
  },

  [VUEX_CREATE_PRESET_NAME]: (state) => {
    state.currentPresetName = ''
    state.simpleAveragePoints.forEach(series => {
      if (series.ml == true) {
        state.currentPresetName += series.seriesname +" / "
        state.currentPresetName = state.currentPresetName.replace("ML", "")
      }
    })
    state.currentPresetName = state.currentPresetName.substring(0, state.currentPresetName.length - 3 )
  },

  [VUEX_SET_MAGIC_PRESETS]: (state, payload) => {
    state.presets = payload
    console.log(state.presets)
  },

  [VUEX_FORCE_CHART_RENDER]: (state) => {
    state.ForceRenderChart++
  },

  [VUEX_SET_LIQUIDATION_BUBBLES]: (state, payload) => {
    let bubbles = []
    for (let i in payload){
      bubbles.push({x: payload[i].start_time, y: payload[i].price, z: Number.parseFloat(payload[i].volume)})
    }
    state.liquidationBubbles = bubbles
  },

  [VUEX_UPDATE_MATCHED_SERIES]: (state, payload) => {
    payload.series.push(payload.leverage)
  },

  [VUEX_ADD_CUSTOM_LIQUIDATION_LINES]: (state, payload) => {

  }, 

  [VUEX_CLEAR_CHART_SERIES]: (state) => {
    state.clearAllSeries++
  },

  [VUEX_CLEAR_ALL_LIQUIDATIONS]: (state) => {
    state.simpleAveragePoints = []
    state.storedMagicLines = []
    state.defaultLines = false
    state.ForceRenderChart++
  },

  [VUEX_SET_DEFAULT_LIQUIDATIONS]: (state) => {
    state.simpleAveragePoints = []
    state.storedMagicLines = []
    state.defaultLines = true
  },

  [VUEX_SET_SIMPLE_AVERAGE_POINTS]: (state, payload) => {
    try {

      // ADD BASE ML SET
      let basename =  getSeriesName(payload.data.volume, payload.data.interval) 
      payload.data['seriesname'] = basename + "ML"
      payload.data['ml'] = true
      let seriesExist = seriesExists(payload.data.seriesname)
      let seriesColor

      if (!seriesExist) {
        seriesColor = state.magiclinecolorscheme[state.magicLineColorIndex%10]
        payload.data['color'] = seriesColor
        state.magicLineColorIndex++
        state.seriesColorMap[payload.data.seriesname] = seriesColor
        state.simpleAveragePoints.push(payload.data)
        if (!magicLineExistsInStorage(payload.data.seriesname)) {
          state.storedMagicLines.push(getMagicLineObject(payload.data.seriesname, payload.data.volume, payload.data.interval, true, payload.data.VUEX_LEVERAGES_LONG, payload.data.VUEX_LEVERAGES_SHORT))
        }  
      } else {
        seriesColor = state.seriesColorMap[payload.data.seriesname]
      }
      // ADD LONG SETS
      if (payload.data.VUEX_LEVERAGES_LONG.length > 0) {
        payload.data.VUEX_LEVERAGES_LONG.forEach(leverage => {
          let longLeverageLine = { 
            seriesname: basename+leverage.toString()+"x"+"-L", 
            averages: [], 
            volume: payload.data.volume, 
            interval: payload.data.interval, 
            ml: false,
            leverage: leverage, 
            position: VUEX_LONG,
            color: seriesColor
          }
          if (!seriesExists(longLeverageLine.seriesname)) {
            payload.data.averages.forEach(average => {
              longLeverageLine.averages.push({average: getLeverage("LONG", average.average, leverage), updated: average.updated})
            })
            state.simpleAveragePoints.push(longLeverageLine)
          }
        })
      }

      //ADD SHORT SETS
      if (payload.data.VUEX_LEVERAGES_SHORT.length > 0) {
        payload.data.VUEX_LEVERAGES_SHORT.forEach(leverage => {
          let shortLeverageLine = { 
                    seriesname: basename+leverage.toString()+"x"+"-S",
                     averages: [], 
                    volume: payload.data.volume, 
                    interval: payload.data.interval, 
                    ml: false, 
                    leverage: leverage, 
                    position: VUEX_SHORT,
                    color: seriesColor
                  }
          if (!seriesExists(shortLeverageLine.seriesname)) {
            payload.data.averages.forEach(average => {
              shortLeverageLine.averages.push({average: getLeverage("SHORT", average.average, leverage), updated: average.updated})
            })
            state.simpleAveragePoints.push(shortLeverageLine)
          }
        })
      }
      if (payload.render) {
        state.ForceRenderChart++
      }

    } catch (err) {
      console.log("ERROR", err)
    }
  },

  [VUEX_APPEND_NEW_OHLC]: (state, payload) => {
    if (payload != null || payload != undefined || payload.length >= 0) {
      if (payload.timestamp == undefined) {
        return;
      }
      let newTimestamp = Math.round(
        new Date(new Date(payload.timestamp).setSeconds(0, 0)).getTime()
      );
      let newPrice = payload.price;

      if (state.ohlc.length == 0) {
        state.ohlc.push([newTimestamp, newPrice, newPrice, newPrice, newPrice]);
      }

      let mostRecentOhlc = state.ohlc[state.ohlc.length - 1];
      let mostRecentMinute = mostRecentOhlc[0];
      if (newTimestamp == mostRecentMinute) {
        let newOhlcValues = [0, 0, 0, 0, 0];
        newOhlcValues[0] = newTimestamp;
        newOhlcValues[1] = mostRecentOhlc[1];
        let unchanged = true;
        if (newPrice >= mostRecentOhlc[2]) {
          newOhlcValues[2] = newPrice;
          newOhlcValues[3] = mostRecentOhlc[3];
          newOhlcValues[4] = newPrice;
          unchanged = false;
        }

        if (newPrice <= mostRecentOhlc[3]) {
          newOhlcValues[3] = newPrice;
          newOhlcValues[2] = mostRecentOhlc[2];
          newOhlcValues[4] = newPrice;
          unchanged = false;
        }

        if (unchanged == true) {
          newOhlcValues[2] = mostRecentOhlc[2];
          newOhlcValues[3] = mostRecentOhlc[3];
          newOhlcValues[4] = newPrice;
        }
        state.ohlc.pop();
        state.ohlc.push(newOhlcValues);
      } else {
        state.ohlc.push([newTimestamp, newPrice, newPrice, newPrice, newPrice]);
        state.ohlc.shift()
      }
    }
  },

  [VUEX_SET_HISTORICAL_OHLC]: (state, payload) => {
    if (state.ohlc.length == 0) {
      payload.forEach(function(newOhlc) {
        state.ohlc.push([
          newOhlc["timestamp"],
          newOhlc["open"],
          newOhlc["high"],
          newOhlc["low"],
          newOhlc["close"]
        ]);
      });
    } else {
      state.ohlc.shift();
      let historical = payload.map(function(newOhlc) {
        return [
          newOhlc["timestamp"],
          newOhlc["open"],
          newOhlc["high"],
          newOhlc["low"],
          newOhlc["close"]
        ];
      });
      state.ohlc = historical.concat(state.ohlc);
    }

    state.historicalDataGathered = true;
  },

  [VUEX_LIQUIDATION_LEVERAGE]: (state, payload) => {
    state.liquidationLeverage = payload;
  },

  [VUEX_SET_LIQUIDATION_VOLUME]: (state, payload) => {
    state.liquidationVolume = payload;
  },
  [VUEX_SET_LIQUIDATION_TIMEINTERVAL]: (state, payload) => {
    state.liquidationTimeInterval = payload;
  },
  [VUEX_SET_USER_SETTINGS]: (state, payload) => {
      state.liquidationTimeInterval = payload[0].defaultTimeInterval
      state.liquidationVolume = payload[0].defaultVolume
  },

  [VUEX_INCREMENT_LIQUIDATION_VOLUME]: (state) => {
      state.selectedVolume++
      if (state.selectedVolume >= volumes.length) {
        state.selectedVolume = volumes.length
      }
      state.liquidationVolume = volumes[state.selectedVolume].display
  },
  [VUEX_DECREMENT_LIQUIDATION_VOLUME]: (state) => {
      state.selectedVolume--
      if (state.selectedVolume <= 0) {
        state.selectedVolume = 0
      }
      state.liquidationVolume = volumes[state.selectedVolume].display
  },
  [VUEX_INCREMENT_LIQUIDATION_TIMEINTERVAL]: (state) => {
      state.selectedInterval++
      if (state.selectedInterval >= timeIntervals.length) {
        state.selectedInterval = timeIntervals.length
      }
      state.liquidationTimeInterval = timeIntervals[state.selectedInterval].display
  },
  [VUEX_DECREMENT_LIQUIDATION_TIMEINTERVAL]: (state) => {
      state.selectedInterval--
      if (state.selectedInterval <= 0) {
        state.selectedInterval = 0
      }
      state.liquidationTimeInterval = timeIntervals[state.selectedInterval].display
  },
  [VUEX_INCREMENT_LIQUIDATION_LEVERAGE]: (state) => {
      state.liquidationLeverage = 25
  },

  [VUEX_DECREMENT_LIQUIDATION_LEVERAGE]: (state) => {
      state.liquidationLeverage = 100
  },

  [VUEX_SET_LIQUIDATION_LEVERAGE]: (state, payload) => {
    if (!isNaN(payload)) {
      payload = parseInt(payload)
      if (payload >= 0 && payload <= 100) {
        state.liquidationLeverage = payload
      }
    }
  },
  [VUEX_TOGGLE_CROSSHAIR]: (state) => {
    state.crosshair++
  },

  [VUEX_UPDATE_MAGIC_LINES_SUCCESS]: (state, payload) => {
    state.magicUpdateCounter++
    try {
      state.simpleAveragePoints.forEach(magicline => {


        if (magicline.ml == true && magicline.interval == payload.data.interval && magicline.volume == payload.data.volume) {
          payload.data.averages.forEach(update => {
            magicline.averages.push(update)
            if (magicline.averages.length > 500) {
              magicline.averages.shift()
            }

            // UPDATE LONGS
            payload.data.VUEX_LEVERAGES_LONG.forEach(leverage => {
              let leveragePt = getLeverage(VUEX_LONG, update.average, leverage)
              state.simpleAveragePoints.forEach(nextMagicLine => {
                if (nextMagicLine.ml == false && nextMagicLine.leverage == leverage && nextMagicLine.volume == payload.data.volume && nextMagicLine.interval == payload.data.interval && nextMagicLine.position == VUEX_LONG) {
                  nextMagicLine.averages.push({average: leveragePt, updated: update.updated})
                  if (nextMagicLine.averages.length > 500) {
                    nextMagicLine.averages.shift()
                  }
                }
              })
            })

            //UPDATE SHORTS 

            payload.data.VUEX_LEVERAGES_SHORT.forEach(leverage => {
              let leveragePt = getLeverage(VUEX_SHORT, update.average, leverage)
              state.simpleAveragePoints.forEach(nextMagicLine => {
                if (nextMagicLine.ml == false && nextMagicLine.leverage == leverage && nextMagicLine.volume == payload.data.volume && nextMagicLine.interval == payload.data.interval && nextMagicLine.position == VUEX_SHORT) {
                  nextMagicLine.averages.push({average: leveragePt, updated: update.updated})
                  if (nextMagicLine.averages.length > 500) {
                    nextMagicLine.averages.shift()
                  }
                }
              })
            })
          })
        }
        // Flatten most recent data point to current time to keep chart current ~20 sec difference no data integrity loss
        magicline.averages[magicline.averages.length-1].updated = Math.round(new Date().setSeconds(0,0))
      })
      state.updateMagicLines++
    } catch (err) {
      console.log(err)
    }

  },

  [VUEX_UPDATE_MAGIC_LINES_FAILURE]: (state, payload) => {
    console.log("ML UPDATE FAILED", payload)
  },
};

function getLeverage(position, price, leverage) {
  let mmr = 0.5 / 100;
  let result = 0
  let lev = leverage
  let avgPrice = price
  if (position == "LONG") {
    result = (avgPrice * lev) / (lev + 1 - mmr * lev);
  } else {
    result = (avgPrice * lev) / (lev - 1 + mmr * lev);
  }
  return +result.toFixed(2);
}

function getSeriesName(volume, interval) {
  return Object.keys(volumeMap).find(key => volumeMap[key] === volume) + Object.keys(intervalMap).find(key => intervalMap[key] === interval)
}

function seriesExists(seriesname) {
  let seriesExist = false
  state.simpleAveragePoints.forEach(series => {
    if (series.seriesname == seriesname) {
      seriesExist = true
    }
  })
  return seriesExist
}

function getStoredMagicLines(){
  let storedMagiclines = JSON.parse(localStorage.getItem('vuex'))
  if (storedMagiclines && storedMagiclines.storedMagicLines) {
    return storedMagiclines.storedMagicLines
  } else {
    return []
  }
}

function magicLineExistsInStorage(seriesname) {
  let exists = false
  state.storedMagicLines.forEach(series => {
    if (series.seriesname == seriesname) {
      exists = true
    }
  })
  return exists
}
function getMagicLineObject(seriesname, volume, interval, ml, longs, shorts){
  return {seriesname: seriesname, timeinterval: interval, volume:volume, ml: ml, VUEX_LEVERAGES_LONG: longs, VUEX_LEVERAGES_SHORT: shorts, update: false, stored: true}
}


export default {
  state,
  getters,
  actions,
  mutations
};
