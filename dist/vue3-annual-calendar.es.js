import { ref as h, watch as _, computed as H, onMounted as W } from "vue";
import { ElCheckbox as b, ElCheckboxGroup as A, ElMessage as $ } from "element-plus";
const F = (r, f) => {
  const g = r.__vccOpts || r;
  for (const [a, l] of f)
    g[a] = l;
  return g;
}, I = {
  name: "AnnualCalendar",
  components: {
    ElCheckbox: b,
    ElCheckboxGroup: A
  },
  props: {
    // 年份
    year: {
      type: Number,
      default: () => (/* @__PURE__ */ new Date()).getFullYear()
    },
    // 初始节假日
    initialHolidays: {
      type: Array,
      default: () => []
    },
    // 是否显示批量选择器
    showBatchSelector: {
      type: Boolean,
      default: !0
    },
    // 自定义样式
    customStyles: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["holiday-change", "update:year"],
  setup(r, { emit: f }) {
    (/* @__PURE__ */ new Date()).getFullYear();
    const a = h(r.year), l = h([...r.initialHolidays]), d = h([]), v = ["日", "一", "二", "三", "四", "五", "六"], m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    _(() => r.year, (e) => {
      a.value = e;
    }), _(l, (e) => {
      f("holiday-change", e);
    }, { deep: !0 });
    const x = H(() => d.value.length === 0 ? "无" : d.value.sort((e, t) => e - t).map((e) => v[e]).join("、")), C = (e) => {
      const t = [], n = new Date(a.value, e - 1, 1), u = new Date(a.value, e, 0), y = n.getDay(), o = new Date(a.value, e - 1, 0).getDate();
      for (let s = y - 1; s >= 0; s--) {
        const D = new Date(a.value, e - 2, o - s);
        t.push({
          day: o - s,
          date: D,
          isCurrentMonth: !1
        });
      }
      for (let s = 1; s <= u.getDate(); s++) {
        const D = new Date(a.value, e - 1, s);
        t.push({
          day: s,
          date: D,
          isCurrentMonth: !0
        });
      }
      const w = 42 - t.length;
      for (let s = 1; s <= w; s++) {
        const D = new Date(a.value, e, s);
        t.push({
          day: s,
          date: D,
          isCurrentMonth: !1
        });
      }
      return t;
    }, M = (e) => {
      const t = c(e);
      return l.value.some((n) => n.date === t);
    }, S = (e) => {
      const t = /* @__PURE__ */ new Date();
      return e.getDate() === t.getDate() && e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear();
    }, k = (e) => {
      if (!e.isCurrentMonth)
        return;
      const t = c(e.date), n = l.value.findIndex((u) => u.date === t);
      n === -1 ? l.value.push({
        date: t,
        name: `${a.value}年${e.date.getMonth() + 1}月${e.date.getDate()}日`
      }) : l.value.splice(n, 1);
    }, c = (e) => {
      const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), u = String(e.getDate()).padStart(2, "0");
      return `${t}-${n}-${u}`;
    }, p = () => {
      const e = a.value, t = [...d.value];
      if (l.value = l.value.filter((n) => {
        if (parseInt(n.date.split("-")[0]) !== e)
          return !0;
        const o = new Date(n.date).getDay();
        return !!(t.includes(o) || [
          `${e}-01-01`,
          `${e}-05-01`,
          `${e}-10-01`
        ].includes(n.date));
      }), t.length > 0) {
        const n = new Date(e, 0, 1), u = new Date(e, 11, 31);
        let y = 0;
        const o = new Date(n);
        for (; o <= u; ) {
          if (t.includes(o.getDay())) {
            const i = c(o);
            l.value.some((s) => s.date === i) || (l.value.push({
              date: i,
              name: `${e}年${o.getMonth() + 1}月${o.getDate()}日`
            }), y++);
          }
          o.setDate(o.getDate() + 1);
        }
        y > 0 && $.success(
          `已更新休息日设置，当前共 ${l.value.filter((i) => parseInt(i.date.split("-")[0]) === e).length} 个休息日`
        );
      } else
        $.info("已清除所有批量选择的休息日，保留手动设置的节假日");
    }, Y = () => {
      d.value = [], p();
    };
    return W(() => {
      if (r.initialHolidays.length === 0) {
        const e = new Date(a.value, 0, 1), t = new Date(a.value, 4, 1), n = new Date(a.value, 9, 1);
        l.value = [
          { date: c(e), name: `${a.value}年元旦` },
          { date: c(t), name: `${a.value}年劳动节` },
          { date: c(n), name: `${a.value}年国庆节` }
        ];
      }
    }), {
      selectedYear: a,
      weekdays: v,
      months: m,
      selectedHolidays: l,
      selectedWeekdays: d,
      getSelectedWeekdaysText: x,
      getMonthDays: C,
      toggleHoliday: k,
      isSelected: M,
      isToday: S,
      formatDate: c,
      handleWeekdayChange: p,
      clearWeekdaySelection: Y
    };
  }
};
function E(r, f, g, a, l, d) {
  return null;
}
const O = /* @__PURE__ */ F(I, [["render", E], ["__scopeId", "data-v-f9e0d01d"]]), T = {
  install(r) {
    r.component("AnnualCalendar", O);
  }
};
export {
  O as AnnualCalendar,
  T as default
};
