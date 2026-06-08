import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { BarChart3, CalendarDays, Coins } from "lucide-react";
import {
  buildThirtyDayActivity,
  calculateCurrentStreak,
} from "../lib/gameplay";

const ORACLE_STATS = [
  { key: "str", label: "STR", name: "Fuerza" },
  { key: "int", label: "INT", name: "Inteligencia" },
  { key: "vit", label: "VIT", name: "Vitalidad" },
  { key: "cha", label: "CHA", name: "Carisma" },
  { key: "agi", label: "AGI", name: "Agilidad" },
];

function getHeatLevelClass(count) {
  if (count >= 5) {
    return "border-yellow-200 bg-yellow-200 shadow-[0_0_18px_rgba(250,204,21,0.36)]";
  }

  if (count >= 4) {
    return "border-lime-300 bg-lime-300 shadow-[0_0_16px_rgba(132,204,22,0.32)]";
  }

  if (count >= 3) {
    return "border-emerald-300 bg-emerald-400/85 shadow-[0_0_14px_rgba(52,211,153,0.28)]";
  }

  if (count >= 2) {
    return "border-cyan-300 bg-cyan-400/70 shadow-[0_0_14px_rgba(34,211,238,0.22)]";
  }

  if (count >= 1) {
    return "border-cyan-900 bg-cyan-950";
  }

  return "border-slate-800 bg-slate-900";
}

function OracleTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="border border-cyan-300/70 bg-slate-950/95 px-3 py-2 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
      <p className="font-mono text-xs font-black uppercase text-cyan-100">
        {label}
      </p>
      <p className="font-mono text-sm font-black text-white">
        Valor {payload[0].value}
      </p>
    </div>
  );
}

export default function OraclePanel({
  stats,
  activityLogs,
  level,
  totalPower,
  cyberCredits,
}) {
  const [isRadarReady, setIsRadarReady] = useState(false);
  const radarData = useMemo(
    () =>
      ORACLE_STATS.map((stat) => ({
        stat: stat.label,
        name: stat.name,
        value: stats[stat.key],
      })),
    [stats],
  );
  const activityDays = useMemo(
    () => buildThirtyDayActivity(activityLogs),
    [activityLogs],
  );
  const totalCompletions = activityDays.reduce(
    (sum, day) => sum + day.count,
    0,
  );
  const activeDays = activityDays.filter((day) => day.count > 0).length;
  const currentStreak = calculateCurrentStreak(activityDays);
  const maxStat = Math.max(30, ...radarData.map((stat) => stat.value));
  const strongestStat = radarData.reduce((strongest, stat) =>
    stat.value > strongest.value ? stat : strongest,
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsRadarReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden border-2 border-cyan-300/70 bg-slate-950/[0.88] p-4 shadow-[0_0_48px_rgba(34,211,238,0.14)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))] sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),transparent_34%,rgba(217,70,239,0.12)_72%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-200" />

      <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan-100">
            <BarChart3 className="h-4 w-4" />
            El Oráculo
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl">
            Analíticas del Jugador
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="border border-yellow-200/60 bg-yellow-200/10 px-3 py-2 font-mono text-xs font-black uppercase text-yellow-100">
            LVL {level}
          </span>
          <span className="border border-cyan-300/60 bg-cyan-300/10 px-3 py-2 font-mono text-xs font-black uppercase text-cyan-100">
            POW {totalPower}
          </span>
          <span className="inline-flex items-center gap-1 border border-lime-300/60 bg-lime-300/10 px-3 py-2 font-mono text-xs font-black uppercase text-lime-100">
            <Coins className="h-3.5 w-3.5" />
            {cyberCredits} CR
          </span>
        </div>
      </div>

      <div className="relative grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0 overflow-hidden border-2 border-cyan-300/50 bg-slate-900/70 p-4 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">
                Skill Tree
              </p>
              <h3 className="text-xl font-black uppercase text-white">
                Build Actual
              </h3>
            </div>
            <span className="border border-fuchsia-300/60 bg-fuchsia-300/10 px-2 py-1 font-mono text-xs font-black uppercase text-fuchsia-100">
              Main {strongestStat.stat}
            </span>
          </div>

          <div className="h-[320px] min-w-0 w-full">
            {isRadarReady ? (
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="74%"
                  margin={{ top: 18, right: 30, bottom: 18, left: 30 }}
                >
                  <PolarGrid
                    gridType="polygon"
                    radialLines
                    stroke="rgba(148,163,184,0.28)"
                  />
                  <PolarAngleAxis
                    dataKey="stat"
                    tick={{
                      fill: "#cffafe",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, maxStat]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip content={<OracleTooltip />} />
                  <Radar
                    name="Build"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fill="#22d3ee"
                    fillOpacity={0.32}
                    dot={{
                      r: 4,
                      fill: "#fef08a",
                      stroke: "#22d3ee",
                      strokeWidth: 2,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center border border-cyan-300/30 bg-slate-950/70 font-mono text-xs font-black uppercase text-cyan-100">
                &gt; Calibrando radar...
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-5">
            {radarData.map((stat) => (
              <div
                key={stat.stat}
                className="border border-cyan-300/30 bg-slate-950/70 px-2 py-2 text-center"
              >
                <p className="font-mono text-xs font-black text-cyan-100">
                  {stat.stat}
                </p>
                <p className="font-mono text-lg font-black text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 overflow-hidden border-2 border-lime-300/50 bg-slate-900/70 p-4 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">
                Activity Logs
              </p>
              <h3 className="text-xl font-black uppercase text-white">
                Consistencia 30D
              </h3>
            </div>
            <CalendarDays className="h-8 w-8 text-lime-200 drop-shadow-[0_0_12px_rgba(132,204,22,0.68)]" />
          </div>

          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            <div className="border border-cyan-300/40 bg-cyan-300/10 px-3 py-2">
              <p className="text-xs font-black uppercase text-slate-300">
                Acciones
              </p>
              <p className="font-mono text-2xl font-black text-cyan-100">
                {totalCompletions}
              </p>
            </div>
            <div className="border border-lime-300/40 bg-lime-300/10 px-3 py-2">
              <p className="text-xs font-black uppercase text-slate-300">
                Días Activos
              </p>
              <p className="font-mono text-2xl font-black text-lime-100">
                {activeDays}/30
              </p>
            </div>
            <div className="border border-yellow-200/40 bg-yellow-200/10 px-3 py-2">
              <p className="text-xs font-black uppercase text-slate-300">
                Racha
              </p>
              <p className="font-mono text-2xl font-black text-yellow-100">
                {currentStreak}D
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-6 gap-2 sm:grid-cols-10"
            aria-label="Mapa de calor de actividad de los últimos 30 días"
          >
            {activityDays.map((day) => (
              <div
                key={day.date}
                title={`${day.day}: ${day.count} acciones`}
                aria-label={`${day.day}: ${day.count} acciones completadas`}
                className={`aspect-square min-h-9 border transition ${getHeatLevelClass(
                  day.count,
                )}`}
              >
                <span className="grid h-full place-items-center font-mono text-[10px] font-black text-white/80">
                  {day.count > 0 ? day.count : ""}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black uppercase text-slate-300">
            <span>Baja</span>
            {[0, 1, 2, 3, 5].map((level) => (
              <span
                key={level}
                className={`h-4 w-4 border ${getHeatLevelClass(level)}`}
              />
            ))}
            <span>Alta</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
