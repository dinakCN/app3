import { useI18n } from "vue-i18n"

export interface IMessage { type: string; value: string; page: string; min?: number; max?: number}

const useMessages = () => {
  const i18n = useI18n()
  const getMessage = (message: IMessage) => {
    let result = '';

    switch (message.type) {
      case 'regex':
      case 'in':
      case 'required':
      case 'numeric':
      case 'between':
      case 'max':
        result = `${i18n.t('scene.valid.field')} \`${i18n.t(message.value)}\` ${t('scene.valid.pages')} \`${i18n.t(message.page)}\``;
        break;
      case 'empty':
        result = i18n.t('scene.valid.empty', {'page': i18n.t(message.page)});
        break;
      case 'maxTemplate':
        result = i18n.t('templates.valid.max');
        break;
      case 'maxProjects':
        result = i18n.t('project.valid.max');
        break;
    }

    switch (message.type) {
      case 'regex':
      case 'in':
      case 'required':
      case 'numeric':
        result += ` ${i18n.t('scene.valid.' + message.type)}`;
        break;
      case 'between':
        if (message.value === 'item.cn.label') {
          result += ` ${i18n.t('scene.valid.between', {'min': message.min, 'max': message.max})}`;
        } else if (['item.wg.label', 'item.lm.label', 'area.wg.label'].includes(message.value)) {
          result += ` ${i18n.t('scene.valid.between', {'min': message.min, 'max': message.max})} ${i18n.t('units.kg')}`;
        } else {
          result += ` ${i18n.t('scene.valid.between', {'min': message.min, 'max': message.max})} ${i18n.t('units.sm')}`;
        }
        break;
      case 'max':
        result += ` ${i18n.t('scene.valid.max', {'max': message.max})}`;
        break;
    }

    return result;
  };

  return {
    getMessage
  }
}

export default useMessages
