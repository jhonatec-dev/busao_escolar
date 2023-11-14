type request = 'travel' | 'profile'

interface IRequest {
  name: string
  date: string
  request: request
}

export default IRequest
