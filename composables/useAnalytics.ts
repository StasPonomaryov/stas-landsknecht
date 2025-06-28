import { collection, query, where, getDocs, getFirestore, Firestore } from "firebase/firestore";
import { useNuxtApp } from 'nuxt/app';
import type { Task, TasksChart } from "~/types";

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

export const getTasksOfTheYear = async (year: number) => {
  const db = (useNuxtApp().$firestore as Firestore);

  if (!db) {
    console.error('Firestore instance is not initialized');
    return [];
  }

  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  const tasksQuery = query(
    collection(db, "tasks"),
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

  console.log('Tasks', tasks);

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