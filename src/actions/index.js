import { Masq } from '../library'

const masq = new Masq()
masq.initDatabases()

const addUser = user => ({
  type: 'ADD_USER',
  user
})

const receiveUsers = users => ({
  type: 'RECEIVE_USERS',
  users
})

const addApp = (name) => ({
  type: 'ADD_APP',
  app: { title: name, description: 'Maps by Qwant', color: '#a3005c' }
})

export const signin = user => ({
  type: 'SIGNIN',
  user
})

export const signout = () => ({
  type: 'SIGNOUT'
})

export const updateUser = (id, user) => {
  console.log('action updateUser', id, user)
  return function (dispatch) {
    return masq.updateUser(id, user)
      .then(() => dispatch(signin(user)))
  }
}

export const signup = user => {
  return function (dispatch) {
    return masq.addUser(user)
      .then(() => dispatch(addUser(user)))
  }
}

export const fetchUsers = () => {
  console.log('action fetchUsers')
  return function (dispatch) {
    return masq.getUsers()
      .then(users => dispatch(receiveUsers(users)))
  }
}

export const fetchApps = () => {
  console.log('action fetchApps')
  return function (dispatch) {
    return masq.getApps()
      .then(apps => {
        apps.forEach(app => dispatch(addApp(app)))
      })
  }
}

export const setCurrentAppRequest = app => {
  console.log('setCurrentAppRequest')
  return {
    type: 'SET_CURRENT_APP_REQUEST',
    app
  }
}

export const createAppDB = (name, channel) => {
  console.log('createAppDB', name, channel)
  return function (dispatch) {
    return masq.createApp(name, channel, () => {
      console.log('okok')
    })
  }
}
