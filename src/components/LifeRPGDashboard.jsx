"use client";

import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Battery,
  BookOpen,
  Brain,
  Code2,
  Coins,
  Crown,
  Dumbbell,
  Flame,
  Gauge,
  Gift,
  HeartPulse,
  KeyRound,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  Plus,
  Save,
  Shield,
  ShoppingBag,
  Skull,
  Sparkles,
  Swords,
  Terminal,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";

const runtimeEnv = {
  ...((typeof process !== "undefined" && process.env) || {}),
  ...((typeof import.meta !== "undefined" && import.meta.env) || {}),
};
const supabaseUrl =
  runtimeEnv.NEXT_PUBLIC_SUPABASE_URL || runtimeEnv.VITE_SUPABASE_URL;
const supabaseAnonKey =
  runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  runtimeEnv.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Supabase placeholders:
// life_rpg_profiles: user_id uuid PK, level int, xp int, xp_needed int, cyber_credits int, stats jsonb, updated_at timestamptz
// life_rpg_habits: id text PK, user_id uuid, label text, stat text, xp int, created_at timestamptz
// life_rpg_rewards: id text PK, user_id uuid, name text, cost int, icon text, created_at timestamptz
const PROFILE_TABLE = "life_rpg_profiles";
const HABITS_TABLE = "life_rpg_habits";
const DEMO_USER_ID = "demo-user";
const DEMO_CREDENTIALS = {
  email: "demo@liferpg.local",
  password: "demo1234",
};

const INITIAL_STATS = {
  str: 10,
  int: 10,
  vit: 10,
  cha: 10,
  agi: 10,
};

const INITIAL_PLAYER = {
  level: 1,
  xp: 0,
  xpNeeded: 100,
  cyberCredits: 120,
  stats: INITIAL_STATS,
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
    credits: 12,
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
    credits: 16,
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
    credits: 9,
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
    credits: 11,
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
    credits: 14,
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
    credits: 10,
    Icon: MessageCircle,
    accent: "from-pink-400 via-fuchsia-500 to-cyan-300",
    border: "border-pink-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(236,72,153,0.26)]",
  },
];

const INITIAL_BOSSES = [
  {
    id: "boss-thesis",
    name: "Entregar Tesis",
    totalHp: 320,
    currentHp: 320,
    rewardXp: 260,
    rewardCredits: 180,
    Icon: Skull,
    isDefeated: false,
    subtasks: [
      {
        id: "thesis-intro",
        name: "Escribir Introducción",
        damage: 50,
        credits: 25,
        isCompleted: false,
      },
      {
        id: "thesis-research",
        name: "Ordenar marco teórico",
        damage: 70,
        credits: 32,
        isCompleted: false,
      },
      {
        id: "thesis-data",
        name: "Procesar resultados",
        damage: 90,
        credits: 38,
        isCompleted: false,
      },
      {
        id: "thesis-final",
        name: "Revisión final y entrega",
        damage: 110,
        credits: 45,
        isCompleted: false,
      },
    ],
  },
  {
    id: "boss-portfolio",
    name: "Lanzar Portfolio V2",
    totalHp: 240,
    currentHp: 240,
    rewardXp: 180,
    rewardCredits: 130,
    Icon: Flame,
    isDefeated: false,
    subtasks: [
      {
        id: "portfolio-copy",
        name: "Reescribir casos de estudio",
        damage: 60,
        credits: 28,
        isCompleted: false,
      },
      {
        id: "portfolio-ui",
        name: "Pulir responsive final",
        damage: 70,
        credits: 34,
        isCompleted: false,
      },
      {
        id: "portfolio-deploy",
        name: "Deploy y revisión pública",
        damage: 110,
        credits: 48,
        isCompleted: false,
      },
    ],
  },
];

const DIFFICULTY_OPTIONS = [
  { key: "easy", label: "Fácil", xp: 10, credits: 8 },
  { key: "medium", label: "Media", xp: 20, credits: 16 },
  { key: "hard", label: "Difícil", xp: 40, credits: 32 },
];

const INITIAL_MISSION_DRAFT = {
  name: "",
  stat: "str",
  difficulty: "medium",
};

const INITIAL_REWARDS = [
  {
    id: "reward-pc-hour",
    name: "Jugar 1 hora en la PC",
    cost: 120,
    Icon: Gift,
  },
  {
    id: "reward-movie-night",
    name: "Noche de película",
    cost: 180,
    Icon: Trophy,
  },
  {
    id: "reward-premium-coffee",
    name: "Café premium sin culpa",
    cost: 90,
    Icon: Zap,
  },
];

const INITIAL_REWARD_DRAFT = {
  name: "",
  cost: 140,
};

const INITIAL_AUTH_FORM = {
  email: "",
  password: "",
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

function createClientId(prefix = "habit") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function decorateHabit(row) {
  const statConfig = findStatConfig(row.stat);

  return {
    id: row.id,
    label: row.label,
    stat: row.stat,
    xp: Number(row.xp),
    credits: Number(row.credits ?? Math.max(6, Math.round(Number(row.xp) / 2))),
    Icon: statConfig.Icon,
    accent: statConfig.bar,
    border: statConfig.border,
    hoverGlow: statConfig.actionHoverGlow,
  };
}

function buildHabitRow(userId, habit) {
  return {
    id: habit.id,
    user_id: userId,
    label: habit.label,
    stat: habit.stat,
    xp: habit.xp,
    created_at: new Date().toISOString(),
  };
}

function normalizePlayerProfile(profile) {
  if (!profile) {
    return INITIAL_PLAYER;
  }

  return {
    level: Number(profile.level ?? INITIAL_PLAYER.level),
    xp: Number(profile.xp ?? INITIAL_PLAYER.xp),
    xpNeeded: Number(profile.xp_needed ?? INITIAL_PLAYER.xpNeeded),
    cyberCredits: Number(
      profile.cyber_credits ?? INITIAL_PLAYER.cyberCredits,
    ),
    stats: {
      ...INITIAL_STATS,
      ...(profile.stats ?? {}),
    },
  };
}

function buildProfileRow(userId, player) {
  return {
    user_id: userId,
    level: player.level,
    xp: player.xp,
    xp_needed: player.xpNeeded,
    cyber_credits: player.cyberCredits,
    stats: player.stats,
    updated_at: new Date().toISOString(),
  };
}

export default function LifeRPGDashboard() {
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState(INITIAL_PLAYER);
  const [habits, setHabits] = useState([]);
  const [bosses, setBosses] = useState(INITIAL_BOSSES);
  const [blackMarketRewards, setBlackMarketRewards] = useState(INITIAL_REWARDS);
  const [damageBursts, setDamageBursts] = useState([]);
  const [victoryBanner, setVictoryBanner] = useState(null);
  const [rewardBursts, setRewardBursts] = useState([]);
  const [lastAction, setLastAction] = useState("Sistema offline");
  const [isForgeModalOpen, setIsForgeModalOpen] = useState(false);
  const [missionDraft, setMissionDraft] = useState(INITIAL_MISSION_DRAFT);
  const [rewardDraft, setRewardDraft] = useState(INITIAL_REWARD_DRAFT);
  const [formError, setFormError] = useState("");
  const [rewardFormError, setRewardFormError] = useState("");
  const [shakingRewardId, setShakingRewardId] = useState(null);
  const [toast, setToast] = useState(null);

  const userId = session?.user?.id;
  const isDemoSession = userId === DEMO_USER_ID;
  const userEmail = session?.user?.email ?? "Jugador conectado";
  const { level, xp, xpNeeded, stats, cyberCredits } = player;
  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);
  const totalPower = Object.values(stats).reduce((sum, value) => sum + value, 0);
  const selectedStat = findStatConfig(missionDraft.stat);
  const selectedDifficulty = findDifficultyConfig(missionDraft.difficulty);
  const activeBoss = bosses.find((boss) => !boss.isDefeated) ?? null;
  const ActiveBossIcon = activeBoss?.Icon ?? Skull;
  const bossHpPercent = activeBoss
    ? Math.max((activeBoss.currentHp / activeBoss.totalHp) * 100, 0)
    : 0;
  const isBossEnraged = bossHpPercent <= 50;

  const showToast = useCallback((message, type = "error") => {
    const toastId = createClientId("toast");

    setToast({ id: toastId, message, type });

    window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === toastId ? null : currentToast,
      );
    }, 3600);
  }, []);

  const showErrorToast = useCallback(
    (message) => showToast(message, "error"),
    [showToast],
  );

  const showSuccessToast = useCallback(
    (message) => showToast(message, "success"),
    [showToast],
  );

  const statRows = useMemo(
    () =>
      STAT_CONFIG.map((stat) => ({
        ...stat,
        value: stats[stat.key],
        percent: Math.min((stats[stat.key] / 30) * 100, 100),
      })),
    [stats],
  );

  const persistPlayer = useCallback(
    async (nextPlayer) => {
      if (!supabase || !userId) {
        if (isDemoSession) {
          return true;
        }

        showErrorToast("Supabase no está configurado para guardar la partida.");
        return false;
      }

      const { error } = await supabase
        .from(PROFILE_TABLE)
        .upsert(buildProfileRow(userId, nextPlayer), {
          onConflict: "user_id",
        });

      if (error) {
        showErrorToast("Error de conexión: no se pudo guardar el progreso.");
        return false;
      }

      return true;
    },
    [isDemoSession, showErrorToast, userId],
  );

  const syncPlayerData = useCallback(
    async (nextUserId) => {
      if (!supabase) {
        showErrorToast("Faltan las variables NEXT_PUBLIC_SUPABASE_*.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const [profileResponse, habitsResponse] = await Promise.all([
          supabase
            .from(PROFILE_TABLE)
            .select("level,xp,xp_needed,cyber_credits,stats")
            .eq("user_id", nextUserId)
            .maybeSingle(),
          supabase
            .from(HABITS_TABLE)
            .select("id,label,stat,xp,created_at")
            .eq("user_id", nextUserId)
            .order("created_at", { ascending: true }),
        ]);

        if (profileResponse.error) {
          throw profileResponse.error;
        }

        if (habitsResponse.error) {
          throw habitsResponse.error;
        }

        const nextPlayer = normalizePlayerProfile(profileResponse.data);
        let remoteHabitRows = habitsResponse.data ?? [];

        if (!profileResponse.data) {
          const { error } = await supabase
            .from(PROFILE_TABLE)
            .insert(buildProfileRow(nextUserId, nextPlayer));

          if (error) {
            throw error;
          }
        }

        if (remoteHabitRows.length === 0) {
          const starterRows = INITIAL_HABITS.map((habit) =>
            buildHabitRow(nextUserId, {
              ...habit,
              id: createClientId("starter"),
            }),
          );

          const { data, error } = await supabase
            .from(HABITS_TABLE)
            .insert(starterRows)
            .select("id,label,stat,xp,created_at");

          if (error) {
            throw error;
          }

          remoteHabitRows = data ?? starterRows;
        }

        setPlayer(nextPlayer);
        setHabits(remoteHabitRows.map(decorateHabit));
        setLastAction("Partida sincronizada");
      } catch {
        setPlayer(INITIAL_PLAYER);
        setHabits(INITIAL_HABITS);
        setBlackMarketRewards(INITIAL_REWARDS);
        setLastAction("Modo fallback local");
        showErrorToast(
          "No pude sincronizar la nube. Cargué un estado local temporal.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [showErrorToast],
  );

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      setAuthError("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setIsAuthLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        showErrorToast("No pude leer la sesión de Supabase.");
      }

      setSession(data.session ?? null);
      setIsLoading(Boolean(data.session));
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(Boolean(nextSession));
      setAuthError("");
      setAuthInfo("");

      if (!nextSession) {
        setPlayer(INITIAL_PLAYER);
        setHabits([]);
        setBosses(INITIAL_BOSSES);
        setBlackMarketRewards(INITIAL_REWARDS);
        setDamageBursts([]);
        setVictoryBanner(null);
        setLastAction("Sistema offline");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [showErrorToast]);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    if (isDemoSession) {
      setPlayer(INITIAL_PLAYER);
      setHabits(INITIAL_HABITS);
      setBosses(INITIAL_BOSSES);
      setBlackMarketRewards(INITIAL_REWARDS);
      setDamageBursts([]);
      setVictoryBanner(null);
      setLastAction("Modo demo local");
      setIsLoading(false);
      return;
    }

    syncPlayerData(userId);
  }, [isDemoSession, syncPlayerData, userId]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    setAuthError("");
    setAuthInfo("");
    setIsAuthSubmitting(true);

    const credentials = {
      email: authForm.email.trim(),
      password: authForm.password,
    };

    if (!supabase) {
      const isDemoLogin =
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password;

      if (!isDemoLogin) {
        setAuthError(
          `Sin Supabase configurado usá demo: ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
        );
        setIsAuthSubmitting(false);
        return;
      }

      setSession({
        user: {
          id: DEMO_USER_ID,
          email: DEMO_CREDENTIALS.email,
        },
      });
      setAuthInfo("Modo demo activado. Cargando dashboard local...");
      setIsLoading(true);
      setIsAuthSubmitting(false);
      return;
    }

    try {
      const response =
        authMode === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

      if (response.error) {
        throw response.error;
      }

      if (authMode === "register" && !response.data.session) {
        setAuthInfo("Cuenta creada. Revisá tu email para activar el acceso.");
      } else {
        setAuthInfo("Acceso concedido. Cargando partida...");
      }

      setSession(response.data.session ?? null);
      setIsLoading(Boolean(response.data.session));
    } catch (error) {
      setAuthError(error.message ?? "No pude autenticar al jugador.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (isDemoSession) {
      setSession(null);
      setPlayer(INITIAL_PLAYER);
      setHabits([]);
      setBosses(INITIAL_BOSSES);
      setBlackMarketRewards(INITIAL_REWARDS);
      setLastAction("Sistema offline");
      return;
    }

    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      showErrorToast("No pude cerrar la sesión.");
      return;
    }

    setSession(null);
  };

  const queueRewardBurst = useCallback(
    ({
      actionLabel,
      xpGain = 0,
      creditGain = 0,
      detail,
      levelsGained = 0,
      duration = 1300,
    }) => {
      const rewardId = createClientId("reward-burst");

      setRewardBursts((currentBursts) => [
        ...currentBursts.slice(-3),
        {
          id: rewardId,
          actionLabel,
          xpGain,
          creditGain,
          detail,
          levelsGained,
        },
      ]);

      window.setTimeout(() => {
        setRewardBursts((currentBursts) =>
          currentBursts.filter((burst) => burst.id !== rewardId),
        );
      }, duration);
    },
    [],
  );

  const applyPlayerReward = useCallback(
    ({
      statKey,
      xpGain = 0,
      creditGain = 0,
      actionLabel,
      detail,
      lastActionText,
      duration = 1300,
    }) => {
      const previousPlayer = player;
      const { nextXp, nextNeeded, levelsGained } = calculateLevelProgress(
        player.xp + xpGain,
        player.xpNeeded,
      );
      const nextPlayer = {
        ...player,
        level: player.level + levelsGained,
        xp: nextXp,
        xpNeeded: nextNeeded,
        cyberCredits: Math.max(0, player.cyberCredits + creditGain),
        stats: statKey
          ? {
              ...player.stats,
              [statKey]: (player.stats[statKey] ?? 0) + 1,
            }
          : player.stats,
      };

      setPlayer(nextPlayer);
      setLastAction(
        lastActionText ??
          `${actionLabel} +${xpGain} XP / +${creditGain} CR`,
      );
      queueRewardBurst({
        actionLabel,
        xpGain,
        creditGain,
        detail,
        levelsGained,
        duration,
      });

      persistPlayer(nextPlayer).then((wasSaved) => {
        if (!wasSaved) {
          setPlayer(previousPlayer);
          setLastAction("Progreso revertido por error de sync");
        }
      });

      return nextPlayer;
    },
    [persistPlayer, player, queueRewardBurst],
  );

  const handleAction = (statKey, xpGain, creditGain, actionLabel) => {
    applyPlayerReward({
      statKey,
      xpGain,
      creditGain,
      actionLabel,
      detail: `+1 ${statKey.toUpperCase()}`,
    });
  };

  const grantCyberCredits = (creditGain, actionLabel) => {
    applyPlayerReward({
      creditGain,
      actionLabel,
      detail: "LOOT",
      lastActionText: `${actionLabel} +${creditGain} CR`,
      duration: 1200,
    });
  };

  const grantBossReward = (rewardXp, bossName, rewardCredits = 0) => {
    applyPlayerReward({
      xpGain: rewardXp,
      creditGain: rewardCredits,
      actionLabel: bossName,
      detail: "BOSS CLEAR",
      lastActionText: `Jefe derrotado: ${bossName}`,
      duration: 1600,
    });
  };

  const handleBossAttack = (bossId, subtaskId) => {
    const boss = bosses.find((currentBoss) => currentBoss.id === bossId);
    const subtask = boss?.subtasks.find(
      (currentSubtask) => currentSubtask.id === subtaskId,
    );

    if (!boss || !subtask || boss.isDefeated || subtask.isCompleted) {
      return;
    }

    const nextHp = Math.max(boss.currentHp - subtask.damage, 0);
    const isDefeated = nextHp <= 0;
    const damageId = `${Date.now()}-${bossId}-${subtaskId}`;
    const attackCredits = Number(
      subtask.credits ?? Math.max(8, Math.round(subtask.damage / 3)),
    );

    setBosses((currentBosses) =>
      currentBosses.map((currentBoss) => {
        if (currentBoss.id !== bossId) {
          return currentBoss;
        }

        return {
          ...currentBoss,
          currentHp: nextHp,
          isDefeated,
          subtasks: currentBoss.subtasks.map((currentSubtask) =>
            currentSubtask.id === subtaskId
              ? { ...currentSubtask, isCompleted: true }
              : currentSubtask,
          ),
        };
      }),
    );

    setLastAction(`Ataque: ${subtask.name} -${subtask.damage} HP`);
    setDamageBursts((currentBursts) => [
      ...currentBursts.slice(-4),
      {
        id: damageId,
        damage: subtask.damage,
      },
    ]);

    window.setTimeout(() => {
      setDamageBursts((currentBursts) =>
        currentBursts.filter((burst) => burst.id !== damageId),
      );
    }, 1200);

    if (isDefeated) {
      const victoryId = createClientId("victory");
      const victoryCredits = Number(boss.rewardCredits ?? 0) + attackCredits;

      setVictoryBanner({
        id: victoryId,
        bossName: boss.name,
        rewardXp: boss.rewardXp,
        rewardCredits: victoryCredits,
      });
      grantBossReward(boss.rewardXp, boss.name, victoryCredits);

      window.setTimeout(() => {
        setVictoryBanner((currentBanner) =>
          currentBanner?.id === victoryId ? null : currentBanner,
        );
      }, 4200);
    } else {
      grantCyberCredits(attackCredits, `Ataque: ${subtask.name}`);
    }
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

    if (!userId) {
      showErrorToast("No hay sesión activa para guardar la misión.");
      return;
    }

    if (!supabase && !isDemoSession) {
      showErrorToast("Supabase no está configurado para guardar la misión.");
      return;
    }

    const statConfig = findStatConfig(missionDraft.stat);
    const difficultyConfig = findDifficultyConfig(missionDraft.difficulty);
    const newHabit = {
      id: createClientId("habit"),
      label: missionName,
      stat: missionDraft.stat,
      xp: difficultyConfig.xp,
      credits: difficultyConfig.credits,
      Icon: statConfig.Icon,
      accent: statConfig.bar,
      border: statConfig.border,
      hoverGlow: statConfig.actionHoverGlow,
    };

    setHabits((currentHabits) => [...currentHabits, newHabit]);
    setLastAction(`Misión forjada: ${missionName}`);
    closeForgeModal();

    if (isDemoSession || !supabase) {
      return;
    }

    supabase
      .from(HABITS_TABLE)
      .insert(buildHabitRow(userId, newHabit))
      .then(({ error }) => {
        if (error) {
          setHabits((currentHabits) =>
            currentHabits.filter((habit) => habit.id !== newHabit.id),
          );
          showErrorToast("Error de conexión: no se pudo crear la misión.");
        }
      });
  };

  const handleDeleteHabit = (event, habitId, habitLabel) => {
    event.stopPropagation();

    if (!userId) {
      showErrorToast("No hay sesión activa para abandonar la misión.");
      return;
    }

    if (!supabase && !isDemoSession) {
      showErrorToast("Supabase no está configurado para borrar la misión.");
      return;
    }

    const habitToRestore = habits.find((habit) => habit.id === habitId);

    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId),
    );
    setLastAction(`Misión abandonada: ${habitLabel}`);

    if (isDemoSession || !supabase) {
      return;
    }

    supabase
      .from(HABITS_TABLE)
      .delete()
      .eq("user_id", userId)
      .eq("id", habitId)
      .then(({ error }) => {
        if (error && habitToRestore) {
          setHabits((currentHabits) => [...currentHabits, habitToRestore]);
          showErrorToast("Error de conexión: no se pudo borrar la misión.");
        }
      });
  };

  const handleCreateReward = (event) => {
    event.preventDefault();

    const rewardName = rewardDraft.name.trim();
    const rewardCost = Number(rewardDraft.cost);

    if (!rewardName) {
      setRewardFormError("La recompensa necesita un nombre.");
      return;
    }

    if (!Number.isFinite(rewardCost) || rewardCost <= 0) {
      setRewardFormError("El costo debe ser mayor a 0 créditos.");
      return;
    }

    const newReward = {
      id: createClientId("reward"),
      name: rewardName,
      cost: Math.round(rewardCost),
      Icon: Gift,
    };

    setBlackMarketRewards((currentRewards) => [...currentRewards, newReward]);
    setRewardDraft(INITIAL_REWARD_DRAFT);
    setRewardFormError("");
    setLastAction(`Ítem registrado: ${rewardName}`);
    showSuccessToast(`Nuevo ítem en Mercado Negro: ${rewardName}`);
  };

  const handleDeleteReward = (event, rewardId, rewardName) => {
    event.stopPropagation();

    setBlackMarketRewards((currentRewards) =>
      currentRewards.filter((reward) => reward.id !== rewardId),
    );
    setLastAction(`Ítem retirado: ${rewardName}`);
  };

  const handleBuyReward = (reward) => {
    if (cyberCredits < reward.cost) {
      setShakingRewardId(reward.id);
      setLastAction(`Créditos insuficientes para: ${reward.name}`);
      showErrorToast("Créditos Insuficientes");

      window.setTimeout(() => {
        setShakingRewardId((currentId) =>
          currentId === reward.id ? null : currentId,
        );
      }, 460);

      return;
    }

    const previousPlayer = player;
    const nextPlayer = {
      ...player,
      cyberCredits: player.cyberCredits - reward.cost,
    };

    setPlayer(nextPlayer);
    setLastAction(`Gastaste ${reward.cost} CR en: ${reward.name}`);
    showSuccessToast(`Recompensa Desbloqueada: ${reward.name}`);

    persistPlayer(nextPlayer).then((wasSaved) => {
      if (!wasSaved) {
        setPlayer(previousPlayer);
        setLastAction("Compra revertida por error de sync");
      }
    });
  };

  const toastNode = (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          className={`fixed bottom-5 right-5 z-[70] max-w-sm border-2 px-4 py-3 text-sm font-black uppercase shadow-[0_0_36px_rgba(251,113,133,0.3)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] ${
            toast.type === "success"
              ? "border-lime-300 bg-emerald-950/95 text-lime-100 shadow-[0_0_36px_rgba(132,204,22,0.26)]"
              : "border-rose-300 bg-rose-950/95 text-rose-100 shadow-[0_0_36px_rgba(251,113,133,0.3)]"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const victoryNode = (
    <AnimatePresence>
      {victoryBanner && (
        <motion.div
          key={victoryBanner.id}
          initial={{ opacity: 0, y: -28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -28, scale: 0.92 }}
          className="fixed left-1/2 top-5 z-[65] w-[min(92vw,560px)] -translate-x-1/2 border-4 border-yellow-200 bg-rose-950/95 px-5 py-4 text-center shadow-[0_0_52px_rgba(250,204,21,0.34),0_0_80px_rgba(225,29,72,0.24)] [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,18px_100%,0_calc(100%-18px))]"
        >
          <p className="font-mono text-xs font-black uppercase text-yellow-100">
            Boss Defeated
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white">
            {victoryBanner.bossName}
          </h2>
          <p className="mt-2 font-mono text-sm font-black uppercase text-cyan-100">
            +{victoryBanner.rewardXp} XP reclamados
          </p>
          <p className="mt-1 font-mono text-sm font-black uppercase text-lime-100">
            +{victoryBanner.rewardCredits} CR capturados
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isAuthLoading) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(217,70,239,0.14),transparent_32%)]" />
        <div className="relative border-2 border-cyan-300 bg-slate-950/[0.9] p-6 font-mono text-sm font-black uppercase text-cyan-100 shadow-[0_0_46px_rgba(34,211,238,0.22)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
          &gt; Inicializando núcleo de sesión...
        </div>
        {toastNode}
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(217,70,239,0.18),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(250,204,21,0.1),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:34px_34px]" />

        <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-5xl place-items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="mb-6 text-center">
              <p className="font-mono text-xs font-black uppercase text-cyan-200">
                Save Slot / Cloud Sync
              </p>
              <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.45)] sm:text-7xl">
                LifeRPG
              </h1>
              <p className="mt-3 font-mono text-sm font-black uppercase text-yellow-100 drop-shadow-[0_0_18px_rgba(250,204,21,0.5)]">
                &gt; Press Start
              </p>
            </div>

            <form
              onSubmit={handleAuthSubmit}
              className="relative overflow-hidden border-2 border-cyan-300 bg-slate-950/[0.9] p-5 shadow-[0_0_60px_rgba(34,211,238,0.22),0_0_80px_rgba(217,70,239,0.12)] [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),transparent_34%,rgba(217,70,239,0.14)_72%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-yellow-200" />

              <div className="relative mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Terminal de acceso
                  </p>
                  <h2 className="text-2xl font-black uppercase text-white">
                    {authMode === "login" ? "Cargar Partida" : "Nuevo Jugador"}
                  </h2>
                </div>
                <Terminal className="h-9 w-9 text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              </div>

              <div className="relative space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                    <Mail className="h-4 w-4 text-cyan-200" />
                    Email
                  </span>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm((currentForm) => ({
                        ...currentForm,
                        email: event.target.value,
                      }))
                    }
                    className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-bold text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
                    placeholder="player@liferpg.dev"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-slate-300">
                    <KeyRound className="h-4 w-4 text-fuchsia-200" />
                    Contraseña
                  </span>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm((currentForm) => ({
                        ...currentForm,
                        password: event.target.value,
                      }))
                    }
                    className="w-full border-2 border-slate-600 bg-slate-900 px-3 py-3 font-mono text-sm font-bold text-cyan-50 outline-none transition placeholder:text-slate-600 focus:border-fuchsia-300 focus:shadow-[0_0_24px_rgba(217,70,239,0.18)]"
                    placeholder="••••••••"
                  />
                </label>

                {authError && (
                  <p className="border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100">
                    {authError}
                  </p>
                )}

                {authInfo && (
                  <p className="border border-cyan-300/60 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
                    {authInfo}
                  </p>
                )}

                {!hasSupabaseConfig && (
                  <div className="border border-yellow-200/60 bg-yellow-200/10 px-3 py-2 font-mono text-xs font-black uppercase text-yellow-100">
                    Demo local: {DEMO_CREDENTIALS.email} /{" "}
                    {DEMO_CREDENTIALS.password}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full border-2 border-yellow-200 bg-yellow-200 px-4 py-3 text-sm font-black uppercase text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.3)] transition hover:bg-cyan-200 hover:shadow-[0_0_34px_rgba(34,211,238,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAuthSubmitting
                    ? "> Autenticando..."
                    : authMode === "login"
                      ? "Start / Entrar"
                      : "Crear Save Slot"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode((currentMode) =>
                      currentMode === "login" ? "register" : "login",
                    );
                    setAuthError("");
                    setAuthInfo("");
                  }}
                  className="w-full border border-cyan-300/50 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase text-cyan-100 transition hover:bg-cyan-300/20"
                >
                  {authMode === "login"
                    ? "Crear nuevo jugador"
                    : "Ya tengo una partida"}
                </button>
              </div>
            </form>
          </motion.div>
        </section>
        {toastNode}
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(217,70,239,0.15),transparent_30%)]" />
        <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-5">
          <div className="border-2 border-cyan-300 bg-slate-950/[0.9] p-5 font-mono text-sm font-black uppercase text-cyan-100 shadow-[0_0_46px_rgba(34,211,238,0.2)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
            &gt; Sincronizando datos neuronales...
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.35fr]">
            <div className="space-y-3 border-2 border-slate-700 bg-slate-950/[0.86] p-4">
              {[0, 1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse border border-cyan-300/20 bg-slate-900"
                />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse border-2 border-fuchsia-300/20 bg-slate-900"
                />
              ))}
            </div>
          </div>
        </section>
        {toastNode}
      </main>
    );
  }

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
                  <span className="inline-flex items-center gap-1 border border-yellow-200/60 bg-yellow-200/10 px-2 py-1 font-mono text-yellow-100">
                    <Coins className="h-3.5 w-3.5" />
                    {cyberCredits} CR
                  </span>
                  <span className="border border-fuchsia-300/50 bg-fuchsia-300/10 px-2 py-1 text-fuchsia-100">
                    {lastAction}
                  </span>
                  <span className="max-w-full truncate border border-lime-300/50 bg-lime-300/10 px-2 py-1 font-mono text-lime-100">
                    {userEmail}
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
                <div className="flex items-center gap-2">
                  <Battery className="h-7 w-7 text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                    className="grid h-9 w-9 place-items-center border border-rose-300/70 bg-rose-500/[0.12] text-rose-100 transition hover:bg-rose-400/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
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
                {burst.xpGain > 0 && (
                  <p className="font-mono text-sm font-black text-yellow-100">
                    +{burst.xpGain} XP
                  </p>
                )}
                {burst.creditGain > 0 && (
                  <p className="font-mono text-sm font-black text-lime-100">
                    +{burst.creditGain} CR
                  </p>
                )}
                <p className="text-xs font-black uppercase text-cyan-100">
                  {burst.detail}
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
                          handleAction(
                            habit.stat,
                            habit.xp,
                            habit.credits,
                            habit.label,
                          )
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
                            <span className="inline-flex items-center gap-1 border border-lime-300/50 bg-lime-300/10 px-2 py-1 font-mono text-xs font-black text-lime-100">
                              <Coins className="h-3.5 w-3.5" />
                              +{habit.credits} CR
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
                    CLOUD QUEST
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.section>
        </div>

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
                    {activeBoss.subtasks.filter((subtask) => subtask.isCompleted).length}
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
                    onClick={() => handleBossAttack(activeBoss.id, subtask.id)}
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
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden border-2 border-yellow-200/80 bg-slate-950/[0.9] p-4 shadow-[0_0_48px_rgba(250,204,21,0.16),0_0_72px_rgba(132,204,22,0.08)] [clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,22px_100%,0_calc(100%-22px))] sm:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(250,204,21,0.14),transparent_34%,rgba(34,197,94,0.12)_72%,transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-200 via-lime-300 to-emerald-400" />

          <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase text-yellow-100">
                <ShoppingBag className="h-4 w-4" />
                Black Market
              </p>
              <h2 className="mt-1 text-2xl font-black uppercase text-white sm:text-3xl">
                Mercado Negro
              </h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 border-2 border-lime-300/70 bg-lime-300/10 px-3 py-2 font-mono text-sm font-black uppercase text-lime-100 shadow-[0_0_24px_rgba(132,204,22,0.18)]">
              <Coins className="h-5 w-5" />
              Saldo {cyberCredits} CR
            </div>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <form
              onSubmit={handleCreateReward}
              className="border-2 border-lime-300/50 bg-slate-900/70 p-4 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Contrabando
                  </p>
                  <h3 className="text-lg font-black uppercase text-white">
                    Registrar Recompensa
                  </h3>
                </div>
                <Gift className="h-8 w-8 text-lime-200 drop-shadow-[0_0_12px_rgba(132,204,22,0.7)]" />
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                    Ítem
                  </span>
                  <input
                    type="text"
                    value={rewardDraft.name}
                    onChange={(event) => {
                      setRewardDraft((currentDraft) => ({
                        ...currentDraft,
                        name: event.target.value,
                      }));
                      setRewardFormError("");
                    }}
                    className="w-full border-2 border-slate-600 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-lime-300 focus:shadow-[0_0_24px_rgba(132,204,22,0.18)]"
                    placeholder="Ej: Jugar 1 hora en la PC"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase text-slate-300">
                    Costo
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={rewardDraft.cost}
                    onChange={(event) => {
                      setRewardDraft((currentDraft) => ({
                        ...currentDraft,
                        cost: event.target.value,
                      }));
                      setRewardFormError("");
                    }}
                    className="w-full border-2 border-slate-600 bg-slate-950 px-3 py-3 font-mono text-sm font-black text-yellow-100 outline-none transition placeholder:text-slate-600 focus:border-yellow-200 focus:shadow-[0_0_24px_rgba(250,204,21,0.16)]"
                    placeholder="200"
                  />
                </label>

                {rewardFormError && (
                  <p className="border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-100">
                    {rewardFormError}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-yellow-200 bg-yellow-200 px-4 py-3 text-sm font-black uppercase text-slate-950 shadow-[0_0_28px_rgba(250,204,21,0.24)] transition hover:bg-lime-200 hover:shadow-[0_0_32px_rgba(132,204,22,0.24)] focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <Plus className="h-4 w-4" />
                  Añadir al Mercado
                </button>
              </div>
            </form>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence initial={false}>
                {blackMarketRewards.map((reward) => {
                  const RewardIcon = reward.Icon ?? Gift;
                  const canBuy = cyberCredits >= reward.cost;

                  return (
                    <motion.article
                      key={reward.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={
                        shakingRewardId === reward.id
                          ? { opacity: 1, y: 0, scale: 1, x: [0, -8, 8, -6, 6, 0] }
                          : { opacity: 1, y: 0, scale: 1, x: 0 }
                      }
                      exit={{ opacity: 0, y: -10, scale: 0.92 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className={`relative min-h-44 overflow-hidden border-2 bg-slate-900/[0.86] p-4 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))] ${
                        canBuy
                          ? "border-yellow-200/70 shadow-[0_0_30px_rgba(250,204,21,0.14)]"
                          : "border-rose-300/60 shadow-[0_0_30px_rgba(251,113,133,0.1)]"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-200 via-lime-300 to-emerald-400" />
                      <div className="absolute -right-10 -top-10 h-28 w-28 bg-yellow-200 opacity-[0.13] blur-2xl" />

                      <button
                        type="button"
                        aria-label={`Retirar recompensa ${reward.name}`}
                        onClick={(event) =>
                          handleDeleteReward(event, reward.id, reward.name)
                        }
                        className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center border border-rose-300/70 bg-rose-500/[0.12] text-rose-100 transition hover:bg-rose-400/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="relative flex min-h-36 flex-col justify-between gap-4 pr-8">
                        <div>
                          <div className="mb-3 grid h-12 w-12 place-items-center border border-yellow-200/60 bg-yellow-200/10 text-yellow-100">
                            <RewardIcon className="h-7 w-7 drop-shadow-[0_0_12px_rgba(250,204,21,0.68)]" />
                          </div>
                          <p className="text-xs font-black uppercase text-slate-400">
                            Recompensa Real
                          </p>
                          <h3 className="mt-1 break-words text-xl font-black uppercase text-white">
                            {reward.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 border border-yellow-200/60 bg-yellow-200/10 px-2 py-1 font-mono text-xs font-black text-yellow-100">
                            <Coins className="h-3.5 w-3.5" />
                            {reward.cost} CR
                          </span>
                          {!canBuy && (
                            <span className="border border-rose-300/60 bg-rose-500/10 px-2 py-1 font-mono text-xs font-black uppercase text-rose-100">
                              Saldo bajo
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBuyReward(reward)}
                          className={`inline-flex items-center justify-center gap-2 border-2 px-3 py-2 text-xs font-black uppercase transition focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                            canBuy
                              ? "border-lime-300 bg-lime-300 text-slate-950 shadow-[0_0_24px_rgba(132,204,22,0.22)] hover:bg-yellow-200"
                              : "border-rose-300 bg-rose-500/10 text-rose-100 hover:bg-rose-400/20"
                          }`}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Comprar
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
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
                          {difficulty.label} [{difficulty.xp} XP /{" "}
                          {difficulty.credits} CR]
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
                    <span className="inline-flex items-center gap-1 border border-lime-300/60 bg-lime-300/10 px-2 py-1 font-mono text-xs font-black text-lime-100">
                      <Coins className="h-3.5 w-3.5" />
                      +{selectedDifficulty.credits} CR
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

      {toastNode}
      {victoryNode}
    </main>
  );
}
