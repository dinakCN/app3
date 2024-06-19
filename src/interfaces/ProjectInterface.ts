import { Units } from "./UnitsInterfase"

interface PointInterface {
  id:   number,
  view: boolean,
  mini: boolean,
  color: string,
  name:  string
}

interface ItemInterface {
  id?: number,
  nm?: string,
  ln?: number,
  wd?: number,
  hg?: number,
  wg?: number,
  cn?: number,
  pg?: number,
  st?: number,
  lm?: number,
  rt?: number,
  ov?: number,
  cr?: string,
  un?: Units,
  point?: number
  icon?: string;
  vl?: number;
  wf?: string;
  tt?: string;
  sz?: string;
  attr?: {
    st?: string;
    lm?: string;
    rt?: string;
    ov?: string;
  };
}

interface LoadInterface {
  id: number,
  nm: string,
  tp: number,
  un: Units,
  ax: boolean,
  ex: number,
  icon?: string,
  tt?: string,
  vl?: number,
  wf?: number,
  sz?: string,
  base?:{
    wg: number,
    ln: number,
    hg: number,
    wd: number,
  },
  size?:{

  },
  adds?:{
    wg: number,
    ln: number,
    hg: number,
    wd: number,
  },
  as?:{
    base?:{
      tt?: {
        a?: number,
        l?: number,
        wg?: number,
        l1?: number,
        n1?: number,
        n2?: number,
        n1max?: number,
        n2max?: number,
      },
      pp?: {
        a?: number,
        l?: number,
        wg?: number,
        l1?: number,
        l2?: number,
        l3?: number,
        n2?: number,
        n1max?: number,
        n2max?: number,
      },
    },
  },
}

interface ProjectInterface {
  id: number,
  add_time: Date,
  status: number,
  user_id: number,
  name: string,
  json_data: string,
  last_modified: Date,
  cargo?: {
    point: Array<PointInterface>,
    items: Array<ItemInterface>,
  },
  loads?: Array<LoadInterface>
}

export {
  PointInterface,
  ItemInterface,
  LoadInterface,
  ProjectInterface
}
