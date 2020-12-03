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

// sample
export const getImageById = id => api.get(`/image/${id}`)
export const getAllImages = () => api.get(`/images`)
export const addNewImage = payload => api.post(`/image`, payload)
export const updateImageById = (id, payload) => api.put(`/image/${id}`, payload)
export const deleteImageById = id => api.delete(`/image/${id}`)

export const getPreviewFlyer = id => api.get(`/flyer/preview/${id}`)

// auth
export const getFlyer = id => api.get(`/flyer/${id}`, options(localStorage.getItem('token')))
export const getFlyers = () => api.get(`/flyers`, options(localStorage.getItem('token')))
export const getLatestFlyers = () => api.get(`/flyers/latest`, options(localStorage.getItem('token')))
export const getTemplateFlyers = () => api.get(`/flyers/template`, options(localStorage.getItem('token')))
export const getSavedFlyers = () => api.get(`/flyers/saved`, options(localStorage.getItem('token')))
export const createNewFlyer = payload => api.post(`/flyer`, payload, options(localStorage.getItem('token')))
export const saveFlyerChanges = payload => api.put(`/flyer`, payload, options(localStorage.getItem('token')))
export const saveFlyerDetailsChanges = payload => api.put(`/flyer/details`, payload, options(localStorage.getItem('token')))
export const likeFlyer = payload => api.put(`/flyer/like`, payload, options(localStorage.getItem('token')))
export const deleteFlyer = id => api.delete(`/flyer/${id}`, options(localStorage.getItem('token')))

const apis = {
  getImageById,
  getAllImages,
  addNewImage,
  updateImageById,
  deleteImageById,

  getPreviewFlyer,

  getFlyer,
  getFlyers,
  getLatestFlyers,
  getTemplateFlyers,
  getSavedFlyers,
  createNewFlyer,
  saveFlyerChanges,
  saveFlyerDetailsChanges,
  likeFlyer,
  deleteFlyer
}

export default apis