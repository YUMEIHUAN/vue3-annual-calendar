<template>
  <div class="calendar-container">
    <div class="batch-selector">
      <h3>批量选择休息日</h3>
      <div style="display: flex; justify-content: space-between">
        <div class="weekday-checkboxes">
          <el-checkbox v-for="day in weekdayChecbox" :key="day.value" :label="day.label"
            @change="handleWeekdayChange($event, day.value)" v-model="day.checked" />
        </div>
        <el-button link type="primary" @click="batchSetHoliday()"> 批量设置休息日 </el-button>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="month in months" :key="month" class="month-card">
        <div class="month-header">{{ holidayData.year }}年 {{ month }}月</div>
        <div class="calendar">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day">{{ day }}</div>
          </div>
          <div class="days">
            <div v-for="(day, index) in getMonthDays(month)" :key="index" class="day" :class="{
              'other-month': !day.isCurrentMonth,
              selected: holidayData.days[day.keyId]?.isHoliday,
              today: isToday(day.date),
            }" @click="toggleHoliday(day)">
              {{ day.isCurrentMonth ? day.day : '' }}
              <div v-if="holidayData.days[day.keyId]?.isHoliday" class="selected-indicator">休</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="批量设置休假日期" width="500">
      <el-form :model="form">
        <el-form-item label="日期范围" :label-width="formLabelWidth">
          <el-date-picker v-model="form.dateRange" type="daterange" :disabled-date="disabledDate" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submit()">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { generateYearHolidayDataEnhanced, getDayOfYearByMonth } from './generateDate.js'
import { ElMessage } from 'element-plus'

// 定义组件属性
const props = defineProps({
  // 初始年份
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
  // 初始休息日数据
  initialHolidays: {
    type: Array,
    default: () => [],
  },
  // 是否显示批量选择器
  showBatchSelector: {
    type: Boolean,
    default: true,
  },
})

// 定义组件事件
const emit = defineEmits(['update:year', 'holiday-change', 'year-change'])

const dialogFormVisible = ref(false)
const formLabelWidth = '120px'
const selectedWeekdays = ref([])

// 使用统一的数据结构
const holidayData = ref({
  year: '',
  days: [],
})

const form = ref({
  dateRange: [],
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const weekdayChecbox = ref([
  { value: '1', label: '周一休息', checked: false },
  { value: '2', label: '周二休息', checked: false },
  { value: '3', label: '周三休息', checked: false },
  { value: '4', label: '周四休息', checked: false },
  { value: '5', label: '周五休息', checked: false },
  { value: '6', label: '周六休息', checked: false },
  { value: '0', label: '周日休息', checked: false },
])

// 计算属性：获取当前选择的休息日
const selectedHolidays = computed(() => {
  return holidayData.value.days.filter((day) => day.isHoliday).map((day) => day.date)
})

// 获取某个月份的所有日期（用于显示）
const getMonthDays = (month) => {
  const daysInMonth = []
  const firstDay = new Date(holidayData.value.year, month - 1, 1)
  const lastDay = new Date(holidayData.value.year, month, 0)

  // 上个月的最后几天
  const firstDayOfWeek = firstDay.getDay()
  const prevMonthLastDay = new Date(holidayData.value.year, month - 1, 0).getDate()

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(holidayData.value.year, month - 2, prevMonthLastDay - i)
    daysInMonth.push({
      day: prevMonthLastDay - i,
      date: date,
      isCurrentMonth: false,
    })
  }

  // 当前月的所有日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(holidayData.value.year, month - 1, i)
    daysInMonth.push({
      day: i,
      date: date,
      isCurrentMonth: true,
      keyId: getDayOfYearByMonth(date) - 1,
    })
  }

  // 下个月的前几天
  const totalCells = 42 // 6行 * 7列
  const nextMonthDays = totalCells - daysInMonth.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(holidayData.value.year, month, i)
    daysInMonth.push({
      day: i,
      date: date,
      isCurrentMonth: false,
    })
  }

  return daysInMonth
}

// 检查是否为今天
const isToday = (date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// 切换节假日状态
const toggleHoliday = (day) => {
  if (!day.isCurrentMonth) return

  holidayData.value.days[day.keyId].isHoliday = !holidayData.value.days[day.keyId].isHoliday
  emitHolidayChange()
}

// 处理星期选择变化
const handleWeekdayChange = (value, week) => {
  holidayData.value.days.forEach((item) => {
    if (item.weekday == week) {
      item.isHoliday = value
    }
  })
  emitHolidayChange()
}

// 批量处理
const batchSetHoliday = () => {
  dialogFormVisible.value = true
}

const disabledDate = (time) => {
  const year = time.getFullYear()
  return year != holidayData.value.year
}

const submit = () => {
  if (form.value.dateRange.length !== 2) {
    ElMessage.error('请选择日期范围')
    return
  }
  const [startDate, endDate] = form.value.dateRange

  const startDateIndex = getDayOfYearByMonth(startDate) - 1
  const endDateIndex = getDayOfYearByMonth(endDate) - 1
  for (let i = startDateIndex; i <= endDateIndex; i++) {
    holidayData.value.days[i].isHoliday = true
  }
  dialogFormVisible.value = false
  emitHolidayChange()
  ElMessage.success('批量设置休息日成功')
}

// 发射节假日变化事件
const emitHolidayChange = () => {
  emit('holiday-change', selectedHolidays.value)
}

// 加载新年份数据
const loadNewYear = (year) => {
  holidayData.value.year = year
  holidayData.value = generateYearHolidayDataEnhanced(year)
  form.value.dateRange = [new Date(year, 0, 1), new Date(year, 0, 1)]
  selectedWeekdays.value = [] // 清空复选框选择
  emit('year-change', year)
  emitHolidayChange()
  ElMessage.success(`已切换到 ${year} 年`)
}

// 设置休息日
const setHolidays = (dates) => {
  // 重置所有休息日状态
  holidayData.value.days.forEach((day) => {
    day.isHoliday = false
  })

  // 设置新的休息日
  dates.forEach((date) => {
    const dateObj = new Date(date)
    const dayOfYear = getDayOfYearByMonth(dateObj) - 1
    if (holidayData.value.days[dayOfYear]) {
      holidayData.value.days[dayOfYear].isHoliday = true
    }
  })

  emitHolidayChange()
}

// 监听年份变化
watch(
  () => props.year,
  (newYear) => {
    if (newYear !== holidayData.value.year) {
      loadNewYear(newYear)
      weekdayChecbox.value.forEach((item) => {
        item.checked = false
      })
    }
  },
)

// 监听初始休息日数据变化
watch(
  () => props.initialHolidays,
  (newHolidays) => {
    if (newHolidays && newHolidays.length > 0) {
      setHolidays(newHolidays)
    }
  },
  { immediate: true },
)

// 暴露方法给父组件
defineExpose({
  loadNewYear,
  setHolidays,
  getSelectedHolidays: () => selectedHolidays.value,
  getHolidayData: () => holidayData.value,
})

// 初始化
onMounted(() => {
  loadNewYear(props.year)
})
</script>

<style scoped>
.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
  min-height: 100vh;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.month-card {
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.month-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.month-header {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  padding: 12px 15px;
  font-weight: 600;
  text-align: center;
  font-size: 16px;
}

.calendar {
  padding: 15px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  position: relative;
  border: 1px solid transparent;
}

.day:nth-child(1),
.day:nth-child(7n),
.day:nth-child(7n + 1) {
  color: #909399;
}

.day:hover {
  background-color: #f0f7ff;
  border-color: #c6e2ff;
}

.day.other-month {
  color: #c0c4cc;
}

.day.other-month:hover {
  background-color: transparent;
  border-color: transparent;
  cursor: default;
}

.day.selected {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
  font-weight: bold;
}

.day.other-month.selected {
  background: transparent;
  color: #c0c4cc;
  box-shadow: none;
}

.day.today {
  border: 2px solid #409eff;
  background-color: #ecf5ff;
}

.selected-indicator {
  position: absolute;
  top: 0;
  right: 2px;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.footer {
  margin-top: 25px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.batch-selector {
  margin: 0 0 10px 0;
  padding: 10px 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.batch-selector h3 {
  margin-bottom: 15px;
  color: #409eff;
  font-size: 18px;
}

.weekday-checkboxes {
  display: flex;
  gap: 15px;
}

.selected-info {
  padding: 8px 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;
}

/* Element Plus 复选框样式调整 */
:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

@media (max-width: 1200px) {
  .calendar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .calendar-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  :deep(.el-checkbox-group) {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .calendar-grid {
    grid-template-columns: 1fr;
  }
}
</style>
