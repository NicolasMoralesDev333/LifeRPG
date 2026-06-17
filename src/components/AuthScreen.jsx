import { motion } from "framer-motion";
import { KeyRound, Mail, Terminal } from "lucide-react";

export function AuthLoadingScreen({ toastNode }) {
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

export default function AuthScreen({
  authMode,
  authForm,
  authError,
  authInfo,
  demoCredentials,
  hasSupabaseConfig,
  isAuthSubmitting,
  onFieldChange,
  onSubmit,
  onToggleMode,
  toastNode,
}) {
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
            onSubmit={onSubmit}
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
                    onFieldChange("email", event.target.value)
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
                    onFieldChange("password", event.target.value)
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
                  Demo local: {demoCredentials.email} /{" "}
                  {demoCredentials.password}
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
                onClick={onToggleMode}
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
