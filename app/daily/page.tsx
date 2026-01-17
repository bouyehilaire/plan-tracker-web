"use client";

import { supabase } from "../lib/supabaseClient";


function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Daily() {
  const [day] = useState(todayISO());
  const [steps, setSteps] = useState<number>(0);
  const [eggs, setEggs] = useState<number>(0);
  const [water, setWater] = useState<number>(0);

  const [whey, setWhey] = useState(false);
  const [creatine, setCreatine] = useState(false);
  const [collagen, setCollagen] = useState(false);
  const [garlic, setGarlic] = useState(false);
  const [lemonWater, setLemonWater] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        window.location.href = "/";
        return;
      }

      const { data } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("day", day)
        .single();

      if (data) {
        setSteps(data.steps ?? 0);
        setEggs(data.eggs ?? 0);
        setWater(Number(data.water_liters ?? 0));
        setWhey(!!data.whey);
        setCreatine(!!data.creatine);
        setCollagen(!!data.collagen);
        setGarlic(!!data.garlic);
        setLemonWater(!!data.lemon_water);
      }
    })();
  }, [day]);

  async function save() {
    setSaving(true);
    setMsg("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      window.location.href = "/";
      return;
    }

    const payload = {
      user_id: user.id,
      day,
      steps,
      eggs,
      water_liters: water,
      whey,
      creatine,
      collagen,
      garlic,
      lemon_water: lemonWater,
    };

    const { error } = await supabase.from("daily_logs").upsert(payload, {
      onConflict: "user_id,day",
    });

    setSaving(false);
    setMsg(error ? error.message : "Sauvegardé ✅");
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daily</h1>
          <a className="rounded-lg border px-3 py-2" href="/dashboard">
            Dashboard
          </a>
        </div>

        <div className="rounded-xl bg-white p-5 shadow space-y-4">
          <p className="text-sm text-zinc-600">Date : {day}</p>

          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">
              Pas
              <input
                className="mt-1 w-full rounded border p-2"
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Œufs
              <input
                className="mt-1 w-full rounded border p-2"
                type="number"
                value={eggs}
                onChange={(e) => setEggs(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Eau (L)
              <input
                className="mt-1 w-full rounded border p-2"
                type="number"
                step="0.1"
                value={water}
                onChange={(e) => setWater(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="space-y-2">
            {[
              ["Whey", whey, setWhey],
              ["Créatine", creatine, setCreatine],
              ["Collagène", collagen, setCollagen],
              ["Ail", garlic, setGarlic],
              ["Eau citronnée", lemonWater, setLemonWater],
            ].map(([label, val, setter]) => (
              <label key={label as string} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={val as boolean}
                  onChange={(e) => (setter as any)(e.target.checked)}
                />
                <span>{label as string}</span>
              </label>
            ))}
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>

          {msg && <p className="text-sm text-zinc-700">{msg}</p>}
        </div>
      </div>
    </main>
  );
}
