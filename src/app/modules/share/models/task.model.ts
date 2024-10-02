export interface ISkill {
  name: string;
}

export interface IPerson {
  showDetails?: any;
  personId: string;
  fullName: string;
  age: number;
  skills: ISkill[];
  completed: boolean;
}

export interface ITask {
  _id: string;
  name: string;
  dueDate: Date;
  completed: boolean;
  persons: IPerson[];
  userId: string;
}
