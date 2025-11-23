import { ref as w, computed as P, watch as U, onMounted as Q, resolveComponent as k, openBlock as h, createElementBlock as _, createElementVNode as d, Fragment as x, renderList as M, createBlock as X, createVNode as m, withCtx as D, createTextVNode as V, toDisplayString as Y, normalizeClass as Z, createCommentVNode as ee } from "vue";
import { ElMessage as B } from "element-plus";
function te(o = (/* @__PURE__ */ new Date()).getFullYear(), g = {}) {
  const s = String(o), c = [], y = new Date(s, 0, 1), v = new Date(s, 11, 31), r = new Date(y);
  for (; r <= v; ) {
    const l = String(r.getMonth() + 1).padStart(2, "0"), f = String(r.getDate()).padStart(2, "0"), I = `${l}-${f}`, E = r.getDay();
    let C = !1;
    c.push({
      date: I,
      isHoliday: C,
      weekday: E
    }), r.setDate(r.getDate() + 1);
  }
  return {
    year: s,
    days: c
  };
}
function S(o = /* @__PURE__ */ new Date()) {
  const g = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], s = o.getFullYear(), c = o.getMonth(), y = o.getDate();
  (s % 4 === 0 && s % 100 !== 0 || s % 400 === 0) && (g[1] = 29);
  let r = y;
  for (let l = 0; l < c; l++)
    r += g[l];
  return r;
}
const ae = (o, g) => {
  const s = o.__vccOpts || o;
  for (const [c, y] of g)
    s[c] = y;
  return s;
}, le = { class: "calendar-container" }, ne = { class: "batch-selector" }, oe = { style: { display: "flex", "justify-content": "space-between" } }, se = { class: "weekday-checkboxes" }, de = { class: "calendar-grid" }, re = { class: "month-header" }, ce = { class: "calendar" }, ie = { class: "weekdays" }, ue = { class: "days" }, ye = ["onClick"], ve = {
  key: 0,
  class: "selected-indicator"
}, fe = { class: "dialog-footer" }, he = "120px", ge = {
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
  setup(o, { expose: g, emit: s }) {
    const c = o, y = s, v = w(!1), r = w([]), l = w({
      year: "",
      days: []
    }), f = w({
      dateRange: []
    }), I = ["日", "一", "二", "三", "四", "五", "六"], E = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], C = w([
      { value: "1", label: "周一休息", checked: !1 },
      { value: "2", label: "周二休息", checked: !1 },
      { value: "3", label: "周三休息", checked: !1 },
      { value: "4", label: "周四休息", checked: !1 },
      { value: "5", label: "周五休息", checked: !1 },
      { value: "6", label: "周六休息", checked: !1 },
      { value: "0", label: "周日休息", checked: !1 }
    ]), N = P(() => l.value.days.filter((e) => e.isHoliday).map((e) => e.date)), W = (e) => {
      const t = [], i = new Date(l.value.year, e - 1, 1), u = new Date(l.value.year, e, 0), p = i.getDay(), H = new Date(l.value.year, e - 1, 0).getDate();
      for (let a = p - 1; a >= 0; a--) {
        const n = new Date(l.value.year, e - 2, H - a);
        t.push({
          day: H - a,
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
    }, j = (e) => {
      const t = /* @__PURE__ */ new Date();
      return e.getDate() === t.getDate() && e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear();
    }, T = (e) => {
      e.isCurrentMonth && (l.value.days[e.keyId].isHoliday = !l.value.days[e.keyId].isHoliday, b());
    }, z = (e, t) => {
      l.value.days.forEach((i) => {
        i.weekday == t && (i.isHoliday = e);
      }), b();
    }, q = () => {
      v.value = !0;
    }, G = (e) => e.getFullYear() != l.value.year, J = () => {
      if (f.value.dateRange.length !== 2) {
        B.error("请选择日期范围");
        return;
      }
      const [e, t] = f.value.dateRange, i = S(e) - 1, u = S(t) - 1;
      for (let p = i; p <= u; p++)
        l.value.days[p].isHoliday = !0;
      v.value = !1, b(), B.success("批量设置休息日成功");
    }, b = () => {
      y("holiday-change", N.value);
    }, F = (e) => {
      l.value.year = e, l.value = te(e), f.value.dateRange = [new Date(e, 0, 1), new Date(e, 0, 1)], r.value = [], y("year-change", e), b(), B.success(`已切换到 ${e} 年`);
    }, O = (e) => {
      l.value.days.forEach((t) => {
        t.isHoliday = !1;
      }), e.forEach((t) => {
        const i = new Date(t), u = S(i) - 1;
        l.value.days[u] && (l.value.days[u].isHoliday = !0);
      }), b();
    };
    return U(
      () => c.year,
      (e) => {
        e !== l.value.year && (F(e), C.value.forEach((t) => {
          t.checked = !1;
        }));
      }
    ), U(
      () => c.initialHolidays,
      (e) => {
        e && e.length > 0 && O(e);
      },
      { immediate: !0 }
    ), g({
      loadNewYear: F,
      setHolidays: O,
      getSelectedHolidays: () => N.value,
      getHolidayData: () => l.value
    }), Q(() => {
      F(c.year);
    }), (e, t) => {
      const i = k("el-checkbox"), u = k("el-button"), p = k("el-date-picker"), H = k("el-form-item"), R = k("el-form"), $ = k("el-dialog");
      return h(), _("div", le, [
        d("div", ne, [
          t[6] || (t[6] = d("h3", null, "批量选择休息日", -1)),
          d("div", oe, [
            d("div", se, [
              (h(!0), _(x, null, M(C.value, (a) => (h(), X(i, {
                key: a.value,
                label: a.label,
                onChange: (n) => z(n, a.value),
                modelValue: a.checked,
                "onUpdate:modelValue": (n) => a.checked = n
              }, null, 8, ["label", "onChange", "modelValue", "onUpdate:modelValue"]))), 128))
            ]),
            m(u, {
              link: "",
              type: "primary",
              onClick: t[0] || (t[0] = (a) => q())
            }, {
              default: D(() => [...t[5] || (t[5] = [
                V(" 批量设置休息日 ", -1)
              ])]),
              _: 1
            })
          ])
        ]),
        d("div", de, [
          (h(), _(x, null, M(E, (a) => d("div", {
            key: a,
            class: "month-card"
          }, [
            d("div", re, Y(l.value.year) + "年 " + Y(a) + "月", 1),
            d("div", ce, [
              d("div", ie, [
                (h(), _(x, null, M(I, (n) => d("div", { key: n }, Y(n), 1)), 64))
              ]),
              d("div", ue, [
                (h(!0), _(x, null, M(W(a), (n, K) => {
                  var A, L;
                  return h(), _("div", {
                    key: K,
                    class: Z(["day", {
                      "other-month": !n.isCurrentMonth,
                      selected: (A = l.value.days[n.keyId]) == null ? void 0 : A.isHoliday,
                      today: j(n.date)
                    }]),
                    onClick: (_e) => T(n)
                  }, [
                    V(Y(n.isCurrentMonth ? n.day : "") + " ", 1),
                    (L = l.value.days[n.keyId]) != null && L.isHoliday ? (h(), _("div", ve, "休")) : ee("", !0)
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
            d("div", fe, [
              m(u, {
                onClick: t[2] || (t[2] = (a) => v.value = !1)
              }, {
                default: D(() => [...t[7] || (t[7] = [
                  V("取消", -1)
                ])]),
                _: 1
              }),
              m(u, {
                type: "primary",
                onClick: t[3] || (t[3] = (a) => J())
              }, {
                default: D(() => [...t[8] || (t[8] = [
                  V("确认", -1)
                ])]),
                _: 1
              })
            ])
          ]),
          default: D(() => [
            m(R, { model: f.value }, {
              default: D(() => [
                m(H, {
                  label: "日期范围",
                  "label-width": he
                }, {
                  default: D(() => [
                    m(p, {
                      modelValue: f.value.dateRange,
                      "onUpdate:modelValue": t[1] || (t[1] = (a) => f.value.dateRange = a),
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
}, pe = /* @__PURE__ */ ae(ge, [["__scopeId", "data-v-f255a51b"]]), ke = {
  install(o) {
    o.component("AnnualCalendar", pe);
  }
};
export {
  pe as AnnualCalendar,
  ke as default
};
