"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Activity,
  Battery,
  BookOpen,
  Brain,
  Code2,
  Crown,
  Dumbbell,
  Gauge,
  HeartPulse,
  MessageCircle,
  Moon,
  Plus,
  Save,
  Shield,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const INITIAL_STATS = {
  str: 10,
  int: 10,
  vit: 10,
  cha: 10,
  agi: 10,
};

const STAT_CONFIG = [
  {
    key: "str",
    label: "STR",
    name: "Fuerza",
    Icon: Dumbbell,
    bar: "from-rose-500 via-fuchsia-500 to-yellow-300",
    border: "border-rose-400/70",
    text: "text-rose-200",
    glow: "shadow-[0_0_28px_rgba(244,63,94,0.26)]",
    actionHoverGlow: "hover:shadow-[0_0_34px_rgba(244,63,94,0.28)]",
  },
  {
    key: "int",
    label: "INT",
    name: "Inteligencia",
    Icon: Brain,
    bar: "from-cyan-300 via-sky-500 to-blue-500",
    border: "border-cyan-300/70",
    text: "text-cyan-200",
    glow: "shadow-[0_0_28px_rgba(34,211,238,0.24)]",
    actionHoverGlow: "hover:shadow-[0_0_34px_rgba(34,211,238,0.28)]",
  },
  {
    key: "vit",
    label: "VIT",
    name: "Vitalidad",
    Icon: HeartPulse,
    bar: "from-lime-300 via-emerald-400 to-teal-500",
    border: "border-lime-300/70",
    text: "text-lime-200",
    glow: "shadow-[0_0_28px_rgba(132,204,22,0.24)]",
    actionHoverGlow: "hover:shadow-[0_0_34px_rgba(132,204,22,0.26)]",
  },
  {
    key: "cha",
    label: "CHA",
    name: "Carisma",
    Icon: Sparkles,
    bar: "from-fuchsia-400 via-pink-500 to-amber-300",
    border: "border-fuchsia-300/70",
    text: "text-fuchsia-200",
    glow: "shadow-[0_0_28px_rgba(217,70,239,0.24)]",
    actionHoverGlow: "hover:shadow-[0_0_34px_rgba(217,70,239,0.28)]",
  },
  {
    key: "agi",
    label: "AGI",
    name: "Agilidad",
    Icon: Gauge,
    bar: "from-yellow-200 via-lime-300 to-green-400",
    border: "border-yellow-200/70",
    text: "text-yellow-100",
    glow: "shadow-[0_0_28px_rgba(250,204,21,0.22)]",
    actionHoverGlow: "hover:shadow-[0_0_34px_rgba(250,204,21,0.24)]",
  },
];

const INITIAL_HABITS = [
  {
    id: "train",
    label: "Entrenar",
    stat: "str",
    xp: 20,
    Icon: Dumbbell,
    accent: "from-yellow-300 via-orange-500 to-rose-500",
    border: "border-yellow-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(250,204,21,0.28)]",
  },
  {
    id: "code",
    label: "Programar",
    stat: "int",
    xp: 25,
    Icon: Code2,
    accent: "from-cyan-300 via-sky-500 to-blue-600",
    border: "border-cyan-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(34,211,238,0.28)]",
  },
  {
    id: "read",
    label: "Leer",
    stat: "cha",
    xp: 15,
    Icon: BookOpen,
    accent: "from-fuchsia-400 via-pink-500 to-amber-300",
    border: "border-fuchsia-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(217,70,239,0.28)]",
  },
  {
    id: "sleep",
    label: "Dormir",
    stat: "vit",
    xp: 18,
    Icon: Moon,
    accent: "from-lime-300 via-emerald-400 to-teal-500",
    border: "border-lime-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(132,204,22,0.26)]",
  },
  {
    id: "focus",
    label: "Sprint",
    stat: "agi",
    xp: 22,
    Icon: Zap,
    accent: "from-yellow-200 via-lime-300 to-green-400",
    border: "border-yellow-200/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(250,204,21,0.24)]",
  },
  {
    id: "social",
    label: "Conectar",
    stat: "cha",
    xp: 16,
    Icon: MessageCircle,
    accent: "from-pink-400 via-fuchsia-500 to-cyan-300",
    border: "border-pink-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(236,72,153,0.26)]",
  },
];

const DIFFICULTY_OPTIONS = [
  { key: "easy", label: "Fácil", xp: 10 },
  { key: "medium", label: "Media", xp: 20 },
  { key: "hard", label: "Difícil", xp: 40 },
];

const INITIAL_MISSION_DRAFT = {
  name: "",
  stat: "str",
  difficulty: "medium",
};

function calculateLevelProgress(totalXp, currentNeeded) {
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

function findStatConfig(statKey) {
  return STAT_CONFIG.find((stat) => stat.key === statKey) ?? STAT_CONFIG[0];
}

function findDifficultyConfig(difficultyKey) {
  return (
    DIFFICULTY_OPTIONS.find((difficulty) => difficulty.key === difficultyKey) ??
    DIFFICULTY_OPTIONS[1]
  );
}

export default function LifeRPGDashboard() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpNeeded, setXpNeeded] = useState(100);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [rewardBursts, setRewardBursts] = useState([]);
  const [lastAction, setLastAction] = useState("Sistema online");
  const [isForgeModalOpen, setIsForgeModalOpen] = useState(false);
  const [missionDraft, setMissionDraft] = useState(INITIAL_MISSION_DRAFT);
  const [formError, setFormError] = useState("");

  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);
  const totalPower = Object.values(stats).reduce((sum, value) => sum + value, 0);
  const selectedStat = findStatConfig(missionDraft.stat);
  const selectedDifficulty = findDifficultyConfig(missionDraft.difficulty);

  const statRows = useMemo(
    () =>
      STAT_CONFIG.map((stat) => ({
        ...stat,
        value: stats[stat.key],
        percent: Math.min((stats[stat.key] / 30) * 100, 100),
      })),
    [stats],
  );

  const handleAction = (statKey, xpGain, actionLabel) => {
    const { nextXp, nextNeeded, levelsGained } = calculateLevelProgress(
      xp + xpGain,
      xpNeeded,
    );
    const rewardId = `${Date.now()}-${statKey}-${xpGain}`;

    setStats((currentStats) => ({
      ...currentStats,
      [statKey]: currentStats[statKey] + 1,
    }));
    setXp(nextXp);
    setXpNeeded(nextNeeded);
    setLastAction(`${actionLabel} +${xpGain} XP`);

    if (levelsGained > 0) {
      setLevel((currentLevel) => currentLevel + levelsGained);
    }

    setRewardBursts((currentBursts) => [
      ...currentBursts.slice(-3),
      {
        id: rewardId,
        actionLabel,
        xpGain,
        statLabel: statKey.toUpperCase(),
        levelsGained,
      },
    ]);

    window.setTimeout(() => {
      setRewardBursts((currentBursts) =>
        currentBursts.filter((burst) => burst.id !== rewardId),
      );
    }, 1300);
  };

  const openForgeModal = () => {
    setMissionDraft(INITIAL_MISSION_DRAFT);
    setFormError("");
    setIsForgeModalOpen(true);
  };

  const closeForgeModal = () => {
    setIsForgeModalOpen(false);
    setMissionDraft(INITIAL_MISSION_DRAFT);
    setFormError("");
  };

  const handleCreateHabit = (event) => {
    event.preventDefault();

    const missionName = missionDraft.name.trim();

    if (!missionName) {
      setFormError("La misión necesita un nombre.");
      return;
    }

    const statConfig = findStatConfig(missionDraft.stat);
    const difficultyConfig = findDifficultyConfig(missionDraft.difficulty);

    const newHabit = {
      id: `custom-${Date.now()}`,
      label: missionName,
      stat: missionDraft.stat,
      xp: difficultyConfig.xp,
      Icon: statConfig.Icon,
      accent: statConfig.bar,
      border: statConfig.border,
      hoverGlow: statConfig.actionHoverGlow,
    };

    setHabits((currentHabits) => [...currentHabits, newHabit]);
    setLastAction(`Misión forjada: ${missionName}`);
    closeForgeModal();
  };

  const handleDeleteHabit = (event, habitId, habitLabel) => {
    event.stopPropagation();

    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId),
    );
    setLastAction(`Misión abandonada: ${habitLabel}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(217,70,239,0.15),transparent_30%),radial-gradient(circle_at_78%_82%,rgba(132,204,22,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-400/10 to-transparent" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-5">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden border-2 border-cyan-300/70 bg-slate-950/[0.88] p-4 shadow-[0_0_48px_rgba(34,211,238,0.14)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))] sm:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),transparent_34%,rgba(217,70,239,0.12)_70%,transparent)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="relative grid h-24 w-24 shrink-0 place-items-center border-2 border-yellow-200 bg-slate-900 shadow-[0_0_32px_rgba(250,204,21,0.22)] [clip-path:polygon(50%_0,100%_25%,100%_76%,50%_100%,0_76%,0_25%)] sm:h-28 sm:w-28">
                <div className="absolute inset-2 border border-cyan-300/60 [clip-path:polygon(50%_0,100%_25%,100%_76%,50%_100%,0_76%,0_25%)]" />
                <Crown className="h-9 w-9 text-yellow-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-cyan-200">
                  LifeRPG
                </p>
                <h1 className="text-3xl font-black uppercase leading-none text-white sm:text-5xl">
                  Nivel{" "}
                  <span className="font-mono text-yellow-200 drop-shadow-[0_0_16px_rgba(250,204,21,0.75)]">
                    {level}
                  </span>
                </h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase text-slate-300">
                  <span className="border border-cyan-300/50 bg-cyan-300/10 px-2 py-1 font-mono text-cyan-100">
                    POW {totalPower}
                  </span>
                  <span className="border border-fuchsia-300/50 bg-fuchsia-300/10 px-2 py-1 text-fuchsia-100">
                    {lastAction}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="mb-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Experiencia
                  </p>
                  <p className="font-mono text-sm font-bold text-cyan-100">
                    {xp} / {xpNeeded} XP
                  </p>
                </div>
                <Battery className="h-7 w-7 text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
              </div>

              <div className="relative h-9 overflow-hidden border-2 border-cyan-200/70 bg-slate-900 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))]">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-300 via-sky-500 to-blue-600 shadow-[0_0_28px_rgba(14,165,233,0.65)]"
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0,transparent_18%,transparent_50%,rgba(255,255,255,0.18)_52%,transparent_70%)]" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black text-white drop-shadow">
                  {Math.round(xpPercent)}%
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {rewardBursts.map((burst, index) => (
              <motion.div
                key={burst.id}
                initial={{ opacity: 0, y: 18, scale: 0.85 }}
                animate={{ opacity: 1, y: -28 - index * 8, scale: 1 }}
                exit={{ opacity: 0, y: -72, scale: 0.92 }}
                transition={{ duration: 0.48, ease: "easeOut" }}
                className="pointer-events-none absolute right-4 top-16 border-2 border-yellow-200 bg-slate-950 px-3 py-2 text-right shadow-[0_0_28px_rgba(250,204,21,0.3)] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]"
              >
                <p className="font-mono text-sm font-black text-yellow-100">
                  +{burst.xpGain} XP
                </p>
                <p className="text-xs font-black uppercase text-cyan-100">
                  +1 {burst.statLabel}
                </p>
                {burst.levelsGained > 0 && (
                  <p className="text-xs font-black uppercase text-fuchsia-200">
                    Level Up
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.35fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
            className="border-2 border-slate-600/80 bg-slate-950/[0.86] p-4 shadow-[0_0_36px_rgba(15,23,42,0.75)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-slate-400">
                  Core
                </p>
                <h2 className="text-xl font-black uppercase text-white">
                  Atributos
                </h2>
              </div>
              <Shield className="h-8 w-8 text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
            </div>

            <div className="space-y-3">
              {statRows.map((stat) => {
                const Icon = stat.Icon;

                return (
                  <div
                    key={stat.key}
                    className={`border ${stat.border} bg-slate-900/70 p-3 ${stat.glow} [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon className={`h-5 w-5 ${stat.text}`} />
                        <div className="min-w-0">
                          <p className={`text-sm font-black uppercase ${stat.text}`}>
                            {stat.label}
                          </p>
                          <p className="truncate text-xs font-bold text-slate-400">
                            {stat.name}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-2xl font-black text-white">
                        {stat.value}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden border border-white/10 bg-slate-950">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${stat.bar}`}
                        animate={{ width: `${stat.percent}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.14, duration: 0.45, ease: "easeOut" }}
            className="relative overflow-hidden border-2 border-fuchsia-300/60 bg-slate-950/[0.86] p-4 shadow-[0_0_42px_rgba(217,70,239,0.12)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))] sm:p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(217,70,239,0.14),transparent_36%,rgba(132,204,22,0.08)_76%,transparent)]" />
            <div className="relative mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-slate-400">
                  Action Deck
                </p>
                <h2 className="text-xl font-black uppercase text-white">
                  Quest Log
                </h2>
              </div>
              <Activity className="h-8 w-8 text-fuchsia-200 drop-shadow-[0_0_10px_rgba(217,70,239,0.75)]" />
            </div>

            <div className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence initial={false}>
                {habits.map((habit) => {
                  const Icon = habit.Icon;

                  return (
                    <motion.article
                      key={habit.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`group relative min-h-40 overflow-hidden border-2 ${habit.border} bg-slate-900/[0.88] transition ${habit.hoverGlow} [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(habit.stat, habit.xp, habit.label)
                        }
                        className="relative h-full min-h-40 w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <div
                          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${habit.accent}`}
                        />
                        <div
                          className={`absolute -right-10 -top-10 h-28 w-28 bg-gradient-to-br ${habit.accent} opacity-[0.16] blur-2xl transition group-hover:opacity-30`}
                        />
                        <div className="relative flex h-full min-h-32 flex-col justify-between gap-4">
                          <div className="flex items-start justify-between gap-3 pr-10">
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase text-slate-400">
                                Misión
                              </p>
                              <h3 className="mt-1 break-words text-2xl font-black uppercase text-white">
                                {habit.label}
                              </h3>
                            </div>
                            <div className="grid h-12 w-12 shrink-0 place-items-center border border-white/20 bg-white/5">
                              <Icon className="h-7 w-7 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="border border-cyan-300/50 bg-cyan-300/10 px-2 py-1 font-mono text-xs font-black text-cyan-100">
                              +1 {habit.stat.toUpperCase()}
                            </span>
                            <span className="border border-yellow-200/50 bg-yellow-200/10 px-2 py-1 font-mono text-xs font-black text-yellow-100">
                              +{habit.xp} XP
                            </span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        aria-label={`Abandonar misión ${habit.label}`}
                        onClick={(event) =>
                          handleDeleteHabit(event, habit.id, habit.label)
                        }
                        className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center border border-rose-300/70 bg-rose-500/[0.12] text-rose-100 transition hover:bg-rose-400/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={openForgeModal}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="group relative min-h-40 overflow-hidden border-2 border-dashed border-cyan-300/80 bg-cyan-300/[0.07] p-4 text-left shadow-[0_0_34px_rgba(34,211,238,0.12)] transition hover:border-yellow-200 hover:bg-yellow-200/[0.08] hover:shadow-[0_0_38px_rgba(250,204,21,0.22)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-200" />
                <div className="absolute -right-10 -top-10 h-28 w-28 bg-cyan-300 opacity-[0.16] blur-2xl transition group-hover:opacity-30" />
                <div className="relative flex h-full min-h-32 flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-cyan-100">
                        Crear
                      </p>
                      <h3 className="mt-1 text-2xl font-black uppercase text-white">
                        + Forjar Nueva Misión
                      </h3>
                    </div>
                    <div className="grid h-12 w-12 shrink-0 place-items-center border border-cyan-200/60 bg-cyan-300/10 text-cyan-100">
                      <Plus className="h-7 w-7 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    </div>
                  </div>

                  <span className="w-fit border border-fuchsia-300/50 bg-fuchsia-300/10 px-2 py-1 font-mono text-xs font-black text-fuchsia-100">
                    CUSTOM QUEST
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.section>
        </div>
      </section>

      <AnimatePresence>
        {isForgeModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/[0.78] px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="forge-mission-title"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative w-full max-w-xl overflow-hidden border-2 border-cyan-300 bg-slate-950/[0.94] p-5 shadow-[0_0_60px_rgba(34,211,238,0.26),0_0_80px_rgba(217,70,239,0.12)] [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),transparent_34%,rgba(217,70,239,0.14)_72%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-200" />

              <div className="relative mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-cyan-200">
                    Mission Forge
                  </p>
                  <h2
                    id="forge-mission-title"
                    className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl"
                  >
                    Forjar Nueva Misión
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Cerrar modal"
                  onClick={closeForgeModal}
                  className="grid h-9 w-9 shrink-0 place-items-center border border-fuchsia-300/70 bg-fuchsia-500/10 text-fuchsia-100 transition hover:bg-fuchsia-400/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="relative space-y-4" onSubmit={handleCreateHabit}>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                    Nombre de la misión
                  </span>
                  <input
                    type="text"
                    value={missionDraft.name}
                    onChange={(event) => {
                      setMissionDraft((currentDraft) => ({
                        ...currentDraft,
                        name: event.target.value,
                      }));
                      setFormError("");
                    }}
                    className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                    placeholder="Ej: Meditar 10 minutos"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Atributo
                    </span>
                    <select
                      value={missionDraft.stat}
                      onChange={(event) =>
                        setMissionDraft((currentDraft) => ({
                          ...currentDraft,
                          stat: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-white outline-none transition focus:border-cyan-300 focus:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                    >
                      {STAT_CONFIG.map((stat) => (
                        <option key={stat.key} value={stat.key}>
                          {stat.label} - {stat.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Dificultad
                    </span>
                    <select
                      value={missionDraft.difficulty}
                      onChange={(event) =>
                        setMissionDraft((currentDraft) => ({
                          ...currentDraft,
                          difficulty: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-white outline-none transition focus:border-cyan-300 focus:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                    >
                      {DIFFICULTY_OPTIONS.map((difficulty) => (
                        <option key={difficulty.key} value={difficulty.key}>
                          {difficulty.label} [{difficulty.xp} XP]
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="border border-cyan-300/40 bg-cyan-300/10 p-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`border ${selectedStat.border} bg-slate-950 px-2 py-1 font-mono text-xs font-black ${selectedStat.text}`}
                    >
                      +1 {selectedStat.label}
                    </span>
                    <span className="border border-yellow-200/60 bg-yellow-200/10 px-2 py-1 font-mono text-xs font-black text-yellow-100">
                      +{selectedDifficulty.xp} XP
                    </span>
                  </div>
                </div>

                {formError && (
                  <p className="border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100">
                    {formError}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForgeModal}
                    className="border-2 border-slate-600 bg-slate-900 px-4 py-3 text-sm font-black uppercase text-slate-200 transition hover:border-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 border-2 border-yellow-200 bg-yellow-200 px-4 py-3 text-sm font-black uppercase text-slate-950 shadow-[0_0_26px_rgba(250,204,21,0.28)] transition hover:bg-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.28)] focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Save className="h-4 w-4" />
                    Guardar Misión
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
