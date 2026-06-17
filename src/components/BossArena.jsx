import { AnimatePresence, motion } from "framer-motion";
import {
  Coins,
  Flame,
  Plus,
  Save,
  Skull,
  Swords,
  Trophy,
  WandSparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const BOSS_TYPE_OPTIONS = [
  { key: "skull", label: "Proyecto crítico", Icon: Skull },
  { key: "flame", label: "Meta intensa", Icon: Flame },
  { key: "bot", label: "Meta técnica", Icon: WandSparkles },
];

const INITIAL_BOSS_DRAFT = {
  name: "",
  icon: "skull",
  totalHp: 320,
  rewardXp: 220,
  rewardCredits: 140,
  subtasksText:
    "Definir alcance\nCompletar primera entrega\nRevisar y ajustar\nCerrar entrega final",
};

function parseBossDraft(draft) {
  const totalHp = Math.max(100, Math.round(Number(draft.totalHp) || 320));
  const rawSubtasks = draft.subtasksText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);
  const baseDamage = Math.max(20, Math.floor(totalHp / rawSubtasks.length));

  return {
    name: draft.name.trim(),
    icon: draft.icon,
    totalHp,
    rewardXp: Math.max(40, Math.round(Number(draft.rewardXp) || 220)),
    rewardCredits: Math.max(20, Math.round(Number(draft.rewardCredits) || 140)),
    subtasks: rawSubtasks.map((name, index) => {
      const isFinalAttack = index === rawSubtasks.length - 1;
      const damage = isFinalAttack
        ? Math.max(20, totalHp - baseDamage * (rawSubtasks.length - 1))
        : baseDamage;

      return {
        name,
        damage,
        credits: Math.max(10, Math.round(damage / 2.5)),
      };
    }),
  };
}

export default function BossArena({
  activeBoss,
  damageBursts,
  onAttack,
  onCreateBoss,
  onOpenDungeonMaster,
}) {
  const [isForgeBossOpen, setIsForgeBossOpen] = useState(false);
  const [bossDraft, setBossDraft] = useState(INITIAL_BOSS_DRAFT);
  const [bossFormError, setBossFormError] = useState("");
  const ActiveBossIcon = activeBoss?.Icon ?? Skull;
  const bossHpPercent = activeBoss
    ? Math.max((activeBoss.currentHp / activeBoss.totalHp) * 100, 0)
    : 0;
  const isBossEnraged = bossHpPercent <= 50;
  const parsedDraft = useMemo(() => parseBossDraft(bossDraft), [bossDraft]);
  const SelectedTypeIcon =
    BOSS_TYPE_OPTIONS.find((option) => option.key === bossDraft.icon)?.Icon ??
    Skull;

  const closeForgeBoss = () => {
    setIsForgeBossOpen(false);
    setBossDraft(INITIAL_BOSS_DRAFT);
    setBossFormError("");
  };

  const handleCreateBoss = (event) => {
    event.preventDefault();

    if (!parsedDraft.name) {
      setBossFormError("El boss necesita un nombre.");
      return;
    }

    if (parsedDraft.subtasks.length < 2) {
      setBossFormError("Agregá al menos 2 ataques/subtareas.");
      return;
    }

    const wasCreated = onCreateBoss(parsedDraft);

    if (wasCreated !== false) {
      closeForgeBoss();
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden border-4 border-rose-700/80 bg-slate-950/[0.92] p-4 shadow-[0_0_52px_rgba(225,29,72,0.18)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_calc(100%-16px),calc(100%-16px)_100%,20px_100%,0_calc(100%-20px))] sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(225,29,72,0.24),transparent_34%),linear-gradient(135deg,rgba(127,29,29,0.28),transparent_34%,rgba(250,204,21,0.08)_78%,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-yellow-200" />

        {activeBoss ? (
          <div className="relative grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase text-rose-200">
                    <Skull className="h-4 w-4" />
                    Boss Arena
                  </p>
                  <h2 className="mt-1 text-3xl font-black uppercase text-white sm:text-4xl">
                    {activeBoss.name}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      onClick={onOpenDungeonMaster}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 border-2 border-fuchsia-300 bg-fuchsia-300/10 px-3 py-2 text-xs font-black uppercase text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.2)] transition hover:border-cyan-200 hover:bg-cyan-300/15 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <WandSparkles className="h-4 w-4 animate-pulse" />
                      Dungeon Master IA
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsForgeBossOpen(true)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 border-2 border-yellow-200 bg-yellow-200/10 px-3 py-2 text-xs font-black uppercase text-yellow-100 shadow-[0_0_28px_rgba(250,204,21,0.16)] transition hover:border-lime-200 hover:bg-lime-300/15 hover:text-lime-100 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      <Plus className="h-4 w-4" />
                      Forjar Boss
                    </motion.button>
                  </div>
                </div>
                <div className="grid h-16 w-16 shrink-0 place-items-center border-2 border-rose-400 bg-rose-500/10 shadow-[0_0_28px_rgba(225,29,72,0.28)] [clip-path:polygon(50%_0,100%_25%,100%_76%,50%_100%,0_76%,0_25%)]">
                  <ActiveBossIcon className="h-8 w-8 text-rose-100 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase text-rose-200">
                    HP del jefe
                  </p>
                  <p className="font-mono text-sm font-black text-white">
                    {activeBoss.currentHp} / {activeBoss.totalHp}
                  </p>
                </div>

                <div className="relative h-12 overflow-hidden border-2 border-rose-300 bg-slate-950 shadow-[0_0_28px_rgba(225,29,72,0.22)] [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))]">
                  <motion.div
                    className={`absolute inset-y-0 left-0 ${
                      isBossEnraged
                        ? "animate-pulse bg-gradient-to-r from-red-950 via-red-700 to-orange-600"
                        : "bg-gradient-to-r from-red-500 via-rose-600 to-fuchsia-800"
                    } shadow-[0_0_34px_rgba(225,29,72,0.6)]`}
                    animate={{ width: `${bossHpPercent}%` }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0,transparent_18%,transparent_52%,rgba(255,255,255,0.12)_54%,transparent_72%)]" />
                  <AnimatePresence>
                    {damageBursts.map((burst, index) => (
                      <motion.div
                        key={burst.id}
                        initial={{ opacity: 0, y: 18, scale: 0.88 }}
                        animate={{
                          opacity: 1,
                          y: -28 - index * 6,
                          scale: 1,
                        }}
                        exit={{ opacity: 0, y: -56, scale: 0.9 }}
                        className="pointer-events-none absolute right-5 top-2 font-mono text-lg font-black text-red-100 drop-shadow-[0_0_12px_rgba(248,113,113,0.95)]"
                      >
                        -{burst.damage} HP
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="border border-yellow-200/60 bg-yellow-200/10 px-2 py-1 font-mono text-xs font-black text-yellow-100">
                  REWARD +{activeBoss.rewardXp} XP
                </span>
                <span className="inline-flex items-center gap-1 border border-lime-300/60 bg-lime-300/10 px-2 py-1 font-mono text-xs font-black text-lime-100">
                  <Coins className="h-3.5 w-3.5" />
                  BOUNTY +{activeBoss.rewardCredits} CR
                </span>
                <span className="border border-rose-300/60 bg-rose-500/10 px-2 py-1 font-mono text-xs font-black text-rose-100">
                  {
                    activeBoss.subtasks.filter((subtask) => subtask.isCompleted)
                      .length
                  }
                  /{activeBoss.subtasks.length} ATAQUES
                </span>
              </div>
            </div>

            <div className="relative space-y-3">
              {activeBoss.subtasks.map((subtask) => (
                <motion.button
                  key={subtask.id}
                  type="button"
                  whileHover={subtask.isCompleted ? undefined : { x: 4 }}
                  whileTap={subtask.isCompleted ? undefined : { scale: 0.98 }}
                  disabled={subtask.isCompleted}
                  onClick={() => onAttack(activeBoss.id, subtask.id)}
                  className={`group flex w-full items-center justify-between gap-4 border-2 p-3 text-left transition [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    subtask.isCompleted
                      ? "border-lime-300/50 bg-lime-300/10 text-lime-100"
                      : "border-rose-400/70 bg-rose-950/40 text-white hover:border-yellow-200 hover:bg-rose-900/60 hover:shadow-[0_0_28px_rgba(225,29,72,0.24)]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center border font-mono text-xs font-black ${
                        subtask.isCompleted
                          ? "border-lime-300 bg-lime-300/20 text-lime-100"
                          : "border-rose-300 bg-slate-950 text-rose-100 group-hover:border-yellow-200 group-hover:text-yellow-100"
                      }`}
                    >
                      {subtask.isCompleted ? "OK" : "ATK"}
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-black uppercase">
                        {subtask.name}
                      </p>
                      <p className="font-mono text-xs font-black text-rose-200">
                        DAMAGE {subtask.damage}
                      </p>
                      <p className="font-mono text-xs font-black text-lime-200">
                        LOOT +{subtask.credits} CR
                      </p>
                    </div>
                  </div>
                  <Swords className="h-5 w-5 shrink-0 text-rose-100 group-hover:text-yellow-100" />
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase text-yellow-100">
                <Trophy className="h-4 w-4" />
                Arena despejada
              </p>
              <h2 className="mt-1 text-2xl font-black uppercase text-white">
                Todos los jefes fueron derrotados
              </h2>
            </div>
            <span className="border border-lime-300/60 bg-lime-300/10 px-3 py-2 font-mono text-xs font-black uppercase text-lime-100">
              PROJECT CLEAR
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsForgeBossOpen(true)}
                className="inline-flex items-center gap-2 border-2 border-yellow-200 bg-yellow-200/10 px-3 py-2 text-xs font-black uppercase text-yellow-100 shadow-[0_0_28px_rgba(250,204,21,0.16)] transition hover:border-lime-200 hover:bg-lime-300/15 hover:text-lime-100 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <Plus className="h-4 w-4" />
                Forjar Boss
              </button>
              <button
                type="button"
                onClick={onOpenDungeonMaster}
                className="inline-flex items-center gap-2 border-2 border-fuchsia-300 bg-fuchsia-300/10 px-3 py-2 text-xs font-black uppercase text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.2)] transition hover:border-cyan-200 hover:bg-cyan-300/15 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <WandSparkles className="h-4 w-4 animate-pulse" />
                Dungeon Master IA
              </button>
            </div>
          </div>
        )}
      </motion.section>

      <AnimatePresence>
        {isForgeBossOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/[0.82] px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="forge-boss-title"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border-2 border-rose-300 bg-slate-950/[0.96] p-5 shadow-[0_0_68px_rgba(225,29,72,0.26),0_0_92px_rgba(250,204,21,0.1)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(225,29,72,0.18),transparent_34%,rgba(250,204,21,0.12)_72%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-yellow-200 to-lime-300" />

              <div className="relative mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase text-rose-100">
                    <Skull className="h-4 w-4" />
                    Boss Forge
                  </p>
                  <h2
                    id="forge-boss-title"
                    className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl"
                  >
                    Forjar Nuevo Boss
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Cerrar forja de boss"
                  onClick={closeForgeBoss}
                  className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/70 bg-rose-500/10 text-rose-100 transition hover:bg-rose-400/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="relative space-y-4" onSubmit={handleCreateBoss}>
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Nombre del boss
                    </span>
                    <input
                      type="text"
                      value={bossDraft.name}
                      onChange={(event) => {
                        setBossDraft((currentDraft) => ({
                          ...currentDraft,
                          name: event.target.value,
                        }));
                        setBossFormError("");
                      }}
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-rose-300 focus:shadow-[0_0_24px_rgba(251,113,133,0.18)]"
                      placeholder="Ej: Conseguir trabajo Frontend"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Tipo
                    </span>
                    <select
                      value={bossDraft.icon}
                      onChange={(event) =>
                        setBossDraft((currentDraft) => ({
                          ...currentDraft,
                          icon: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-white outline-none transition focus:border-yellow-200 focus:shadow-[0_0_24px_rgba(250,204,21,0.16)]"
                    >
                      {BOSS_TYPE_OPTIONS.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      HP
                    </span>
                    <input
                      type="number"
                      min="100"
                      value={bossDraft.totalHp}
                      onChange={(event) =>
                        setBossDraft((currentDraft) => ({
                          ...currentDraft,
                          totalHp: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-rose-100 outline-none transition focus:border-rose-300"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Reward XP
                    </span>
                    <input
                      type="number"
                      min="40"
                      value={bossDraft.rewardXp}
                      onChange={(event) =>
                        setBossDraft((currentDraft) => ({
                          ...currentDraft,
                          rewardXp: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-cyan-100 outline-none transition focus:border-cyan-300"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                      Créditos
                    </span>
                    <input
                      type="number"
                      min="20"
                      value={bossDraft.rewardCredits}
                      onChange={(event) =>
                        setBossDraft((currentDraft) => ({
                          ...currentDraft,
                          rewardCredits: event.target.value,
                        }))
                      }
                      className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-black text-lime-100 outline-none transition focus:border-lime-300"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                    Ataques / subtareas
                  </span>
                  <textarea
                    value={bossDraft.subtasksText}
                    onChange={(event) => {
                      setBossDraft((currentDraft) => ({
                        ...currentDraft,
                        subtasksText: event.target.value,
                      }));
                      setBossFormError("");
                    }}
                    className="min-h-36 w-full resize-none border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-bold text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-yellow-200 focus:shadow-[0_0_24px_rgba(250,204,21,0.16)]"
                    placeholder="Una subtarea por línea"
                  />
                </label>

                <div className="border border-yellow-200/50 bg-yellow-200/10 p-3">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <SelectedTypeIcon className="h-5 w-5 text-yellow-100" />
                    <span className="border border-rose-300/60 bg-rose-500/10 px-2 py-1 font-mono text-xs font-black text-rose-100">
                      HP {parsedDraft.totalHp}
                    </span>
                    <span className="border border-cyan-300/60 bg-cyan-300/10 px-2 py-1 font-mono text-xs font-black text-cyan-100">
                      +{parsedDraft.rewardXp} XP
                    </span>
                    <span className="border border-lime-300/60 bg-lime-300/10 px-2 py-1 font-mono text-xs font-black text-lime-100">
                      +{parsedDraft.rewardCredits} CR
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {parsedDraft.subtasks.map((subtask, index) => (
                      <div
                        key={`${subtask.name}-${index}`}
                        className="border border-rose-300/30 bg-slate-950/70 p-2"
                      >
                        <p className="text-xs font-black uppercase text-white">
                          {index + 1}. {subtask.name}
                        </p>
                        <p className="font-mono text-[11px] font-black text-rose-200">
                          DAMAGE {subtask.damage} / LOOT {subtask.credits} CR
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {bossFormError && (
                  <p className="border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100">
                    {bossFormError}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForgeBoss}
                    className="border-2 border-slate-600 bg-slate-900 px-4 py-3 text-sm font-black uppercase text-slate-200 transition hover:border-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 border-2 border-yellow-200 bg-yellow-200 px-4 py-3 text-sm font-black uppercase text-slate-950 shadow-[0_0_26px_rgba(250,204,21,0.28)] transition hover:bg-lime-200 hover:shadow-[0_0_30px_rgba(132,204,22,0.28)] focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Save className="h-4 w-4" />
                    Guardar Boss
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
