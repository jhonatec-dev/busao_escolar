interface ITravelStudent {
  _id: string;
  name: string;
  email: string;
  school: string;
  approved: boolean;
}

interface ITravelDay {
  day: number;
  active: boolean;
  busSits: number;
  observations: string;
  frequentStudents: ITravelStudent[];
  otherStudents: ITravelStudent[];
}

interface ITravel {
  _id?: string;
  year: number;
  month: number;
  days: ITravelDay[];
}

interface ITravelService {
  _id?: string;
  year: number;
  month: number;
  days: number[];
}

export type { ITravel, ITravelDay, ITravelService, ITravelStudent };
