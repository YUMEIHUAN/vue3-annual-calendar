import { ref as M, watch as A, computed as U, onMounted as j, resolveComponent as I, openBlock as g, createElementBlock as f, createElementVNode as c, createVNode as D, withCtx as h, createTextVNode as _, toDisplayString as x, Fragment as $, renderList as V, normalizeClass as z, createCommentVNode as G } from "vue";
import { ElCheckbox as q, ElCheckboxGroup as J, ElMessage as N } from "element-plus";
const K = (u, n) => {
  const S = u.__vccOpts || u;
  for (const [t, o] of n)
    S[t] = o;
  return S;
}, P = {
  name: "AnnualCalendar",
  components: {
    ElCheckbox: q,
    ElCheckboxGroup: J
  },
  props: {
    year: {
      type: Number,
      default: () => (/* @__PURE__ */ new Date()).getFullYear()
    },
    initialHolidays: {
      type: Array,
      default: () => []
    },
    showBatchSelector: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["holiday-change", "update:year"],
  setup(u, { emit: n }) {
    (/* @__PURE__ */ new Date()).getFullYear();
    const t = M(u.year), o = M([...u.initialHolidays]), p = M([]), d = M(/* @__PURE__ */ new Set()), b = ["日", "一", "二", "三", "四", "五", "六"], k = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    A(() => u.year, (e) => {
      t.value = e, p.value.length > 0 && Y();
    }), A(o, (e) => {
      n("holiday-change", e);
    }, { deep: !0 });
    const i = U(() => p.value.length === 0 ? "无" : p.value.sort((e, a) => e - a).map((e) => b[e]).join("、")), W = (e) => {
      const a = [], l = new Date(t.value, e - 1, 1), y = new Date(t.value, e, 0), w = l.getDay(), r = new Date(t.value, e - 1, 0).getDate();
      for (let s = w - 1; s >= 0; s--) {
        const C = new Date(t.value, e - 2, r - s);
        a.push({
          day: r - s,
          date: C,
          isCurrentMonth: !1
        });
      }
      for (let s = 1; s <= y.getDate(); s++) {
        const C = new Date(t.value, e - 1, s);
        a.push({
          day: s,
          date: C,
          isCurrentMonth: !0
        });
      }
      const E = 42 - a.length;
      for (let s = 1; s <= E; s++) {
        const C = new Date(t.value, e, s);
        a.push({
          day: s,
          date: C,
          isCurrentMonth: !1
        });
      }
      return a;
    }, F = (e) => {
      const a = m(e);
      return o.value.some((l) => l.date === a);
    }, T = (e) => {
      const a = /* @__PURE__ */ new Date();
      return e.getDate() === a.getDate() && e.getMonth() === a.getMonth() && e.getFullYear() === a.getFullYear();
    }, B = (e) => {
      if (!e.isCurrentMonth)
        return;
      const a = m(e.date), l = o.value.findIndex((y) => y.date === a);
      l === -1 ? (o.value.push({
        date: a,
        name: `${t.value}年${e.date.getMonth() + 1}月${e.date.getDate()}日`
      }), d.value.delete(a)) : (o.value.splice(l, 1), d.value.delete(a));
    }, m = (e) => {
      const a = e.getFullYear(), l = String(e.getMonth() + 1).padStart(2, "0"), y = String(e.getDate()).padStart(2, "0");
      return `${a}-${l}-${y}`;
    }, Y = () => {
      const e = t.value, a = [...p.value];
      if (o.value = o.value.filter((l) => {
        if (parseInt(l.date.split("-")[0]) !== e || H(l.date, e) || !d.value.has(l.date))
          return !0;
        const r = new Date(l.date).getDay();
        return a.includes(r);
      }), d.value.clear(), a.length > 0) {
        const l = new Date(e, 0, 1), y = new Date(e, 11, 31);
        let w = 0;
        const r = new Date(l);
        for (; r <= y; ) {
          if (a.includes(r.getDay())) {
            const v = m(r);
            if (H(v, e)) {
              r.setDate(r.getDate() + 1);
              continue;
            }
            o.value.some((s) => s.date === v) ? H(v, e) || d.value.add(v) : (o.value.push({
              date: v,
              name: `${e}年${r.getMonth() + 1}月${r.getDate()}日`
            }), d.value.add(v), w++);
          }
          r.setDate(r.getDate() + 1);
        }
        w > 0 && N.success(
          `已更新休息日设置，当前共 ${o.value.filter((v) => parseInt(v.date.split("-")[0]) === e).length} 个休息日`
        );
      } else
        N.info("已清除所有批量选择的休息日，保留手动设置的节假日");
    }, H = (e, a) => [
      `${a}-01-01`,
      // 元旦
      `${a}-05-01`,
      // 劳动节
      `${a}-10-01`
      // 国庆节
    ].includes(e), L = () => {
      Y();
    }, O = () => {
      p.value = [], Y();
    };
    return j(() => {
      if (u.initialHolidays.length === 0) {
        const e = new Date(t.value, 0, 1), a = new Date(t.value, 4, 1), l = new Date(t.value, 9, 1);
        o.value = [
          { date: m(e), name: `${t.value}年元旦` },
          { date: m(a), name: `${t.value}年劳动节` },
          { date: m(l), name: `${t.value}年国庆节` }
        ];
      }
    }), {
      selectedYear: t,
      weekdays: b,
      months: k,
      selectedHolidays: o,
      selectedWeekdays: p,
      getSelectedWeekdaysText: i,
      getMonthDays: W,
      toggleHoliday: B,
      isSelected: F,
      isToday: T,
      formatDate: m,
      handleWeekdayChange: L,
      clearWeekdaySelection: O
    };
  }
}, Q = { id: "app" }, R = { class: "calendar-container" }, X = { class: "batch-selector" }, Z = { class: "weekday-checkboxes" }, ee = { class: "selected-info" }, te = { class: "calendar-grid" }, ae = { class: "month-header" }, ne = { class: "calendar" }, le = { class: "weekdays" }, se = { class: "days" }, oe = ["onClick"], de = {
  key: 0,
  class: "selected-indicator"
};
function re(u, n, S, t, o, p) {
  const d = I("el-checkbox"), b = I("el-checkbox-group");
  return g(), f("div", Q, [
    c("div", R, [
      c("div", X, [
        n[8] || (n[8] = c("h3", null, "批量选择休息日", -1)),
        c("div", Z, [
          D(b, {
            modelValue: t.selectedWeekdays,
            "onUpdate:modelValue": n[0] || (n[0] = (k) => t.selectedWeekdays = k),
            onChange: t.handleWeekdayChange
          }, {
            default: h(() => [
              D(d, { label: 1 }, {
                default: h(() => [...n[1] || (n[1] = [
                  _("周一休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 2 }, {
                default: h(() => [...n[2] || (n[2] = [
                  _("周二休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 3 }, {
                default: h(() => [...n[3] || (n[3] = [
                  _("周三休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 4 }, {
                default: h(() => [...n[4] || (n[4] = [
                  _("周四休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 5 }, {
                default: h(() => [...n[5] || (n[5] = [
                  _("周五休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 6 }, {
                default: h(() => [...n[6] || (n[6] = [
                  _("周六休息", -1)
                ])]),
                _: 1
              }),
              D(d, { label: 0 }, {
                default: h(() => [...n[7] || (n[7] = [
                  _("周日休息", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue", "onChange"]),
          c("div", ee, "已选择: " + x(t.getSelectedWeekdaysText), 1)
        ])
      ]),
      c("div", te, [
        (g(!0), f($, null, V(t.months, (k) => (g(), f("div", {
          key: k,
          class: "month-card"
        }, [
          c("div", ae, x(t.selectedYear) + "年" + x(k) + "月", 1),
          c("div", ne, [
            c("div", le, [
              (g(!0), f($, null, V(t.weekdays, (i) => (g(), f("div", { key: i }, x(i), 1))), 128))
            ]),
            c("div", se, [
              (g(!0), f($, null, V(t.getMonthDays(k), (i, W) => (g(), f("div", {
                key: W,
                class: z(["day", {
                  "other-month": !i.isCurrentMonth,
                  selected: t.isSelected(i.date),
                  today: t.isToday(i.date)
                }]),
                onClick: (F) => t.toggleHoliday(i)
              }, [
                _(x(i.isCurrentMonth ? i.day : "") + " ", 1),
                t.isSelected(i.date) ? (g(), f("div", de, "休")) : G("", !0)
              ], 10, oe))), 128))
            ])
          ])
        ]))), 128))
      ]),
      n[9] || (n[9] = c("div", { class: "footer" }, [
        c("p", null, "Element UI + Vue3 年度节假日日历 - 点击日期可标记为节假日，支持批量选择")
      ], -1))
    ])
  ]);
}
const ie = /* @__PURE__ */ K(P, [["render", re], ["__scopeId", "data-v-e28d46dc"]]), ve = {
  install(u) {
    u.component("AnnualCalendar", ie);
  }
};
export {
  ie as AnnualCalendar,
  ve as default
};
