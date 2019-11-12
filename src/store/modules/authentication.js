import {
    VUEX_POST_USER_LOGIN_REQUEST,
    VUEX_POST_USER_LOGIN_REQUEST_SUCCESS,
    VUEX_POST_USER_LOGIN_REQUEST_FAILURE,
    VUEX_POST_USER_LOGOUT,
    VUEX_SET_USER_AUTHENTICATED,
    VUEX_POST_USER_REGISTER_REQUEST,
    VUEX_POST_USER_REGISTER_REQUEST_SUCCESS,
    VUEX_POST_USER_REGISTER_REQUEST_FAILURE,
} from '@/store/constants/authentication'

import {
    VUEX_PAGE_NAME,
} from '@/store/constants/ui'

import AuthenticationService from '@/api/AuthenticationService'
import { router } from "../../main"

const state = {
    username: null,
    userId: null,
    authenticated: false
}

const getters = {

}

const actions = {

    [VUEX_POST_USER_LOGIN_REQUEST]: async ({ commit, dispatch }, payload) => {
        try {
            await AuthenticationService.Login(payload.username, payload.password).then( payload => {
                commit(VUEX_POST_USER_LOGIN_REQUEST_SUCCESS, payload)
                commit(VUEX_PAGE_NAME, 'Liquidation Options')
                router.push('/liquidations')
            })
            } catch(err) {
                commit(VUEX_POST_USER_LOGIN_REQUEST_FAILURE, err)
          }
    },

    [VUEX_POST_USER_LOGOUT]: async({ commit }) => {
        commit(VUEX_POST_USER_LOGOUT)
        router.push('/login')
    },

    [VUEX_SET_USER_AUTHENTICATED]: async({ commit }, payload) => {
        commit(VUEX_SET_USER_AUTHENTICATED, payload)
    },

    [VUEX_POST_USER_REGISTER_REQUEST]: async({ commit }, payload) => {
        try {
            await AuthenticationService.Register(payload.username, payload.password, payload.regToken).then(payload => {
                if ('error' in payload) {
                    throw payload.error
                } 
                commit(VUEX_POST_USER_REGISTER_REQUEST_SUCCESS, payload)
                router.push('/login')
            })
        } catch (err) {
            commit(VUEX_POST_USER_REGISTER_REQUEST_FAILURE, err)
        }

    }

}

const mutations = {

    [VUEX_POST_USER_LOGIN_REQUEST_SUCCESS]: (state, payload) => {
        state.userId = payload.user._id
        state.username = payload.user.username
        localStorage.setItem('token', payload.token)
        localStorage.setItem('user', JSON.stringify(payload.user))
    },

    [VUEX_POST_USER_LOGIN_REQUEST_FAILURE]: (state, payload) => {
        alert(payload)
        state.error = payload
        state.authenticated = false
    },

    [VUEX_POST_USER_LOGOUT]: (state) => {
        state.userId = null
        state.username = null
        localStorage.removeItem('token')
        state.authenticated = false
    },

    [VUEX_SET_USER_AUTHENTICATED]: (state, payload) => {
        state.authenticated = payload
    },

    [VUEX_POST_USER_REGISTER_REQUEST_SUCCESS]: (state, payload) => {
        return
    },

    [VUEX_POST_USER_REGISTER_REQUEST_FAILURE]: (state, payload) => {
        alert(payload)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}