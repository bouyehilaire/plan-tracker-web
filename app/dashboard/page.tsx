"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) window.location.href = "/";
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow space-y-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-zinc-600">Bienvenue 👊</p>

        <div className="flex gap-2">
          <a className="flex-1 rounded-lg bg-black px-4 py-2 text-white text-center" href="/daily">
            Daily
          </a>
          <a className="flex-1 rounded-lg border px-4 py-2 text-center" href="/checkin">
            Check-in
          </a>
        </div>

        <button onClick={signOut} className="w-full rounded-lg border py-2">
          Déconnexion
        </button>
      </div>
    </main>
  );
}
