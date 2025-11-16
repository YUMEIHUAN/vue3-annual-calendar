<template>
  <!-- 你的 template 代码保持不变 -->
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
    // 年份
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    // 初始节假日
    initialHolidays: {
      type: Array,
      default: () => []
    },
    // 是否显示批量选择器
    showBatchSelector: {
      type: Boolean,
      default: true
    },
    // 自定义样式
    customStyles: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['holiday-change', 'update:year'],
  setup(props, { emit }) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const selectedYear = ref(props.year)
    const selectedHolidays = ref([...props.initialHolidays])
    const selectedWeekdays = ref([])

    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // 监听年份变化
    watch(() => props.year, (newYear) => {
      selectedYear.value = newYear
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
      } else {
        selectedHolidays.value.splice(index, 1)
      }
    }

    // 格式化日期为YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // 处理星期选择变化
    const handleWeekdayChange = () => {
      const year = selectedYear.value
      const currentSelectedWeekdays = [...selectedWeekdays.value]

      // 移除当前年份中所有通过批量选择设置的日期
      selectedHolidays.value = selectedHolidays.value.filter((holiday) => {
        const holidayYear = parseInt(holiday.date.split('-')[0])
        if (holidayYear !== year) return true

        const holidayDate = new Date(holiday.date)
        const holidayWeekday = holidayDate.getDay()

        if (currentSelectedWeekdays.includes(holidayWeekday)) {
          return true
        }

        // 检查是否是手动选择的固定节假日
        const fixedHolidays = [
          `${year}-01-01`,
          `${year}-05-01`,
          `${year}-10-01`,
        ]

        if (fixedHolidays.includes(holiday.date)) {
          return true
        }

        return false
      })

      // 添加新选择的星期的休息日
      if (currentSelectedWeekdays.length > 0) {
        const startDate = new Date(year, 0, 1)
        const endDate = new Date(year, 11, 31)

        let addedCount = 0
        const currentDate = new Date(startDate)

        while (currentDate <= endDate) {
          if (currentSelectedWeekdays.includes(currentDate.getDay())) {
            const dateString = formatDate(currentDate)
            const exists = selectedHolidays.value.some((h) => h.date === dateString)
            if (!exists) {
              selectedHolidays.value.push({
                date: dateString,
                name: `${year}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`,
              })
              addedCount++
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

    // 清除批量选择的星期几休息日
    const clearWeekdaySelection = () => {
      selectedWeekdays.value = []
      handleWeekdayChange()
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
/* 你的样式代码保持不变 */
</style>