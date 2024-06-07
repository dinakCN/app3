const icons = {
  chevronDown: 'mdi:mdi-chevron-down',
  chevronUp: 'mdi:mdi-chevron-up',
  close: 'mdi:mdi-close',
  magnify: 'mdi:mdi-magnify',
  folderOpen: 'mdi:mdi-folder-open',
  folderOutline: 'mdi:mdi-folder-outline',
  textbox: 'mdi:mdi-form-textbox',
  copyContent: 'mdi:mdi-content-copy',
  trashCan: 'mdi:mdi-trash-can-outline',
  plusBoxMultiply: 'mdi:mdi-plus-box-multiple',
  repeat: 'mdi:mdi-repeat',
  checkCircle: 'mdi:mdi-check-circle',
  minusCircle: 'mdi:mdi-minus-circle',
  plusCircle: 'mdi:mdi-plus-circle',
  questionHead: 'mdi:mdi-head-question-outline',
  update: 'mdi:mdi-update',
  editOutline: 'mdi:mdi-square-edit-outline',
  saveOutline: 'mdi:mdi-content-save-outline',
};

type IIcons = {
  [K in keyof typeof icons]: string;
};

export default icons as typeof icons;
export { IIcons };
