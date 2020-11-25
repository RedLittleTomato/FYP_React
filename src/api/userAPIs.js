import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
})

function options(token) {
  const options = {
    headers: {
      "x-access-token": token
    },
  }
  return options
}


export const login = payload => api.post(`/login`, payload)
// export const logout = payload => api.get(`/logout`, payload) ==> direct clear localstorage
export const register = payload => api.post(`/register`, payload)
export const forgotPassword = payload => api.post(`/forgotpassword`, payload)
export const resetValidation = token => api.get(`/reset/${token}`)
export const updatePassword = payload => api.put(`/updatepassword`, payload)

// auth
export const checkSavedFlyer = query => api.get(`/checksavedflyer`, { ...query, ...options(localStorage.getItem('token')) })
export const saveFlyer = payload => api.put(`/saveflyer`, payload, options(localStorage.getItem('token')))

const apis = {
  login,
  // logout,
  register,
  forgotPassword,
  resetValidation,
  updatePassword,

  //auth
  checkSavedFlyer,
  saveFlyer
}

export default apis