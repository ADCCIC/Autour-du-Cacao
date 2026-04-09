"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "hero" | "compact";
}

export default function NewsletterForm({ variant = "compact" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setEmail("");
        setMessage(
          data.already
            ? "Vous êtes déjà inscrit(e) à la newsletter !"
            : "Merci ! Vous êtes maintenant inscrit(e) à la newsletter."
        );
      } else {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Vérifiez votre connexion.");
    }
  }

  if (variant === "hero") {
    return (
      <div className="mt-8">
        <p className="text-sm font-medium text-amber-800 mb-3">
          Inscrivez-vous à la newsletter — recevez chaque épisode directement dans votre boîte mail.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-5 py-2.5 bg-amber-800 text-amber-50 text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "Inscription…" : "S'inscrire"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-2 text-sm ${
              status === "success" ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  // compact variant (footer / sidebar)
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === "loading" || status === "success"}
          className="flex-1 px-3 py-2 rounded-lg border border-amber-700 bg-amber-950 text-amber-100 placeholder-amber-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-4 py-2 bg-amber-500 text-amber-950 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === "loading" ? "…" : "OK"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-1.5 text-xs ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
