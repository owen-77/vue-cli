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

export const userStateApi = (params) => {
  return axios.put(`users/${params.id}/state/${params.mg_state}`)
}

export const addUserApi = (params) => {
  return axios.post('users', params)
}

export const findUserApi = (params) => {
  return axios.get(`users/${params.id}`)
}

export const exidUserApi = (params) => {
  return axios.put(`users/${params.id}`, { email: params.email, mobile: params.mobile })
}

export const delUserApi = (params) => {
  return axios.delete(`users/${params}`)
}

export const setUserRoleApi = (params) => {
  return axios.put(`users/${params.id}/role`, { rid: params.rid })
}

export const roleListApi = (params) => {
  return axios.get('roles')
}

export const addRoleApi = (params) => {
  return axios.post('roles', params)
}

export const findRoleApi = (params) => {
  return axios.get(`roles/${params}`)
}

export const editRoleApi = (params) => {
  return axios.put(`roles/${params.roleId}`, { roleName: params.roleName, roleDesc: params.roleDesc })
}

export const delRoleApi = (params) => {
  return axios.delete(`roles/${params}`)
}

export const rightListApi = (params) => {
  return axios.get(`rights/${params}`)
}

export const delRightApi = (params) => {
  return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`)
}

export const setRightApi = (params) => {
  return axios.post(`roles/${params.roleId}/rights`, { rids: params.rids })
}

export const cateListApi = (params) => {
  return axios.get('categories', { params })
}

export const addCateApi = (params) => {
  return axios.post('categories', params)
}

export const getCateApi = (params) => {
  return axios.get(`categories/${params}`)
}

export const editCateApi = (params) => {
  return axios.put(`categories/${params.id}`, { cat_name: params.cat_name })
}

export const delCateApi = (params) => {
  return axios.delete(`categories/${params.id}`)
}

export const cateParamsApi = (params) => {
  return axios.get(`categories/${params.id}/attributes`, { params: { sel: params.sel } })
}

export const addParamsApi = (params) => {
  return axios.post(`categories/${params.id}/attributes`, {
    attr_name: params.attr_name,
    attr_sel: params.attr_sel,
    attr_vals: params.attr_vals
  })
}

export const findIdParamsApi = (params) => {
  return axios.get(`categories/${params.id}/attributes/${params.attrId}`, { params: { attr_sel: params.attr_sel, attr_vals: params.attr_vals } })
}

export const editParamsApi = (params) => {
  return axios.put(`categories/${params.cat_id}/attributes/${params.attr_id}`, { attr_name: params.attr_name, attr_sel: params.attr_sel, attr_vals: params.attr_vals })
}

export const delParamsApi = (params) => {
  return axios.delete(`categories/${params.cat_id}/attributes/${params.attr_id}`)
}

export const goodsListApi = (params) => {
  return axios.get('goods', { params })
}

export const delGoodsApi = (params) => {
  return axios.delete(`goods/${params}`)
}
