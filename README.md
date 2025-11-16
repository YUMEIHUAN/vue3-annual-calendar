# Vue 3 Annual Calendar

一个美观的年度日历组件，支持节假日选择和批量设置。

## 安装

```bash
npm install vue3-annual-calendar
```

## 使用
```javascript
<template>
  <AnnualCalendar
    v-model:year="currentYear"
    :initial-holidays="holidays"
    :show-batch-selector="true"
    @holiday-change="handleHolidayChange"
  />
</template>

<script>
import { ref } from 'vue'
import { AnnualCalendar } from 'vue3-annual-calendar'
import 'vue3-annual-calendar/dist/style.css'

export default {
  components: {
    AnnualCalendar
  },
  setup() {
    const currentYear = ref(2024)
    const holidays = ref([
      { date: '2024-01-01', name: '元旦' },
      { date: '2024-05-01', name: '劳动节' }
    ])

    const handleHolidayChange = (newHolidays) => {
      console.log('节假日变化:', newHolidays)
    }

    return {
      currentYear,
      holidays,
      handleHolidayChange
    }
  }
}
</script>
```


Props
属性	类型	默认值	说明
year	Number	当前年份	显示的年份
initialHolidays	Array	[]	初始节假日数组
showBatchSelector	Boolean	true	是否显示批量选择器
Events
事件名	参数	说明
holiday-change	holidays	节假日变化时触发
