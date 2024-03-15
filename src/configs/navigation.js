import menuApps from './menus/apps.menu'
import menuPages from './menus/pages.menu'

export default {
  // main navigation - side menu
  menu: [{
    text: 'Main',
    items: menuApps
  }, {
    text: 'Menu',
    items: menuPages
  }],

  // footer links
  footer: [{
    text: 'Projects',
    key: 'footer.projects',
    icon: 'fa-thin fa-sheet-plastic',
    to: '/',
    disabled: false
  },
  {
    text: 'Cargo',
    key: 'footer.cargo',
    icon: 'fa-solid fa-box-open',
    to: '/cargo',
    disabled: false
  },
  {
    text: 'Load',
    key: 'footer.load',
    icon: 'fa-solid fa-truck-fast',
    to: '/load',
    disabled: false
  },
  {
    text: 'Scene',
    key: 'footer.scene',
    icon: 'fa-thin fa-calculator',
    to: '/scene',
    disabled: false
  }]
}
