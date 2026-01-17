"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function mondayOfThisWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0=dim
  const diff = (day === 0 ? -6 : 1) - day; // lundi
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export default function Checkin() {
  const [weekStart] = useState(mondayOfThisWeek());
  const [weight, setWeight] = useState<number>(0);
  const [waist, setWaist] = useState<number>(0);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/";
        return;
      }

      const { data } = await supabase
        .from("weekly_checkins")
        .select("*")
        .eq("week_start", weekStart)
        .single();

      if (data) {
        setWeight(Number(data.weight_kg ?? 0));
        setWaist(Number(data.waist_cm ?? 0));
        setNote(data.note ?? "");
      }
    })();
  }, [weekStart]);

  async function save() {
    setMsg("");
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return (window.location.href = "/");

    const { error } = await supabase.from("weekly_checkins").upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        weight_kg: weight,
        waist_cm: waist,
        note,
      },
      { onConflict: "user_id,week_start" }
    );

    setMsg(error ? error.message : "Check-in sauvegardé ✅");
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Check-in hebdo</h1>
          <a className="rounded-lg border px-3 py-2" href="/dashboard">
            Dashboard
          </a>
        </div>

        <div className="rounded-xl bg-white p-5 shadow space-y-4">
          <p className="text-sm text-zinc-600">Semaine (lundi) : {weekStart}</p>

          <label className="text-sm block">
            Poids (kg)
            <input
              className="mt-1 w-full rounded border p-2"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </label>

          <label className="text-sm block">
            Tour de taille (cm)
            <input
              className="mt-1 w-full rounded border p-2"
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
            />
          </label>

          <label className="text-sm block">
            Note (optionnel)
            <textarea
              className="mt-1 w-full rounded border p-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <button onClick={save} className="w-full rounded-lg bg-black py-2 text-white">
            Sauvegarder
          </button>

          {msg && <p className="text-sm text-zinc-700">{msg}</p>}
        </div>
      </div>
    </main>
  );
}
