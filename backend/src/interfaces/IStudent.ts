export interface IStudent {
  _id?: string
  name: string
  school: string
  email: string
  password?: string
  role: string
  accepted: boolean
  frequency: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
}
