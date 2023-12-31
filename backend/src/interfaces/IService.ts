interface ServiceError {
  status: 'INVALID' | 'NOT_FOUND' | 'ERROR'
  data: { message: string }
}

interface ServiceSuccess<T> {
  status: 'SUCCESS' | 'CREATED' | 'DELETED' | 'UPDATED'
  data: T
}

type ServiceResult<T> = ServiceError | ServiceSuccess<T>

export default ServiceResult
