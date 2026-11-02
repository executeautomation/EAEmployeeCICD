export type EmployeeData = {
  name: string;
  email: string;
  age: number;
  salary: number;
  months: number;
  grade: 1 | 2 | 3 | 4;
};

export const employees: EmployeeData[] = [
  { name: 'Ann Alpha', email: 'ann.alpha@team-a.example', age: 18, salary: 1000, months: 6, grade: 1 },
  { name: 'Anna Beta', email: 'anna.beta@team-a.example', age: 29, salary: 2000, months: 12, grade: 2 },
  { name: 'Anne Gamma', email: 'anne.gamma@team-b.example', age: 30, salary: 3000, months: 18, grade: 3 },
  { name: 'Jo Ann', email: 'jo.ann@team-a.example', age: 39, salary: 4000, months: 24, grade: 4 },
  { name: 'Ben Delta', email: 'ben.delta@team-a.example', age: 40, salary: 5000, months: 30, grade: 1 },
  { name: 'Cara Echo', email: 'cara.echo@team-b.example', age: 49, salary: 6000, months: 36, grade: 2 },
  { name: 'Dev Foxtrot', email: 'dev.foxtrot@team-a.example', age: 50, salary: 7000, months: 42, grade: 3 },
  { name: 'Eli Golf', email: 'eli.golf@team-b.example', age: 54, salary: 8000, months: 48, grade: 4 },
  { name: 'Fay Hotel', email: 'fay.hotel@team-a.example', age: 55, salary: 9000, months: 54, grade: 1 },
  { name: 'Gus India', email: 'gus.india@team-b.example', age: 59, salary: 10000, months: 60, grade: 2 },
  { name: 'Hana Juliet', email: 'hana.juliet@team-a.example', age: 60, salary: 11000, months: 66, grade: 3 },
  { name: 'Ivo Kilo', email: 'ivo.kilo@team-b.example', age: 100, salary: 12000, months: 72, grade: 4 }
];

export const expected = {
  total: 12,
  salarySum: 78_000,
  averageSalary: 6_500,
  averageAge: '48.6',
  ageBands: [2, 2, 2, 4, 2],
  grades: [3, 3, 3, 3]
};
