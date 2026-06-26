import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSeed } from "../hooks/useSeed";

const CARDS = [
  { to: "/videastes", label: "Vidéastes", icon: "🎬" },
  { to: "/shootings", label: "Shootings", icon: "📅" },
  { to: "/clients", label: "Clients", icon: "👤" },
  { to: "/materiels", label: "Matériel", icon: "🎥" },
];

export default function Home() {
  // Intro jouée une seule fois par session.
  const [showIntro, setShowIntro] = useState(() => sessionStorage.getItem("intro_seen") !== "true");
  const { load, reset } = useSeed();
  const error = load.error ?? reset.error;

  useEffect(() => {
    if (!showIntro) return;
    // logo+slogan : fade in/slide up (0.6s) + pause (0.8s), puis on enchaîne.
    const t = setTimeout(() => {
      sessionStorage.setItem("intro_seen", "true");
      setShowIntro(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [showIntro]);

  return (
    <>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              src="/logo-full-slogan-no-background.png"
              alt="Markyn"
              className="h-40 w-auto object-contain"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: showIntro ? 0 : 1 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-10 flex flex-col items-center">
          <img
            src="/logo-full-main-no-slogan-no-background.png"
            alt="Markyn"
            className="h-24 w-auto object-contain"
          />
          <h1 className="mt-3 font-syne text-4xl font-bold text-primary">Markyn</h1>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-accent hover:shadow"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="font-medium text-primary">{c.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => load.mutate()}
            disabled={load.isPending}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {load.isPending ? "Chargement…" : "Charger le jeu de données de test"}
          </button>
          <button
            type="button"
            onClick={() => reset.mutate()}
            disabled={reset.isPending}
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-gray-50 disabled:opacity-50"
          >
            {reset.isPending ? "Réinitialisation…" : "Réinitialiser la base"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          {error ? <p className="text-danger">{(error as Error).message}</p> : null}
          {load.isSuccess ? <p className="text-accent">Jeu de données chargé ✓</p> : null}
          {reset.isSuccess ? <p className="text-accent">Base réinitialisée ✓</p> : null}
        </div>
      </motion.div>
    </>
  );
}
