import axios from 'axios';

const url_mdrinterval = 'api/mdr/interval'
const url_mdrlive = 'api/mdr/live'
const url_mdrsave = 'api/mdr/save'

class MDRService {

    // Gauges
    static MDR( symbol, exchanges, timeIntervals, percentsAway) {
        
        return new Promise(async(resolve, reject)=>{
            try {
                let body = {
                    "timeIntervals": timeIntervals,
                    "symbol":symbol,
                    "exchanges":exchanges,
                    "percentsAway": percentsAway
                }
                const res = await axios.post(url_mdrinterval, {
                    "timeIntervals": timeIntervals,
                    "symbol":symbol,
                    "exchanges":exchanges,
                    "percentsAway": percentsAway
                })
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
    static MDRLive( symbol, exchanges, timeIntervals, percentsAway) {
        return new Promise(async(resolve, reject)=>{
            try {
                const res = await axios.post(url_mdrlive, {
                    "timeIntervals": timeIntervals,
                    "symbol":symbol,
                    "exchanges":exchanges,
                })
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

    static MDRSave ( symbol, exchanges, timeIntervals, percentsAway) {
        return new Promise(async(resolve, reject)=>{
            try {
                const res = await axios.post(url_mdrsave, {
                    "timeIntervals": timeIntervals,
                    "symbol":symbol,
                    "exchanges":exchanges,
                    "percentsaway": percentsAway
                })
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
}


export default MDRService