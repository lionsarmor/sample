import Login from '../components/Login'
import Register from '../components/Register'
import liquidationLayoutPage from '../pages/liquidationLayoutPage'


const routes = [
    { path: '/', name: '/', component: Login },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/liquidations', name: 'liquidations', component: liquidationLayoutPage, meta: {requiresAuth: true} },
  ]

export default routes