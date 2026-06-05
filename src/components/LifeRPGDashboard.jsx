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
  Shield,
  Sparkles,
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
  },
];

const ACTIONS = [
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

export default function LifeRPGDashboard() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpNeeded, setXpNeeded] = useState(100);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [rewardBursts, setRewardBursts] = useState([]);
  const [lastAction, setLastAction] = useState("Sistema online");

  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);
  const totalPower = Object.values(stats).reduce((sum, value) => sum + value, 0);

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
                  Hábitos
                </h2>
              </div>
              <Activity className="h-8 w-8 text-fuchsia-200 drop-shadow-[0_0_10px_rgba(217,70,239,0.75)]" />
            </div>

            <div className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ACTIONS.map((action) => {
                const Icon = action.Icon;

                return (
                  <motion.button
                    key={action.id}
                    type="button"
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      handleAction(action.stat, action.xp, action.label)
                    }
                    className={`group relative min-h-40 overflow-hidden border-2 ${action.border} bg-slate-900/[0.88] p-4 text-left transition ${action.hoverGlow} [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${action.accent}`}
                    />
                    <div
                      className={`absolute -right-10 -top-10 h-28 w-28 bg-gradient-to-br ${action.accent} opacity-[0.16] blur-2xl transition group-hover:opacity-30`}
                    />
                    <div className="relative flex h-full flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase text-slate-400">
                            Acción
                          </p>
                          <h3 className="mt-1 text-2xl font-black uppercase text-white">
                            {action.label}
                          </h3>
                        </div>
                        <div className="grid h-12 w-12 shrink-0 place-items-center border border-white/20 bg-white/5">
                          <Icon className="h-7 w-7 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="border border-cyan-300/50 bg-cyan-300/10 px-2 py-1 font-mono text-xs font-black text-cyan-100">
                          +1 {action.stat.toUpperCase()}
                        </span>
                        <span className="border border-yellow-200/50 bg-yellow-200/10 px-2 py-1 font-mono text-xs font-black text-yellow-100">
                          +{action.xp} XP
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}
