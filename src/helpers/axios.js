import axios from 'axios'
import { set } from 'lodash'

export const setDefaults = ({ headers, baseURL } = { headers: [], baseURL: '' }) => {
  axios.defaults.baseURL = baseURL

  for (const headerKey in headers) set(axios.defaults.headers, headerKey, headers[headerKey])
}
