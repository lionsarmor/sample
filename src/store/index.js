import Vuex from 'vuex'
import Vue from 'vue'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

//Modules
import authentication from '@/store/modules/authentication'
import bitmex from '@/store/modules/bitmex'
import ui from '@/store/modules/ui'


const debug = process.env.NODE_ENV !== 'production'


/**
 * The root module of our Vuex store
 * @module store
 */
export default new Vuex.Store({ 
    modules:{
        authentication,
        bitmex,
        ui
    },
    strict: debug,
    plugins: [createPersistedState({
        reducer: (state) => ({
            storedMagicLines: state.bitmex.storedMagicLines
        }),
    })]
	//plugins: process.env.NODE_ENV === 'development' ? [createLogger({ 'collapsed': true })] : []
})