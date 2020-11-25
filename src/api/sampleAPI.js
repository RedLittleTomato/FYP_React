import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export const addNewUser = payload => api.post(`/user`, payload)
export const getAllMovies = () => api.get(`/movies`)
export const updateMovieById = (id, payload) => api.put(`/movie/${id}`, payload)
export const deleteMovieById = id => api.delete(`/movie/${id}`)
export const getMovieById = id => api.get(`/movie/${id}`)

const apis = {
  addNewUser,
  getAllMovies,
  updateMovieById,
  deleteMovieById,
  getMovieById,
}

export default apis