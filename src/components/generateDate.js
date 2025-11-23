
/**
* 生成年度数据 
* @param {number|string} year - 年份
* @param {Object} options - 配置选项
* @returns {Object} 返回年度数据
*/
export function generateYearHolidayDataEnhanced(year = new Date().getFullYear(), options = {}) {
    const {
        includeFixedHolidays = true,  // 是否包含固定节假日
        includeWeekends = false,      // 是否默认包含周末
        customHolidays = [],          // 自定义节假日
        workdays = []                 // 调休工作日（原本是休息日但需要上班）
    } = options;

    const yearStr = String(year);
    const days = [];
    const startDate = new Date(yearStr, 0, 1);
    const endDate = new Date(yearStr, 11, 31);

    // 固定节假日（可根据实际情况调整）
    // const fixedHolidays = [
    //     '01-01', // 元旦
    //     '05-01', // 劳动节
    //     '10-01', // 国庆节
    //     '10-02',
    //     '10-03'
    // ];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${month}-${day}`;
        const weekday = currentDate.getDay();

        let isHoliday = false;

        // 检查是否为固定节假日
        // if (includeFixedHolidays && fixedHolidays.includes(dateStr)) {
        //     isHoliday = true;
        // }

        // 检查是否为自定义节假日
        // if (customHolidays.includes(dateStr)) {
        //     isHoliday = true;
        // }

        // 检查是否为周末
        // if (includeWeekends && (weekday === 0 || weekday === 6)) {
        //     isHoliday = true;
        // }

        // 检查是否为调休工作日
        // if (workdays.includes(dateStr)) {
        //     isHoliday = false;
        // }

        days.push({
            date: dateStr,
            isHoliday: isHoliday,
            weekday: weekday
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        year: yearStr,
        days: days
    };
}
 
/**
* 计算当前日期是今年的第几天（月份累计法）
* @param {Date} date - 要计算的日期
* @returns {number} 第几天
*/
export function getDayOfYearByMonth(date = new Date()) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // 检查是否是闰年
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) {
        monthDays[1] = 29; // 闰年2月29天
    }

    let dayOfYear = day;
    for (let i = 0; i < month; i++) {
        dayOfYear += monthDays[i];
    }

    return dayOfYear;
}