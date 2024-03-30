import { Units } from "./UnitsInterfase"

interface Tarif {
  type: number,
  expir: string,
  count: number
}

interface User {
  id: number,
  name: string,
  email: string,
  tarif?: Tarif,
  discount: number
}

interface Limit {
  items: number,
  loads: number,
  projects: number,
  templates: number,
  irows: number
}

interface Stats {
  login: number,
  templates: number,
  projects: number,
  counts: number
}

interface Company {
  redn: number,
  name: string,
  regn: number,
  ogrn: number,
  address: string,
  manager: string,
  longtext: string
}

interface Config {
  user: User,
  tarif: Tarif,
  limit: Limit,
  units: {
    cargo: Units,
    loads: Units
  },
  last_project: number,
  stats: Stats,
  company: Company
}

export {
  Tarif,
  User,
  Limit,
  Stats,
  Company,
  Config
}
