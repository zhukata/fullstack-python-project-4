import { AxiosError } from 'axios'

export default (error) => {
  if (error.name === 'Error') {
    console.error(`System error: ${error.message}`)
  }
  else if (error instanceof AxiosError) {
    if (error.response && error.response.status !== 200) {
      console.error(`Axios error: The request was made and the server responded with a status code ${error.response.status}`)
    }
    else if (error.request) {
      console.error('Axios error: The request was made but no response was received')
    }
    else {
      console.error('Axios error: Something happened in setting up the request that triggered an error')
    }
  }
  else {
    console.error(`Unknown error: ${error.message}`)
  }
}
