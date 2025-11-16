import AnnualCalendar from './components/AnnualCalendar.vue'

// 导出组件
export { AnnualCalendar }

// 导出默认安装函数
export default {
  install(app) {
    app.component('AnnualCalendar', AnnualCalendar)
  }
}