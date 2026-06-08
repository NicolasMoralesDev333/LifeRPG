export function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function createSeedScore(seed) {
  return Array.from(seed).reduce(
    (score, char, index) => score + char.charCodeAt(0) * (index + 3),
    0,
  );
}

export function generateMockActivityLogs(seed = "demo-user", today = new Date()) {
  const seedScore = createSeedScore(seed);
  const logs = [];

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dayScore = (seedScore + offset * 17 + date.getDate() * 11) % 7;
    const completions = Math.max(0, dayScore - 1);

    for (let index = 0; index < completions; index += 1) {
      logs.push({
        id: `mock-${getDateKey(date)}-${index}`,
        date: getDateKey(date),
        type: index % 3 === 0 ? "habit" : index % 3 === 1 ? "boss" : "focus",
        label: index % 2 === 0 ? "Misión diaria" : "Ataque completado",
        value: 1,
      });
    }
  }

  return logs;
}

export function buildThirtyDayActivity(logs, today = new Date()) {
  const groupedLogs = logs.reduce((grouped, log) => {
    grouped.set(log.date, (grouped.get(log.date) ?? 0) + Number(log.value ?? 1));
    return grouped;
  }, new Map());

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const dateKey = getDateKey(date);
    const count = groupedLogs.get(dateKey) ?? 0;

    return {
      date: dateKey,
      count,
      day: date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      }),
    };
  });
}

export function calculateCurrentStreak(activityDays) {
  let streak = 0;

  for (let index = activityDays.length - 1; index >= 0; index -= 1) {
    if (activityDays[index].count <= 0) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function calculateLevelProgress(totalXp, currentNeeded) {
  let nextXp = totalXp;
  let nextNeeded = currentNeeded;
  let levelsGained = 0;

  while (nextXp >= nextNeeded) {
    nextXp -= nextNeeded;
    levelsGained += 1;
    nextNeeded = Math.ceil(nextNeeded * 1.35);
  }

  return { nextXp, nextNeeded, levelsGained };
}
