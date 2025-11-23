import { ref as w, computed as P, watch as W, onMounted as Q, resolveComponent as k, openBlock as f, createElementBlock as h, createElementVNode as r, Fragment as H, renderList as x, createBlock as X, createVNode as m, withCtx as D, createTextVNode as M, toDisplayString as Y, normalizeClass as Z, createCommentVNode as ee } from "vue";
import { ElMessage as B } from "element-plus";
function te(o = (/* @__PURE__ */ new Date()).getFullYear(), p = {}) {
  const s = String(o), i = [], y = new Date(s, 0, 1), v = new Date(s, 11, 31), d = new Date(y);
  for (; d <= v; ) {
    const l = String(d.getMonth() + 1).padStart(2, "0"), g = String(d.getDate()).padStart(2, "0"), V = `${l}-${g}`, I = d.getDay();
    let F = !1;
    i.push({
      date: V,
      isHoliday: F,
      weekday: I
    }), d.setDate(d.getDate() + 1);
  }
  return {
    year: s,
    days: i
  };
}
function S(o = /* @__PURE__ */ new Date()) {
  const p = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], s = o.getFullYear(), i = o.getMonth(), y = o.getDate();
  (s % 4 === 0 && s % 100 !== 0 || s % 400 === 0) && (p[1] = 29);
  let d = y;
  for (let l = 0; l < i; l++)
    d += p[l];
  return d;
}
const ae = (o, p) => {
  const s = o.__vccOpts || o;
  for (const [i, y] of p)
    s[i] = y;
  return s;
}, le = { class: "calendar-container" }, ne = { class: "batch-selector" }, oe = { style: { display: "flex", "justify-content": "space-between" } }, se = { class: "weekday-checkboxes" }, re = { class: "calendar-grid" }, de = { class: "month-header" }, ie = { class: "calendar" }, ce = { class: "weekdays" }, ue = { class: "days" }, ye = ["onClick"], ve = {
  key: 0,
  class: "selected-indicator"
}, ge = { class: "dialog-footer" }, fe = "120px", pe = {
  __name: "AnnualCalendar",
  props: {
    // 初始年份
    year: {
      type: Number,
      default: () => (/* @__PURE__ */ new Date()).getFullYear()
    },
    // 初始休息日数据
    initialHolidays: {
      type: Array,
      default: () => []
    },
    // 是否显示批量选择器
    showBatchSelector: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["update:year", "holiday-change", "year-change"],
  setup(o, { expose: p, emit: s }) {
    const i = o, y = s, v = w(!1), d = w([]), l = w({
      year: "",
      days: []
    }), g = w({
      dateRange: []
    }), V = ["日", "一", "二", "三", "四", "五", "六"], I = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], F = w([
      { value: "1", label: "周一休息" },
      { value: "2", label: "周二休息" },
      { value: "3", label: "周三休息" },
      { value: "4", label: "周四休息" },
      { value: "5", label: "周五休息" },
      { value: "6", label: "周六休息" },
      { value: "0", label: "周日休息" }
    ]), N = P(() => l.value.days.filter((e) => e.isHoliday).map((e) => e.date)), j = (e) => {
      const t = [], c = new Date(l.value.year, e - 1, 1), u = new Date(l.value.year, e, 0), _ = c.getDay(), C = new Date(l.value.year, e - 1, 0).getDate();
      for (let a = _ - 1; a >= 0; a--) {
        const n = new Date(l.value.year, e - 2, C - a);
        t.push({
          day: C - a,
          date: n,
          isCurrentMonth: !1
        });
      }
      for (let a = 1; a <= u.getDate(); a++) {
        const n = new Date(l.value.year, e - 1, a);
        t.push({
          day: a,
          date: n,
          isCurrentMonth: !0,
          keyId: S(n) - 1
        });
      }
      const $ = 42 - t.length;
      for (let a = 1; a <= $; a++) {
        const n = new Date(l.value.year, e, a);
        t.push({
          day: a,
          date: n,
          isCurrentMonth: !1
        });
      }
      return t;
    }, T = (e) => {
      const t = /* @__PURE__ */ new Date();
      return e.getDate() === t.getDate() && e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear();
    }, U = (e) => {
      e.isCurrentMonth && (l.value.days[e.keyId].isHoliday = !l.value.days[e.keyId].isHoliday, b());
    }, z = (e, t) => {
      l.value.days.forEach((c) => {
        c.weekday == t && (c.isHoliday = e);
      }), b();
    }, q = () => {
      v.value = !0;
    }, G = (e) => e.getFullYear() != l.value.year, J = () => {
      if (g.value.dateRange.length !== 2) {
        B.error("请选择日期范围");
        return;
      }
      const [e, t] = g.value.dateRange, c = S(e) - 1, u = S(t) - 1;
      for (let _ = c; _ <= u; _++)
        l.value.days[_].isHoliday = !0;
      v.value = !1, b(), B.success("批量设置休息日成功");
    }, b = () => {
      y("holiday-change", N.value);
    }, E = (e) => {
      l.value.year = e, l.value = te(e), g.value.dateRange = [new Date(e, 0, 1), new Date(e, 0, 1)], d.value = [], y("year-change", e), b(), B.success(`已切换到 ${e} 年`);
    }, O = (e) => {
      l.value.days.forEach((t) => {
        t.isHoliday = !1;
      }), e.forEach((t) => {
        const c = new Date(t), u = S(c) - 1;
        l.value.days[u] && (l.value.days[u].isHoliday = !0);
      }), b();
    };
    return W(
      () => i.year,
      (e) => {
        e !== l.value.year && E(e);
      }
    ), W(
      () => i.initialHolidays,
      (e) => {
        e && e.length > 0 && O(e);
      },
      { immediate: !0 }
    ), p({
      loadNewYear: E,
      setHolidays: O,
      getSelectedHolidays: () => N.value,
      getHolidayData: () => l.value
    }), Q(() => {
      E(i.year);
    }), (e, t) => {
      const c = k("el-checkbox"), u = k("el-button"), _ = k("el-date-picker"), C = k("el-form-item"), R = k("el-form"), $ = k("el-dialog");
      return f(), h("div", le, [
        r("div", ne, [
          t[6] || (t[6] = r("h3", null, "批量选择休息日", -1)),
          r("div", oe, [
            r("div", se, [
              (f(!0), h(H, null, x(F.value, (a) => (f(), X(c, {
                key: a.value,
                label: a.label,
                onChange: (n) => z(n, a.value)
              }, null, 8, ["label", "onChange"]))), 128))
            ]),
            m(u, {
              link: "",
              type: "primary",
              onClick: t[0] || (t[0] = (a) => q())
            }, {
              default: D(() => [...t[5] || (t[5] = [
                M(" 批量设置休息日 ", -1)
              ])]),
              _: 1
            })
          ])
        ]),
        r("div", re, [
          (f(), h(H, null, x(I, (a) => r("div", {
            key: a,
            class: "month-card"
          }, [
            r("div", de, Y(l.value.year) + "年 " + Y(a) + "月", 1),
            r("div", ie, [
              r("div", ce, [
                (f(), h(H, null, x(V, (n) => r("div", { key: n }, Y(n), 1)), 64))
              ]),
              r("div", ue, [
                (f(!0), h(H, null, x(j(a), (n, K) => {
                  var A, L;
                  return f(), h("div", {
                    key: K,
                    class: Z(["day", {
                      "other-month": !n.isCurrentMonth,
                      selected: (A = l.value.days[n.keyId]) == null ? void 0 : A.isHoliday,
                      today: T(n.date)
                    }]),
                    onClick: (he) => U(n)
                  }, [
                    M(Y(n.isCurrentMonth ? n.day : "") + " ", 1),
                    (L = l.value.days[n.keyId]) != null && L.isHoliday ? (f(), h("div", ve, "休")) : ee("", !0)
                  ], 10, ye);
                }), 128))
              ])
            ])
          ])), 64))
        ]),
        m($, {
          modelValue: v.value,
          "onUpdate:modelValue": t[4] || (t[4] = (a) => v.value = a),
          title: "批量设置休假日期",
          width: "500"
        }, {
          footer: D(() => [
            r("div", ge, [
              m(u, {
                onClick: t[2] || (t[2] = (a) => v.value = !1)
              }, {
                default: D(() => [...t[7] || (t[7] = [
                  M("取消", -1)
                ])]),
                _: 1
              }),
              m(u, {
                type: "primary",
                onClick: t[3] || (t[3] = (a) => J())
              }, {
                default: D(() => [...t[8] || (t[8] = [
                  M("确认", -1)
                ])]),
                _: 1
              })
            ])
          ]),
          default: D(() => [
            m(R, { model: g.value }, {
              default: D(() => [
                m(C, {
                  label: "日期范围",
                  "label-width": fe
                }, {
                  default: D(() => [
                    m(_, {
                      modelValue: g.value.dateRange,
                      "onUpdate:modelValue": t[1] || (t[1] = (a) => g.value.dateRange = a),
                      type: "daterange",
                      "disabled-date": G,
                      "range-separator": "至",
                      "start-placeholder": "开始日期",
                      "end-placeholder": "结束日期"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, _e = /* @__PURE__ */ ae(pe, [["__scopeId", "data-v-cbea903a"]]), ke = {
  install(o) {
    o.component("AnnualCalendar", _e);
  }
};
export {
  _e as AnnualCalendar,
  ke as default
};
