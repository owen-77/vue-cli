import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token
  return config
})

export const loginApi = params => {
  return axios.post('login', params)
}

export const homeMenuApi = () => {
  return axios.get('menus')
}

export const userListApi = (params) => {
  return axios.get('users', { params })
}
