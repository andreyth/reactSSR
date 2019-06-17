
import loadable from '@loadable/component'

import { loadInit as loadUsers } from 'client/ducks/teste'
// import requiresAuth from 'client/hoc/requiresAuth'

const Home = loadable(() => import('client/pages/Home'))
// const Login = loadable(() => import('pages/Login'))
const Teste = loadable(() => import('client/pages/Teste'))
const NotFound = loadable(() => import('client/pages/NotFound'))

const routes = [
  { path: '/', exact: true, component: Home },
  // { path: '/login', exact: true, component: Login },
  { path: '/teste', exact: true, component: Teste, loadData: loadUsers() },
  { path: '/*', exact: true, component: NotFound }
]

export default routes
