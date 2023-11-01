export interface IStudent {
  name: string
  school: string
  email: string
  password?: string
  confirmPassword?: string
  role?: string
  accepted?: boolean
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
