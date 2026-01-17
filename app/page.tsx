// TEST-HILAIRE-123
"use client";


import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "Compte créé, connecte-toi.");
  }

  async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) setMsg(error.message);
  else window.location.href = "/dashboard";
}


  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-80 space-y-3 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center">Plan Tracker</h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signIn}
          className="bg-black text-white w-full p-2 rounded"
        >
          Se connecter
        </button>
        <button
          onClick={signUp}
          className="border w-full p-2 rounded"
        >
          Créer compte
        </button>

        {msg && <p className="text-sm text-center">{msg}</p>}
      </div>
    </main>
  );
}

