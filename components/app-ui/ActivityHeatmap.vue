<template>
  <div class="card">
    <h3>Activity {{ year }}</h3>
    <div class="overflow-x-auto pb-2">
      <div class="heatmap-wrap">
        <div class="day-labels">
          <div class="month-spacer"></div>
          <div v-for="label in dayLabels" :key="label" class="day-label">{{ label }}</div>
        </div>
        <div class="weeks-wrap">
          <div v-for="(weekData, wi) in weeksWithLabels" :key="wi" class="week-col">
            <div class="month-label">{{ weekData.label }}</div>
            <div v-for="(day, di) in weekData.week" :key="di"
              :class="['heat-cell', getCellClass(day)]"
              :title="day && day.count > 0 ? `${day.date}: ${day.count} event(s)` : day ? day.date : ''">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="legend">
      <span class="legend-label">Less</span>
      <div class="heat-cell heat-0"></div>
      <div class="heat-cell heat-1"></div>
      <div class="heat-cell heat-2"></div>
      <div class="heat-cell heat-3"></div>
      <div class="heat-cell heat-4"></div>
      <span class="legend-label">More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { labelsMonths } from '~/composables/useAnalytics';

type DayCell = { date: string; count: number } | null;

const props = defineProps<{
  activity: Record<string, number>;
  year: number;
}>();

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const weeks = computed((): DayCell[][] => {
  const startDate = new Date(props.year, 0, 1);
  const endDate = new Date(props.year, 11, 31);
  const result: DayCell[][] = [];
  let week: DayCell[] = [];

  for (let i = 0; i < startDate.getDay(); i++) week.push(null);

  const d = new Date(startDate);
  while (d <= endDate) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${day}`;
    week.push({ date: iso, count: props.activity[iso] || 0 });
    if (week.length === 7) {
      result.push(week);
      week = [];
    }
    d.setDate(d.getDate() + 1);
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    result.push(week);
  }
  return result;
});

const weeksWithLabels = computed(() =>
  weeks.value.map((week, i) => {
    const firstDay = week.find((d): d is NonNullable<DayCell> => d !== null);
    const prevWeekLastDay = i > 0
      ? [...weeks.value[i - 1]].reverse().find((d): d is NonNullable<DayCell> => d !== null)
      : undefined;

    let label = '';
    if (firstDay) {
      const [, mStr] = firstDay.date.split('-');
      const month = parseInt(mStr) - 1;
      const prevMonth = prevWeekLastDay ? parseInt(prevWeekLastDay.date.split('-')[1]) - 1 : -1;
      if (month !== prevMonth) label = labelsMonths[month];
    }
    return { week, label };
  })
);

const getCellClass = (day: DayCell): string => {
  if (!day) return 'heat-empty';
  if (day.count === 0) return 'heat-0';
  if (day.count === 1) return 'heat-1';
  if (day.count <= 3) return 'heat-2';
  if (day.count <= 5) return 'heat-3';
  return 'heat-4';
};
</script>

<style scoped>
.heatmap-wrap {
  display: flex;
  gap: 4px;
  width: max-content;
}
.day-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-right: 2px;
}
.month-spacer { height: 14px; }
.day-label {
  width: 12px;
  height: 12px;
  font-size: 8px;
  opacity: 0.45;
  display: flex;
  align-items: center;
  justify-content: center;
}
.weeks-wrap {
  display: flex;
  gap: 3px;
}
.week-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.month-label {
  height: 14px;
  font-size: 9px;
  opacity: 0.6;
  white-space: nowrap;
  line-height: 14px;
}
.heat-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: default;
  transition: opacity 150ms ease;
}
.heat-cell:hover {
  opacity: 0.75;
}
.heat-empty { background-color: transparent; }
.heat-0 { background-color: rgba(var(--divider-color)); }
.heat-1 { background-color: rgba(80, 200, 120, 0.2); }
.heat-2 { background-color: rgba(80, 200, 120, 0.45); }
.heat-3 { background-color: rgba(80, 200, 120, 0.7); }
.heat-4 { background-color: var(--primary-color); }
.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.75rem;
  justify-content: flex-end;
}
.legend-label { font-size: 0.65rem; opacity: 0.45; }
</style>
