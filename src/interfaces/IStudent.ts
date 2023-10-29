interface IStudent {
  name: string;
  school: string;
  email: string;
  password?: string;
  role: string;
  frequency: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}
