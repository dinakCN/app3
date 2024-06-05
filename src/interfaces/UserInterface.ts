import { Units } from "./UnitsInterfase"


interface User {
  id: number;
  name: string;
  email: string;
  discount: number;
  tarif: Tarif
}

interface Limit {
  items: number;
  loads: number;
  projects: number;
  templates: number;
  irows: number;
}

interface UnitDetails {
  size: string;
  wght: string;
}

interface UnitDetails {
  cargo: Units;
  loads: Units;
}

interface Stats {
  login: number;
  templates: number;
  projects: number;
  counts: number;
}

interface Company {
  redn: boolean;
  name: string;
  regn: string;
  ogrn: string;
  address: string;
  manager: string;
  longtext: string;
}

interface Config {
  user: User;
  tarif: Tarif;
  limit: Limit;
  units: UnitDetails;
  last_project: number;
  stats: Stats;
  company: Company;
}
interface Tarif {
  type: number,
  expir: string,
  count: number
}

export {
  Tarif,
  User,
  Limit,
  Stats,
  Company,
  Config
}
