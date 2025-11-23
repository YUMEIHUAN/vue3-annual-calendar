# Vue 3 Annual Calendar

一个美观的年度日历组件，支持节假日选择和批量设置。

## 安装

```bash
npm install vue3-annual-calendar
```

## 测试

```javascript
<template>
  <AnnualCalendar
      :year="currentYear"
      :initial-holidays="initialHolidays"
      :show-batch-selector="true"
      @year-change="handleYearChange"
      @holiday-change="handleHolidayChange"
      ref="calendarRef"
    />

    <div
      style="display: flex; justify-content: end; gap: 10px; margin-top: 20px; margin-bottom: 20px"
    >
      <el-button @click="changeYear" type="primary">切换到2026年</el-button>
      <el-button @click="setCustomHolidays" type="primary">设置自定义休息日</el-button>
      <el-button @click="getCurrentHolidays" type="primary">获取当前休息日</el-button>
      <el-button @click="getHolidayData" type="primary">获取数据结构</el-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { AnnualCalendar } from 'vue3-annual-calendar'
import 'vue3-annual-calendar/dist/style.css'

const currentYear = ref(2025)
const calendarRef = ref()

const initialHolidays = ['2025-01-01', '2025-02-10', '2025-02-11', '2025-05-01']

const handleYearChange = (year) => {
  console.log('年份变化:', year)
  currentYear.value = year
}

const handleHolidayChange = (holidays) => {
  console.log('休息日变化:', holidays)
}

const changeYear = () => {
  currentYear.value = 2026
}

const setCustomHolidays = () => {
  const customHolidays = ['2025-06-01', '2025-07-15', '2025-08-20']
  calendarRef.value.setHolidays(customHolidays)
}

const getCurrentHolidays = () => {
  const holidays = calendarRef.value.getSelectedHolidays()
  console.log('当前休息日:', holidays)
}
const getHolidayData = () => {
  const holidayData = calendarRef.value.getHolidayData()
  console.log('假期数据:', holidayData)
}
</script>
```

```
<template>
  <div>
    <AnnualCalendar
      :year="currentYear"
      :initial-holidays="initialHolidays"
      :show-batch-selector="true"
      @year-change="handleYearChange"
      @holiday-change="handleHolidayChange"
      ref="calendarRef"
    />

    <div
      style="display: flex; justify-content: end; gap: 10px; margin-top: 20px; margin-bottom: 20px"
    >
      <el-button @click="changeYear" type="primary">切换到2026年</el-button>
      <el-button @click="setCustomHolidays" type="primary">设置自定义休息日</el-button>
      <el-button @click="getCurrentHolidays" type="primary">获取当前休息日</el-button>
      <el-button @click="getHolidayData" type="primary">获取数据结构</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnnualCalendar from '@/components/views/views/removalDetail.vue'

const currentYear = ref(2025)
const calendarRef = ref()

const initialHolidays = ['2025-01-01', '2025-02-10', '2025-02-11', '2025-05-01']

const handleYearChange = (year) => {
  console.log('年份变化:', year)
  currentYear.value = year
}

const handleHolidayChange = (holidays) => {
  console.log('休息日变化:', holidays)
}

const changeYear = () => {
  currentYear.value = 2026
}

const setCustomHolidays = () => {
  const customHolidays = ['2025-06-01', '2025-07-15', '2025-08-20']
  calendarRef.value.setHolidays(customHolidays)
}

const getCurrentHolidays = () => {
  const holidays = calendarRef.value.getSelectedHolidays()
  console.log('当前休息日:', holidays)
}
const getHolidayData = () => {
  const holidayData = calendarRef.value.getHolidayData()
  console.log('假期数据:', holidayData)
}
</script>
```
