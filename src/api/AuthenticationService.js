import axios from 'axios';
const hash = require('node_hash')
const url = 'api/authentication'

class AuthenticationService {

    // Register
    static Register(username, password, regToken) {
        return new Promise(async(resolve, reject)=>{
            try {
                const hashed_password = hash.md5(password)
                const res = await axios.post(`${url}/register`, {
                    username,
                    hashed_password,
                    regToken
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

    // Login
    static Login(username, password) {
        return new Promise(async (resolve, reject) => {  
            try {
                const hashed_password = hash.md5(password)
                const res = await axios.post(`${url}/login`, {
                    username,
                    hashed_password
                })
                const data = res.data;
                if (data.error) {
                    reject(data.error)
                }
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    //Get User Settings
    static UserSettings() {
        return new Promise(async (resolve, reject) => {
            try{ 
                const res = await axios.get(`${url}/usersettings`, {
                    headers : {
                        Authorization: localStorage.getItem('token')
                    }
                })
                const data = res.data;
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }
}

export default AuthenticationService