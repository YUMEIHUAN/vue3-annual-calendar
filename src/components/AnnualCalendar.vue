<template>
  <div id="app">
    <div class="calendar-container">
      <div class="batch-selector">
        <h3>批量选择休息日</h3>
        <div class="weekday-checkboxes">
          <el-checkbox-group v-model="selectedWeekdays" @change="handleWeekdayChange">
            <el-checkbox :label="1">周一休息</el-checkbox>
            <el-checkbox :label="2">周二休息</el-checkbox>
            <el-checkbox :label="3">周三休息</el-checkbox>
            <el-checkbox :label="4">周四休息</el-checkbox>
            <el-checkbox :label="5">周五休息</el-checkbox>
            <el-checkbox :label="6">周六休息</el-checkbox>
            <el-checkbox :label="0">周日休息</el-checkbox>
          </el-checkbox-group>
          <div class="selected-info">已选择: {{ getSelectedWeekdaysText }}</div>
        </div>
      </div>

      <div class="calendar-grid">
        <div v-for="month in months" :key="month" class="month-card">
          <div class="month-header">{{ selectedYear }}年{{ month }}月</div>
          <div class="calendar">
            <div class="weekdays">
              <div v-for="day in weekdays" :key="day">{{ day }}</div>
            </div>
            <div class="days">
              <div v-for="(day, index) in getMonthDays(month)" :key="index" class="day" :class="{
                'other-month': !day.isCurrentMonth,
                selected: isSelected(day.date),
                today: isToday(day.date),
              }" @click="toggleHoliday(day)">
                {{ day.isCurrentMonth ? day.day : '' }}
                <div v-if="isSelected(day.date)" class="selected-indicator">休</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Element UI + Vue3 年度节假日日历 - 点击日期可标记为节假日，支持批量选择</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { ElCheckbox, ElCheckboxGroup, ElMessage } from 'element-plus'

export default {
  name: 'AnnualCalendar',
  components: {
    ElCheckbox,
    ElCheckboxGroup,
  },
  props: {
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    initialHolidays: {
      type: Array,
      default: () => []
    },
    showBatchSelector: {
      type: Boolean,
      default: true
    }
  },
  emits: ['holiday-change', 'update:year'],
  setup(props, { emit }) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const selectedYear = ref(props.year)
    const selectedHolidays = ref([...props.initialHolidays])
    const selectedWeekdays = ref([])

    // 用于跟踪哪些日期是通过批量选择添加的
    const batchSelectedDates = ref(new Set())

    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // 监听年份变化
    watch(() => props.year, (newYear) => {
      selectedYear.value = newYear
      // 年份变化时重新应用批量选择
      if (selectedWeekdays.value.length > 0) {
        applyWeekdaySelection()
      }
    })

    // 监听节假日变化
    watch(selectedHolidays, (newHolidays) => {
      emit('holiday-change', newHolidays)
    }, { deep: true })

    // 计算已选择的星期文本
    const getSelectedWeekdaysText = computed(() => {
      if (selectedWeekdays.value.length === 0) {
        return '无'
      }
      return selectedWeekdays.value
        .sort((a, b) => a - b)
        .map((day) => weekdays[day])
        .join('、')
    })

    // 获取某个月份的所有日期
    const getMonthDays = (month) => {
      const days = []
      const firstDay = new Date(selectedYear.value, month - 1, 1)
      const lastDay = new Date(selectedYear.value, month, 0)

      // 上个月的最后几天
      const firstDayOfWeek = firstDay.getDay()
      const prevMonthLastDay = new Date(selectedYear.value, month - 1, 0).getDate()

      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(selectedYear.value, month - 2, prevMonthLastDay - i)
        days.push({
          day: prevMonthLastDay - i,
          date: date,
          isCurrentMonth: false,
        })
      }

      // 当前月的所有日期
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(selectedYear.value, month - 1, i)
        days.push({
          day: i,
          date: date,
          isCurrentMonth: true,
        })
      }

      // 下个月的前几天
      const totalCells = 42 // 6行 * 7列
      const nextMonthDays = totalCells - days.length
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(selectedYear.value, month, i)
        days.push({
          day: i,
          date: date,
          isCurrentMonth: false,
        })
      }

      return days
    }

    // 检查日期是否被选中
    const isSelected = (date) => {
      const dateString = formatDate(date)
      return selectedHolidays.value.some((holiday) => holiday.date === dateString)
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
      if (!day.isCurrentMonth) {
        return
      }

      const dateString = formatDate(day.date)
      const index = selectedHolidays.value.findIndex((h) => h.date === dateString)

      if (index === -1) {
        selectedHolidays.value.push({
          date: dateString,
          name: `${selectedYear.value}年${day.date.getMonth() + 1}月${day.date.getDate()}日`,
        })
        // 如果是手动添加的，从批量选择集合中移除（如果是批量选择添加的）
        batchSelectedDates.value.delete(dateString)
      } else {
        selectedHolidays.value.splice(index, 1)
        // 如果是从批量选择中移除的，也从集合中移除
        batchSelectedDates.value.delete(dateString)
      }
    }

    // 格式化日期为YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // 应用星期选择
    const applyWeekdaySelection = () => {
      const year = selectedYear.value
      const currentSelectedWeekdays = [...selectedWeekdays.value]

      // 首先移除当前年份中所有通过批量选择设置的日期
      selectedHolidays.value = selectedHolidays.value.filter((holiday) => {
        const holidayYear = parseInt(holiday.date.split('-')[0])
        // 如果不是当前年份，保留
        if (holidayYear !== year) return true

        // 如果是固定节假日，保留
        if (isFixedHoliday(holiday.date, year)) {
          return true
        }

        // 如果是手动选择且不在批量选择集合中的，保留
        if (!batchSelectedDates.value.has(holiday.date)) {
          return true
        }

        // 其他批量选择的日期，根据当前选择的星期决定是否保留
        const holidayDate = new Date(holiday.date)
        const holidayWeekday = holidayDate.getDay()
        return currentSelectedWeekdays.includes(holidayWeekday)
      })

      // 清空批量选择集合，准备重新添加
      batchSelectedDates.value.clear()

      // 添加新选择的星期的休息日
      if (currentSelectedWeekdays.length > 0) {
        const startDate = new Date(year, 0, 1)
        const endDate = new Date(year, 11, 31)

        let addedCount = 0
        const currentDate = new Date(startDate)

        while (currentDate <= endDate) {
          if (currentSelectedWeekdays.includes(currentDate.getDay())) {
            const dateString = formatDate(currentDate)

            // 跳过固定节假日
            if (isFixedHoliday(dateString, year)) {
              currentDate.setDate(currentDate.getDate() + 1)
              continue
            }

            // 检查是否已经存在
            const exists = selectedHolidays.value.some((h) => h.date === dateString)
            if (!exists) {
              selectedHolidays.value.push({
                date: dateString,
                name: `${year}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`,
              })
              // 标记为批量选择添加的日期
              batchSelectedDates.value.add(dateString)
              addedCount++
            } else {
              // 如果已经存在且不是固定节假日，标记为批量选择
              if (!isFixedHoliday(dateString, year)) {
                batchSelectedDates.value.add(dateString)
              }
            }
          }
          currentDate.setDate(currentDate.getDate() + 1)
        }

        if (addedCount > 0) {
          ElMessage.success(
            `已更新休息日设置，当前共 ${selectedHolidays.value.filter((h) => parseInt(h.date.split('-')[0]) === year).length
            } 个休息日`,
          )
        }
      } else {
        ElMessage.info('已清除所有批量选择的休息日，保留手动设置的节假日')
      }
    }

    // 检查是否为固定节假日
    const isFixedHoliday = (dateString, year) => {
      const fixedHolidays = [
        `${year}-01-01`, // 元旦
        `${year}-05-01`, // 劳动节
        `${year}-10-01`, // 国庆节
      ]
      return fixedHolidays.includes(dateString)
    }

    // 处理星期选择变化
    const handleWeekdayChange = () => {
      applyWeekdaySelection()
    }

    // 清除批量选择的星期几休息日
    const clearWeekdaySelection = () => {
      selectedWeekdays.value = []
      applyWeekdaySelection()
    }

    // 初始化一些节假日
    onMounted(() => {
      if (props.initialHolidays.length === 0) {
        const newYear = new Date(selectedYear.value, 0, 1)
        const laborDay = new Date(selectedYear.value, 4, 1)
        const nationalDay = new Date(selectedYear.value, 9, 1)

        selectedHolidays.value = [
          { date: formatDate(newYear), name: `${selectedYear.value}年元旦` },
          { date: formatDate(laborDay), name: `${selectedYear.value}年劳动节` },
          { date: formatDate(nationalDay), name: `${selectedYear.value}年国庆节` },
        ]
      }
    })

    return {
      selectedYear,
      weekdays,
      months,
      selectedHolidays,
      selectedWeekdays,
      getSelectedWeekdaysText,
      getMonthDays,
      toggleHoliday,
      isSelected,
      isToday,
      formatDate,
      handleWeekdayChange,
      clearWeekdaySelection,
    }
  },
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  color: #333;
  padding: 20px;
  min-height: 100vh;
}

.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
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
  color: #909399;
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

.day:hover {
  background-color: #f0f7ff;
  border-color: #c6e2ff;
}

.day.other-month {
  color: transparent;
  background-color: transparent;
  cursor: default;
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

.day.today.other-month {
  border: none;
  background-color: transparent;
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
  margin: 25px 0;
  padding: 20px;
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
  flex-direction: column;
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
