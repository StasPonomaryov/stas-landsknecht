import { collection, query, where, getDocs, getFirestore, Firestore } from "firebase/firestore";
import { useNuxtApp } from 'nuxt/app';
import { useClientsStore } from "~/stores/clients";
import type { Task, TasksChart, Client } from "~/types";

export const labelsMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const getTasksOfTheYear = async (year: number, uid: string) => {
  const db = (useNuxtApp().$firestore as Firestore);

  if (!db) {
    console.error('Firestore instance is not initialized');
    return [];
  }

  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  const tasksQuery = query(
    collection(db, "tasks"),
    where("users", "array-contains", uid),
    where("start", ">=", startOfYear),
    where("start", "<=", endOfYear)
  );

  try {
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[];

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const dataTasksOfMonths = (tasks: Task[], firstMonth: number, lastMonth: number) => {
  if (!tasks.length) {
    return [];
  }

  const data = tasks.filter((task) => {
    if (task.end) {
      const taskFinishedMonth = new Date(task.end).getMonth();

      return firstMonth <= taskFinishedMonth + 1 && taskFinishedMonth + 1 <= lastMonth;
    }
  });

  return data;
};

export const dataClientsOrdersCount = (tasks: Task[]) => {
  if (!tasks.length) {
    return [];
  }

  const data: TasksChart[] = [];

  labelsMonths.forEach((month, index) => {
    const monthIndex = String(index + 1).padStart(2, '0');
    const monthTasks = tasks.filter((task) => task.start.includes(`-${monthIndex}-`));
    const monthTasksCount = monthTasks.length;
    data.push({ month, count: monthTasksCount });
  });

  return data;
};

export const dataClientsOrdersIncome = (tasks: Task[], selectedYear: number) => {
  if (!tasks.length) {
    return [];
  }

  const data: TasksChart[] = [];

  labelsMonths.forEach((month, index) => {
    const monthIndex = String(index + 1).padStart(2, '0');
    let monthIncome = 0;

    tasks.forEach((task) => {
      const taskStart = new Date(task.start);
      const taskEnd = task.end ? new Date(task.end) : null;
      const prepayment = Number(task.priceStart) || 0;
      const postpayment = Number(task.priceEnd) || 0;

      const taskStartYear = taskStart.getFullYear();
      const taskStartMonth = String(taskStart.getMonth() + 1).padStart(2, '0');
      const taskEndYear = taskEnd ? taskEnd.getFullYear() : null;
      const taskEndMonth = taskEnd ? String(taskEnd.getMonth() + 1).padStart(2, '0') : null;

      if (taskStartYear === selectedYear && taskStartMonth === monthIndex && prepayment > 0) {
        monthIncome += prepayment;
      }

      if (taskEndYear === selectedYear && taskEndMonth === monthIndex && postpayment > 0) {
        monthIncome += postpayment;
      }
    });

    data.push({ month, count: monthIncome });
  });

  return data;
};

export const dataClientsByOrdersCount = (tasks: Task[]) => {
  if (!tasks.length) {
    return [];
  }

  const data: TasksChart[] = [];
  const allClients = useClientsStore().clients;

  const clients = tasks.reduce((acc: string[], task) => {
    if (!acc.includes(task.clientId)) {
      acc.push(task.clientId);
    }
    return acc;
  }, []);

  clients.forEach((clientId) => {
    const clientTasks = tasks.filter((task) => task.clientId === clientId);
    let name = allClients.find((client) => client.id === clientId)?.name || '';

    if (name.length) {
      name = `${name.substring(0, 5)}...`;
    }

    data.push({ clientId: name, count: clientTasks.length });
  });

  if (data.length > 1) {
    data.sort((a, b) => b.count - a.count);
  }

  return data;
};

export const computeKpiData = (tasks: Task[]) => {
  const totalIncome = tasks.reduce((acc, t) => acc + (Number(t.priceStart) || 0) + (Number(t.priceEnd) || 0), 0);
  const activeTasks = tasks.filter(t => t.status === 2).length;
  const tasksWithPrice = tasks.filter(t => Number(t.priceStart) > 0 || Number(t.priceEnd) > 0);
  const avgTaskValue = tasksWithPrice.length > 0 ? totalIncome / tasksWithPrice.length : 0;
  const nonCancelled = tasks.filter(t => t.status !== 0);
  const completionRate = nonCancelled.length > 0
    ? Math.round((tasks.filter(t => t.status === 1).length / nonCancelled.length) * 100)
    : 0;
  const pendingPaymentCount = tasks.filter(t => t.status === 1 && (!t.priceEnd || Number(t.priceEnd) === 0)).length;
  return { totalIncome, activeTasks, avgTaskValue, completionRate, pendingPaymentCount };
};

export const computeMonthComparison = (tasks: Task[], selectedYear: number) => {
  const today = new Date();
  const cm = today.getMonth() + 1;
  const lm = cm === 1 ? 12 : cm - 1;
  const lmYear = cm === 1 ? selectedYear - 1 : selectedYear;
  const cmStr = String(cm).padStart(2, '0');
  const lmStr = String(lm).padStart(2, '0');
  const thisMonthTasks = tasks.filter(t => t.start.startsWith(`${selectedYear}-${cmStr}`));
  const lastMonthTasks = tasks.filter(t => t.start.startsWith(`${lmYear}-${lmStr}`));
  const calcIncome = (ts: Task[]) => ts.reduce((a, t) => a + (Number(t.priceStart) || 0) + (Number(t.priceEnd) || 0), 0);
  return {
    thisMonth: { count: thisMonthTasks.length, income: calcIncome(thisMonthTasks) },
    lastMonth: { count: lastMonthTasks.length, income: calcIncome(lastMonthTasks) },
  };
};

export const computeStatusFunnel = (tasks: Task[]) => ({
  processing: tasks.filter(t => t.status === 2).length,
  done: tasks.filter(t => t.status === 1).length,
  cancelled: tasks.filter(t => t.status === 0).length,
  total: tasks.length,
});

export const computeActivityHeatmap = (tasks: Task[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.start) counts[t.start] = (counts[t.start] || 0) + 1;
    if (t.end) counts[t.end] = (counts[t.end] || 0) + 1;
  });
  return counts;
};

export const computeProductiveDays = (tasks: Task[]) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = new Array(7).fill(0);
  tasks.forEach(t => { if (t.start) counts[new Date(t.start).getDay()]++; });
  return days.map((day, i) => ({ day, count: counts[i] }));
};

export const computeNeedsAttention = (tasks: Task[], clients: Client[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(t => {
    if (!t.end || t.status === 1 || t.status === 0) return false;
    return new Date(t.end) < today;
  });
  const unpaidDone = tasks.filter(t => t.status === 1 && (!t.priceEnd || Number(t.priceEnd) === 0));
  const activeClientIds = new Set(tasks.map(t => t.clientId));
  const inactiveClients = clients.filter(c => !activeClientIds.has(c.id));
  return { overdue, unpaidDone, inactiveClients };
};

export const dataClientsByOrdersIncome = (tasks: Task[]) => {
  if (!tasks.length) {
    return [];
  }

  const data: TasksChart[] = [];
  const allClients = useClientsStore().clients;

  const clients = tasks.reduce((acc: string[], task) => {
    if (!acc.includes(task.clientId)) {
      acc.push(task.clientId);
    }
    return acc;
  }, []);

  clients.forEach((clientId) => {
    const clientTasks = tasks.filter((task) => task.clientId === clientId);
    const clientIncome = clientTasks.reduce((acc, task) => {
      const prepayment = Number(task.priceStart) || 0;
      const postpayment = Number(task.priceEnd) || 0;
      return acc + prepayment + postpayment;
    }, 0);
    let name = allClients.find((client) => client.id === clientId)?.name || '';

    if (name.length) {
      name = `${name.substring(0, 5)}...`;
    }

    data.push({ clientId: name, count: clientIncome });
  });

  if (data.length > 1) {
    data.sort((a, b) => b.count - a.count);
  }

  return data;
}