import store from '@/store'
import { VUEX_APPEND_NEW_OHLC } from '../store/constants/bitmex'
import axios from 'axios';

const url = '/api/bitmex'

const side = {"buy": 1, "sell": 0}

class Bitmex {
    
    static getHistorical() {
        return new Promise(async(resolve, reject)=>{
            try {
                const res = await axios.get(`${url}/ohlc`)
                const data = res.data
                if (data.error) {
                    reject(data.error)
                }
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    static connect() {
        const socket = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD,liquidation:XBTUSD')
        try{ 
        socket.onmessage = (event) => {
            let data = JSON.parse(event.data)
            if (data.data != undefined && data.data[0] != undefined) {
                store.dispatch(VUEX_APPEND_NEW_OHLC, data.data[0]) 
            }
        }
        } catch(err) {}
    }
    
}

export default Bitmex