export default {
  update: {
    text: 'Доступно обновление приложения',
    btn: 'Обновить'
  },
  tooltips: {
    scene: {
      download: 'Скриншот сцены',
      share: 'Поделиться текущей сценой',
      menu: 'Меню сцены погрузки',
      reset: 'Обновить расчет загрузки'
    }
  },
  promtp: {
    page: {
      cargo: 'Добавьте еще груз или перейдите на страницу "Выбор транспорта"',
      loads: 'Добавьте еще транспорт или перейдите на страницу "Расчет загрузки"'
    }
  },
  title: {
    layout: 'Планировщик грузового пространства онлайн'
  },
  brief: {
    promo: 'Быстрый обзор приложения',
    start: 'Просмотр',
    cargolist: 'Работа со списком грузов',
    loadslist: 'Работа со списком транспорта',
    getscene: 'Работа со сценой',
    projects: 'Управление проектами',
    cargoimport: 'Импорт грузов из файла',
    cargoadd: 'Добавление груза',
    loadsadd: 'Добавление транспорта'
  },
  'common': {
    'all_edit': 'Массовое редактирование мест груза',
    'pass': 'Пропуск',
    'null': '-',
    'edit':'Редактировать',
    'jet': 'Jet',
    'loader': 'Loader',
    'open': 'Открыть',
    'or': 'или',
    'add': 'Добавить',
    'check': 'Проверить',
    'from': 'от',
    'add_time': 'Добавлено',
    'description': 'Описание',
    'delete': 'Удалить',
    'copy': 'Копировать',
    'close': 'Закрыть',
    'refresh': 'Очистить',
    'back': 'Назад',
    'title': 'заглавие',
    'faq': 'часто задаваемые вопросы',
    'contact': 'Связаться с нами',
    'tos': 'условия обслуживания',
    'policy': 'политика конфиденциальности',
    'save': 'Сохранить',
    'cancel': 'Отменить',
    'additional': 'Дополнительно',
    'search': 'Поиск',
    'finder': 'Найти',
    'filter': 'Фильтр',
    'move': 'Переместить',
    'nodata': 'Нет записей',
    'noresult': 'Ничего не найдено',
    'help': 'Помощь',
    'selectall': 'выбрать все',
    'total': 'Всего',
    'totally': 'Итого',
    'totalneed': 'Требуется',
    'selected': 'Выбрано',
    'yes': 'Да',
    'ok': 'Ок',
    'no': 'Нет',
    'name': 'Название',
    'off': 'Выключено',
    'select': 'Выбрать из списка',
    'fromis': 'из',
    'validation': {
      'email': 'Заполнено неверно',
      'required': 'Поле не заполнено',
      'minValue': 'Значение не менее',
      'maxValue': 'Значение не более',
      'integer': 'Только числа',
      'decimal': 'Только числа',
      'number': 'Только числа',
      'maxLength': 'Количество символолов не должно превышать',
      'alphaNum': 'Только буквы и цифры',
      'error': 'Упс! Ошибка! Попробуйте еще раз',
      'global': 'Упс! Непредвиденная ошибка!',
      'no_server': 'Ошибка! Нет ответа от сервера',
      'no_connect': 'Ошибка! Отсутсвует интернет соеденение, обновите страницу через Ctrl + F5'
    },
    'dimensions': 'Размеры',
    'soon': 'скоро',
    'getlicense': 'Сменить тариф',
    'needlicense': 'Подробнее о тарифах',
    'needhelp': 'Нужна помощь? Посмотрите обучающее видео'
  },
  message: {
    project: {
      add: {
        head: 'Ограничение функций на бесплатном тарифе',
        text: 'Максимальное количество проектов - 1',
        call: 'Нужно больше проектов? Смените тариф'
      }
    },
    cargo: {
      add: {
        head: '@:message.project.add.head',
        text: 'Превышено максимальное количество грузовых мест | Превышено максимальное количество грузовых мест | Превышено максимальное кол-во грузовых мест на {n} | Превышено максимальное кол-во грузовых мест на {n}',
        call: 'Нужно больше мест? Смените тариф'
      },
      button: {
        head: '@:message.project.add.head',
        text: 'Добавление мест вручную / из файла недоступно на бесплатном тарифе. Добавьте грузовые места из встроенных шаблонов',
        call: 'Нужно больше функций? Перейдите на Профессиональный тариф'
      }
    },
    loads: {
      add: {
        head: '@:message.project.add.head',
        text: 'Превышено максимальное кол-во грузовых площадей',
        call: 'Нужно больше мест? Смените тариф'
      }
    },
    scene: {
      changetarif: {
        head: 'Тариф изменен',
        text: 'Ваш платный тариф окончен, Вы можете продолжить использовать приложение бесплатно с некоторыми ограничениями',
        call: 'Для отмены ограничений смените Ваш тариф на платный'
      }
    },
    templates: {
      add: {
        head: '@:message.project.add.head',
        text: 'Создание личных шаблонов недоступно',
        call: 'Cмените тариф для создания личных шаблонов'
      },
      set: {
        head: '@:message.project.add.head',
        text: 'Использование личных шаблонов недоступно',
        call: 'Cмените тариф для использования личных шаблонов'
      }
    }
  },
  license: {
    limit: {
      head: 'Ограничение бесплатного тарифа',
      title: 'Больше возможностей?'
    }
  },
  clipboard:{
    copylink: 'Ссылка скопирована'
  },
  payment: {
    period: {
      days: 'день | день | дня | дней',
      month: 'месяцев | месяц | месяца | месяцев',
      count: 'расчет | расчет | расчета | расчетов',
      users: 'пользователь | пользователь | пользователя | пользователей',
      param: 'доп. шаблонов и проектов'
    },
    userlist: 'Список пользователей',
    paytype: {
      label: 'Вид платежа',
      online: 'Оплатить онлайн банковской картой',
      bybill: 'Оплатить по счету'
    },
    userdata: {
      label: 'Реквизиты плательщика',
      resident: {
        out: 'Нерезидент РФ',
        in: 'Зарегистиррован в РФ'
      },
      name : {
        label: 'Наименование компании'
      },
      address : {
        label: 'Юридический адрес'
      },
      inn: {
        label: 'ИНН организации'
      },
      ogrn: {
        label: 'ОГРН'
      },
      longtext: {
        label: 'Дополнительные реквизиты'
      },
      data: {
        error: {
          inn: 'Заполните поле - @:payment.userdata.inn.label',
          name: 'Заполните поле - @:payment.userdata.name.label',
          api: 'Ошибка при получении данных о компании, заполните поля вручную'
        }
      },
      btn: 'Получить счет'
    },
    amount: 'Сумма к оплате',
    button: {
      label: 'Оплатить',
      default: 'Оплатить онлайн {n}',
      company: 'Получить счет {n}'
    },
    users: 'Дополнительные пользователи',
    times: 'Период подписки',
    types: {
      header: 'Выберите тариф',
      count: {
        head: 'Расчетный тариф',
        desc: 'для тех кто не часто использует приложение, тариф безлимитный по времени, но ограничен по количеству расчетов'
      },
      expir: {
        head: 'Безлимитный тариф',
        desc: 'для тех кто планирует регулярно использовать приложение, тариф с ограничением по времени, но безлимитный по количеству расчетов'
      }
    },
    terms: 'Производя оплату Вы соглашаетесь с условиями и положениями договора публичной оферты',
    valid: {
      company: {
        submit: 'Счет будет отправлен в ближайшее время на почту'
      },
      default: {
        error: 'Упс! Перезагрузите эту страницу и попробуйте заново'
      }
    }
  },
  autocomplete: {
    label: 'Автозаполнение',
    hint: 'Введите текст и выберите из списка'
  },
  documents: {
    legal: {
      text: 'По договору-оферте об оказании услуг размещенной по адресу'
    },
    payData: {
      text: 'реквизиты получателя средств',
      inn: 'ИНН',
      kpp: 'КПП',
      name: 'Получатель',
      bank: 'Банк получателя ',
      bik: 'БИК',
      rs: 'р/с',
      ks: 'к/с'
    },
    order: {
      invoice: 'Счет',
      dated: 'от',
      customer: 'Заказчик'
    },
    cart: {
      sv: 'Наименование оказанных услуг, период',
      pc: 'Единицы',
      pr: 'Цена',
      cn: 'Кол-во',
      am: 'Стоимость',
      services: {
        tarif:  'Подписка на тариф "ПРО"',
        period: 'Срок действия',
        article: {
          year: 'год | год | года | лет',
          month: '@:payment.period.month',
          days:  '@:payment.period.days',
          count: '@:payment.period.count',
          users: '@:payment.period.users',
          param: '@:payment.period.param'
        }
      }
    },
    result: 'Всего наименований {n} на сумму',
    paytext: {
      label: 'Назначение платежа',
      descp: 'Оплата по счету {n} от {d} за услуги доступа к приложению ДжетЛоадер'
    },
    currency: 'рублей',
    fine: 'НДС не облагается',
    executor: 'Исполнитель',
    sign: 'Плательщик налога на профессиональный доход',
    post: 'Пожалуйста, отправьте копию платежного поручения на электронную почту'
  },
  user: {
    header: 'Профиль',
    submission: 'Подписка',
    stats: 'Статистика',
    name: 'Имя пользователя',
    counts: 'Расчетов выполнено',
    setting: 'Настройки',
    tarif: 'Тарифы',
    payment: 'Оплата',
    logout: 'Выйти',
    pwdchange: 'Сменить пароль',
    email: 'Электроная почта'
  },
  password: {
    header: 'Смена пароля',
    pwd: {
      label: 'Новый пароль',
      hint: 'Длина пароля не менее {n} знаков, пароль должен содержать буквы и цифры'
    },
    btn: 'Сменить пароль',
    success: 'Пароль успешно изменен'
  },
  'setting': {
    'units':{
      'cargo': {
        'header': 'Параметры грузовых мест по умолчанию',
        'subtitle': 'Параметры по-умолчания при добавлении и просмотре списков'
      },
      'loads': {
        'header': 'Параметры грузовых площадей по умолчанию',
        'subtitle': 'Параметры по-умолчания при добавлении и просмотре списков'
      }
    }
  },
  'tarif': {
    'tarif': 'Тариф | Тариф  | Тарифа  | Тарифов',
    'current': 'Ваш текущий тариф',
    'change': 'cменить тариф',
    'expir': 'Срок действия тарифа',
    'count': 'Остаток расчетов',
    'options': {
      'items': 'Грузовых мест',
      'loads': 'Грузовых площадей',
      'project': 'Проект | Проект | Проекта | Проектов',
      'templates': {
        'cargo': 'Личные шаблоны груза',
        'loads': 'Личные шаблоны транспорта'
      },
      'all': 'Доступны все остальные функции',
      'cargo-size': 'Собственные размеры грузов',
      'loads-size': 'Собственные размеры транспорта',
      'pdf': 'Экспорт проекта в PDF',
      'transport-counts': 'Подсчет необходимого количества транспорта / паллет для перевозки груза',
      'transport-many': 'Параллельное сравнение размещения груза в различном транспорте',
      'move': 'Ручное перемещение груза мышью'
    },
    'type': {
      '0': {
        'title': 'Бесплатный',
        'subtitle': 'Бсп',
        'button': 'Бесплатный тариф по умолчанию'
      },
      '1': {
        'title': 'Профессиональный',
        'subtitle': 'Про',
        'button': 'Оплатить'
      }
    }
  },
  'units': {
    'mm': 'мм',
    'sm': 'см',
    'm':  'м',
    'kg': 'кг',
    'tn': 'тн',
    'co': 'шт',
    'un': 'ед',
    'm3': 'm3',
    size: {
      0: 'мм',
      1: 'см',
      2: 'м'
    },
    wght: {
      0: 'кг',
      1: 'тн'
    }
  },
  'project': {
    'val': 'Проект',
    'nm': {
      'label': 'Имя проекта',
      'hint': ''
    },
    'list': 'Список проектов',
    'current': 'Текущий проект',
    'create': 'Добавить проект',
    'edit': 'Редактирование проекта',
    'header': 'Проекты',
    'valid': {
      'max': 'Максимальное количество проектов',
      'add': 'Создан новый проект'
    },
    'last_sync_time': 'обновлено',
    'no-projects': 'Добавьте новый проект',
    'no-projects-description-1': 'Проекты выполняют роль "хранилища", где все данные будут автоматически сохранятся',
    'no-projects-description-2': 'Рекомендуется для каждого расчета создавать новый проект',
    'no-projects-description-3': 'Нажмите чтобы открыть',
    sort: {
      add_time: 'по дате добавления',
      name: 'по названию',
      modified: 'по дате изменения',
      volume: 'по объему'
    },
    order: {
      true: 'по возрастанию',
      false: 'по убыванию'
    }
  },
  'cargo': {
    'header': 'Список грузовых мест',
    'new': 'Добавить грузовую группу',
    'move': {
      'header': 'Переместить грузовые места',
      'new': 'в новую грузовую группу'
    },
    'valid': {
      'max': 'Превышено максимальное кол-во грузовых мест на {n}',
      'count': 'Нельзя добавить место | Нельзя добавить {n} место | Нельзя добавить {n} мест | Нельзя добавить {n} мест',
      'limit': 'Достигнуто максимальное количество мест | Уменьшите количество на {n} | Уменьшите количество на {n} | Уменьшите количество на {n}',
      'free': 'Достигнуто максимальное количество мест | Доступно {n} | Доступно {n} | Доступно {n}',
      'rows':  'Нельзя добавить новую строку груза, максимальное кол-во строк - {n}'
    },
    'row': 'строк',
    'items': 'мест'
  },
  'cargolist': {
    'header': 'Грузовая группа',
    'disable': '@:cargolist.header отключен',
    'windoff': 'Свернуто',
    'windon': ' Развернуть',
    'no-point': 'Добавьте грузовую группу',
    'no-point-description': 'Грузовые группы это "контейнеры" в которые можно добавить грузовые места, с помощью групп можно создать любой приоритет размещения грузов в транспорте',
    'no-items': 'Добавьте груз',
    'no-items-description': 'выполните импорт из файла / укажите размеры вручную / выберите из шаблонов',
    'no-items-description-1': 'выполните импорт из файла',
    'no-items-description-2': 'укажите размеры вручную ',
    'no-items-description-3': 'добавьте из готовых шаблонов',
    'addcargo': 'Добавить груз',
    'addcargoelse': 'Добавить ещё',
    'addfromtemplate': 'из шаблонов',
    'addfromfile': 'из файла'
  },
  'point': {
    'id': {
      'label': 'ID группы'
    },
    'name': {
      'label': 'Имя группы'
    },
    'new': 'Получатель без названия'
  },
  'item': {
    'color': 'Цвет',
    'templates': 'Быстрые шаблоны',
    'header': 'Параметры',
    'id': {
      'label': 'ID грузового места'
    },
    'point': {
      'label': 'Группа'
    },
    'nm': {
      'label': 'Название',
      'hint': 'Количество символов'
    },
    'cn': {
      'label': 'Количество'
    },
    'ln': {
      'label': 'Длина'
    },
    'wd': {
      'label': 'Ширина'
    },
    'hg': {
      'label': 'Высота'
    },
    'wg': {
      'label': 'Масса брутто'
    },
    'pg': {
      'label': 'Тип упаковки',
      '0': 'Ящик',
      '1': 'Паллет',
      '2': 'Коробка'
    },
    'st': {
      'label': 'Ярусы',
      '0': 'Нет',
      '3': 'Да',
      '1': 'Да (максимальная нагрузка)',
      '2': 'Да (только сверху на другой груз)'
    },
    'rt': {
      'label': 'Поворот',
      '0': 'Нет',
      '1': 'Да'
    },
    'ov': {
      'label': 'Кантование',
      '0': 'Нет',
      '1': 'Да'
    },
    'lm': {
      'label': 'Нагрузка',
      'hint': 'Для автоматического расчета укажите 0'
    },
    'message': {
      'default_error': 'Упс! Ошибка при сохранении, обновите страницу и попробуйте заново',
      'form_error': 'Ошибка в полях формы',
      'copy': 'Создана копия грузового места',
      'clear': 'Форма очищена'
    },
    'new_nm': 'Новое место'
  },
  'templates': {
    'add': 'Добавлено в шаблоны',
    'header': 'Выбрать шаблон',
    'load': 'Выбрать шаблон транспорта',
    'pallet':'@:area.tp.2 {n}',
    'truck': '@:area.tp.0 {n}',
    'contr': '@:area.tp.1 {n}',
    'head': 'Автопоезд: тягач {n}',
    'lorry': 'Грузовик: {n}',
    'semitrailer': 'полуприцеп - тент. {n}',
    'semifrigo': 'полуприцеп - реф. {n}',
    'platform': 'площадка - платформа {n}',
    'tabs': {
      'all': 'Все',
      'truck': 'Автотранспорт',
      'contr': 'Контейнер',
      'pallet': 'Паллет'
    },
    'noname': '...',
    'tempsave': 'Сохранить в шаблоны',
    'filter': {
      'all': 'Все шаблоны',
      'default': 'Стандартные шаблоны',
      'mine': 'Мои шаблоны',
      'shared': 'Общие шаблоны'
    },
    'valid': {
      'max': 'Достигнуто максимальное количество шаблонов'
    }
  },
  'load': {
    'header': 'Список транспорта',
    'add': 'Добавить транспорт вручную',
    'addFrom': 'Добавить из шаблонов',
    'nodata': 'Добавьте транспорт',
    'nodata-description': 'Добавьте транспорт вручную указав размеры или выберите готовый вариант из шаблонов'
  },
  'area': {
    'new_nm': 'Без названия',
    'templates': 'Быстрые шаблоны',
    'header': 'Параметры грузовой площади',
    'id': {
      'label': 'ID'
    },
    'nm': {
      'label': 'Название грузовой площади',
      'hint': 'Количество символов'
    },
    'tp': {
      'label': 'Тип грузовой площади',
      '0': 'Автотранспорт',
      '1': 'Морской контейнер',
      '2': 'Паллет',
      '5': 'Железнодорожный транспорт',
      '6': 'Авиатранспорт',
      '7': 'Складская площадь'
    },
    'ln': {
      'label': 'Длина'
    },
    'wd': {
      'label': 'Ширина'
    },
    'hg': {
      'label': 'Высота'
    },
    'wg': {
      'label': 'Тоннаж'
    },
    'ex': {
      'label': 'Вид грузового транспорта',
      '1': 'Тягач с полуприцепом',
      '2': 'Фургон грузовой'
    },
    'ax': {
      label: 'Осевая нагрузка',
      auto: 'Автоматически',
      text: 'Выключите этот параметр если требуется указать нагрузку на каждую ось отдельно',
      tt: {
        label_1: 'Описание тягача',
        label_2: 'Описание фургона',
        l: 'Длина между осями',
        l1: 'Длина от оси А1 до сцеп. устройства',
        l2: 'Длина от задней оси до сцеп. устройства'
      },
      pp: {
        label: 'Описание полуприцепа',
        l1: 'Длина от стенки до сцеп. устройства',
        l2: 'Длина от центра тележки A2 до сцеп. устройства',
        l3: 'Длина от центра тележки A2 до стенки'
      },
      wg: 'Собственная масса без груза',
      a: 'Количество осей',
      'min': 'Нагрузка на ось без груза | Нагрузка на ось без груза | Нагрузка на осевую тележку без груза | Нагрузка на осевую тележку без груза',
      'max': 'Макс. нагрузка на ось | Макс. нагрузка на ось | Макс. нагрузка на осевую тележку | Макс. нагрузка на осевую тележку'
    }

  },
  'scene': {
    'exist': 'Исключены из расчета',
    'floor': 'Выгружено',
    'control': {
      'area': {
        'head': 'грузовая площадь',
        'next': 'Следующая грузовая площадь',
        'prev': 'Предыдущая грузовая площадь'
      },
      'page': {
        'menu': 'сцена'
      }
    },
    'valid': {
      'jet'  : 'Упс... что-то пошло не так...',
      'jethead': 'Ой ой...',
      'count': 'Итого',
      'exist': 'и есть исключенные места',
      'empty': 'Заполните страницу `{page}`',
      'error': 'Упс ошибка! Обновите страницу и попробуйте заново',
      'noplace': 'Грузы не размещены на грузовой площади',
      'field': 'Поле',
      'pages': 'на странице',
      'required': 'не заполнено',
      'numeric' : 'должно быть целым числом',
      'between' : 'должно быть между {min} и {max}',
      'max': 'должно быть меньшe {max} знаков',
      'in' : 'заполнено неверно',
      'regex': '@:scene.valid.in',
      'tp': {
        '0': '@:common.totalneed грузовых автомобилей: {count}',
        '1': '@:common.totalneed морских контейнеров: {count}',
        '2': '@:common.totalneed паллет: {count}',
        '3': '@:common.totalneed грузовых автомобилей: {count}',
        '4': '@:common.totalneed морских контейнеров: {count}',
        '5': '@:common.totalneed ж/д транспорт: {count}',
        '6': '@:common.totalneed авиатранспорт: {count}',
        '7': '@:common.totalneed складской площади: {count}'
      },
      'existList': {
        'ln': 'превышена длина транспорта',
        'wd': 'превышена ширина транспорта',
        'hg': 'превышена высота транспорта',
        'wg': 'превышен тоннаж транспорта'
      }
    },
    'total': {
      'weight':'Общая масса',
      'count':'Количество мест',
      'volume':'Общий объем',
      'height':'Максимальная высота',
      'total_text': 'Общие расчеты схемы размещения',
      'total_group': 'Общий вид всех грузовых групп',
      'total_frame': 'Вид на грузовой площади',
      'full': 'Занято',
      'free': 'Свободно'
    },
    'results': {
      'head': 'Расчеты размещения',
      'max': {
        'head': 'Максимальная длина',
        'help': 'максимальная длина сцены',
        'height': 'Высота',
        'width': 'Ширина',
        'length': 'Длина'
      },
      'opt': {
        'head': 'LDM',
        'help': 'длина груза с учетом возможности догруза'
      },
      axies: {
        label: 'Ось',
        from: {
          tt_1: 'тягача',
          tt_2: 'фургона',
          pp: 'полуприцепа'
        }
      }
    },
    step: {
      label: 'Шаги загрузки',
      changeLabel: 'Укажите номер шага погрузки',
      all: 'Все'
    },
    snap: 'Примагничивание',
    hang: 'Свешивание',
    'ctrl': {
      'header': 'Управление сценой',
      'left': 'Левая кнопка',
      'round': 'вращение сцены',
      'right': 'Правая кнопка',
      'move': 'перемещение по сцене',
      'drag': 'перемещение груза',
      'wheel': 'Колесо мыши',
      'zoom': 'масштаб сцены',
      'arrowlr': 'вращение места по горизонтали',
      'arrowud': 'вращение места по вертикали',
      'snap': 'отключить примыкание и разрешить свес'
    },
    hover: {
      ln: 'Длина',
      wd: 'Ширина',
      hg: 'Высота',
      wg: 'Масса',
      offset: {
        ln: 'Отступ по длине',
        wd: 'Отступ по ширине',
        hg: 'Отступ по высоте'
      },
      press: 'Нагрузка ярусов'
    },
    'export': {
      'head': 'Сохранить в файл',
      'csv': 'CSV',
      'header_text': 'Cхема размещения груза',
      'subbrand': 'jload.me',
      'subresult': 'Итого',
      'filename': 'Сцена погрузки',
      'message': 'Файл скачан'
    },
    drag: {
      maxplus: 'Превышен тоннаж',
      minplus: 'Все выгружено',
      maxlimit: 'Превышена макс. нагрузка места № | Превышена макс. нагрузка места № | Превышена макс. нагрузка мест № | Превышена макс. нагрузка мест №'
    }

  },
  share: {
    empty: 'Сцена размещения груза не найдена',
    btn: 'На главную',
    update: 'В связи с обновлением приложения Ваша ссылка устарела, пожалуйста, обновите проект и получите новую ссылку'
  },
  'import': {
    'header': 'Импорт',
    'subheader-1': 'Из файла',
    'subheader-2': 'Из текста',
    'file': {
      'example': 'Пример',
      'limits': {
        'header': 'Ограничения при добавления мест из файла',
        'rows':  'Количество строк с описанием груза в файле',
        'cargo': 'Количество грузовых мест в файле'
      },
      'faq': {
        label: 'Инструкция',
        '1': 'Скачайте и заполните шаблон (редактируется в Excel) ',
        '2': 'Сохраните шаблон в исходном формате',
        '3': 'Загрузите файл в форму',
        '4': 'Ограничение по количеству строк',
        '5': 'CSV (разделители - точка с запятой)',
        '6': 'XLSX'
      },
      'input': {
        'label': 'Файл'
      },
      'bformat': 'Недопустимый формат файла',
      'limsize': 'Превышен максимальный размер файла - {n} Мб',
      'nomulti': 'Одновременно может быть загружен только 1 файл',
      'empty': 'Файл не содержит данные или не распознан',
      'nofile': 'Загрузите файл',
      'success': 'Файл распознан'
    },
    'text': {
      'empty': 'Заполните форму',
      'notext': 'В тексте нет данных для добавления',
      'error': 'Данные не распознаны',
      'faq': {
        '1': 'Введите данные грузов в формате',
        '2': 'Название, Длина, Ширина, Высота, Масса, Количество',
        '3': 'Каждое грузовое место должно начинаться с новой строки'
      },
      'textarea': {
        'label': 'Параметры грузовых мест'
      }
    },
    'tabs': {
      '0': 'Все строки',
      '1': 'Cтроки с ошибками'
    },
    'data': {
      'rowsLimit': 'Не все строки загружены, ограничение строк в текущем проекте - {n}',
      'rowsInvalid': 'Исправьте ошибки в строках, строк с ошибкой - {n}',
      'empty': 'Данные не распознаны'
    },
    uploadfile: {
      'action': 'Перетащите файл или нажмите для загрузки вручную',
      'filelimit': 'Максимальный размер файла - {n} МБ',
      'fileready': 'Файл загружен',
      'filesize': 'Размер'
    }
  },
  'error': {
    'notfound': '...Упс! ...Такая страница не найдена (',
    'other': 'Произошла ошибка'
  },
  'menu': {
    'templates':  'Мои шаблоны',
    'projects':  'Проекты',
    'shares' : 'Связь',
    'brief': 'Как это работает?',
    'support': 'Техподдержка',
    'terms': 'Условия',
    'tarifs':'Тарифы',
    'blog': 'Кейсы',
    'payment': 'Оплата',
    'profile': 'Профиль',
    'setting': 'Настройки'
  },
  'footer': {
    'projects': 'Выбор проекта',
    'cargo': 'Выбор груза',
    'load': 'Выбор транспорта',
    'scene': 'Расчет загрузки'
  },
  '$vuetify': {
    'input': {
      'prependAction': 'Назад',
      'appendAction': 'Вперед',
      'clear': 'Очистить'
    },
    'badge': 'Значок',
    'close': 'Закрыть',
    'dataIterator': {
      'noResultsText': 'Совпадающих записей не найдено',
      'loadingText': 'Загрузка...'
    },
    'dataTable': {
      'itemsPerPageText': 'Строк на странице:',
      'ariaLabel': {
        'sortDescending': 'Сортировка по убыванию.',
        'sortAscending': 'Сортировка по возрастанию.',
        'sortNone': 'Не отсортировано.',
        'activateNone': 'Активируйте, чтобы убрать сортировку.',
        'activateDescending': 'Активируйте для сортировки по убыванию.',
        'activateAscending': 'Активируйте для сортировки по возрастанию.'
      },
      'sortBy': 'Сортировать по'
    },
    'dataFooter': {
      'itemsPerPageText': 'Пункты на странице:',
      'itemsPerPageAll': 'Все',
      'nextPage': 'Следующая страница',
      'prevPage': 'Предыдущая страница',
      'firstPage': 'Первая страница',
      'lastPage': 'Предыдущая страница',
      'pageText': '{0} - {1} из {2}'
    },
    'noDataText': 'Данные недоступны',
    'fileInput': {
      'counter': '{0} файлов',
      'counterSize': '{0} файлов (всего {1})'
    }
  },
  "validations": {
    'email': 'Заполнено неверно',
    'required': 'Поле не заполнено',
    'minValue': 'Значение не менее {min}',
    'maxValue': 'Значение не более {max}',
    'integer': 'Только числа',
    'decimal': 'Только числа',
    'numeric': 'Только числа',
    'maxLength': 'Количество символолов не должно превышать {max}',
    'alphaNum': 'Только буквы и цифры',
  }
}
