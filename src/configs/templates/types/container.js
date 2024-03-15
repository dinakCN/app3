const standart =  [
  {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '20\'DC стандартный (Dry Cube)'],
    data: {
      nm: ['templates.contr', '20\'DC стандартный (Dry Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 5905,
        wd: 2330,
        hg: 2381,
        wg: 28335
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '20\'HC высокий контейнер (High Cube)'],
    data: {
      nm: ['templates.contr', '20\'HC высокий контейнер (High Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 5905,
        wd: 2330,
        hg: 2693,
        wg: 28140
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '40\'DV стандартный (Dry Van)'],
    data: {
      nm: ['templates.contr', '40\'DV стандартный (Dry Van)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 12039,
        wd: 2330,
        hg: 2372,
        wg: 26840
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '40\'HC высокий контейнер (High Cube)'],
    data: {
      nm: ['templates.contr', '40\'HC высокий контейнер (High Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 12039,
        wd: 2330,
        hg: 2693,
        wg: 26840
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '40\'HCPW высокий широкий (High Cube Pallet Wide)'],
    data: {
      nm: ['templates.contr', '40\'HCPW высокий широкий (High Cube Pallet Wide)'],    
      tp: 1,
      ex: 0,
      base: {
        ln: 12039,
        wd: 2432,
        hg: 2698,
        wg: 30720
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '45\'HCPW высокий широкий (High Cube Pallet Wide) 9\'1" (2,75м)'],
    data: {
      nm: ['templates.contr', '45\'HCPW высокий широкий (High Cube Pallet Wide) 9\'1" (2,75м)'],    
      tp: 1,
      ex: 0,
      base: {
        ln: 13513,
        wd: 2444,
        hg: 2549,
        wg: 29750
      }
    }
  }, {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '45\'HCPW высокий контейнер (High Cube Pallet Wide) 9\'6" (2,90м)'],
    data: {
      nm: ['templates.contr', '45\'HCPW высокий контейнер (High Cube Pallet Wide) 9\'6" (2,90м)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 13513,
        wd: 2444,
        hg: 2670,
        wg: 29750
      }
    }
  }
]

const frigo = [
  {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '20\'RC стандартный рефконтейнер (Reefer Cube)'],
    data: {
      nm: ['templates.contr', '20\'RC стандартный рефконтейнер (Reefer Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 5513,
        wd: 2286,
        hg: 2269,
        wg: 21950
      }
    }
  },
  {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '20\'RHC высокий рефконтейнер (Reefer High Cube)'],
    data: {
      nm: ['templates.contr', '20\'RHC высокий рефконтейнер (Reefer High Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 5513,
        wd: 2286,
        hg: 2585,
        wg: 22200
      }
    }
  },
  {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '40\'RC высокий рефконтейнер (Reefer Cube)'],
    data: {
      nm: ['templates.contr', '40\'RC высокий рефконтейнер (Reefer Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 11638,
        wd: 2282,
        hg: 2252,
        wg: 27790
      }
    }
  },
  {
    add_time: '2021-07-01 00:00:00',
    gr: 0,
    nm: ['templates.contr', '40\'RHC высокий рефконтейнер (Reefer High Cube)'],
    data: {
      nm: ['templates.contr', '40\'RHC высокий рефконтейнер (Reefer High Cube)'],
      tp: 1,
      ex: 0,
      base: {
        ln: 11638,
        wd: 2286,
        hg: 2585,
        wg: 27790
      }
    }
  }
]

const containers = [...standart, ...frigo]

export { containers }