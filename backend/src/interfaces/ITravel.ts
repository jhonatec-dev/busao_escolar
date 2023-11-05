interface ITravelStudent {
  id: string
  name: string
  email: string
  approved: boolean
}

interface ITravelDay {
  day: number
  active: boolean
  observations: string
  frequentStudents: ITravelStudent[]
  otherStudents: ITravelStudent[]
}

interface ITravel {
  _id?: string
  busSits: number
  year: number
  month: number
  days: ITravelDay[]
}

interface ITravelService {
  _id?: string
  busSits: number
  year: number
  month: number
  days: number[]
}

export type { ITravel, ITravelDay, ITravelService, ITravelStudent }
