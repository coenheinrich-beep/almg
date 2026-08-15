import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Trash2, Save, Clock, Undo2, Redo2, RotateCcw, Check, ChevronRight, X, ShoppingCart, Copy, CheckCheck } from "lucide-react";

/* ---------- unit sets ---------- */
const UNIT_SETS = {
  single: [{ key: "qty", label: "Bottles" }],
  cases_cans: [
    { key: "cases", label: "Cases" },
    { key: "cans", label: "Cans" },
  ],
  boxes_containers: [
    { key: "boxes", label: "Boxes" },
    { key: "containers", label: "Containers" },
  ],
  boxes_sleeves: [
    { key: "boxes", label: "Boxes" },
    { key: "sleeves", label: "Sleeves" },
  ],
  boxes_bags: [
    { key: "boxes", label: "Boxes" },
    { key: "bags", label: "Bags" },
  ],
  boxes_cans: [
    { key: "boxes", label: "Boxes" },
    { key: "cans", label: "Cans" },
  ],
};

let _id = 0;
const nid = () => String(++_id);
const item = (name, category, counts, low, unitSet = "single", note) => ({
  id: nid(),
  name,
  category,
  counts,
  low,
  unitSet,
  note: note || null,
  counted: false,
});

const DEFAULT_ITEMS = [
  item("Espresso", "Beans", { boxes: 0, bags: 8 }, 3, "boxes_bags"),
  item("Decaf", "Beans", { boxes: 0, bags: 0 }, 0, "boxes_bags", "eyeball"),

  item("16oz Ice", "Ice Cups", { boxes: 0, sleeves: 0 }, 3, "boxes_sleeves"),
  item("24oz Ice", "Ice Cups", { boxes: 0, sleeves: 7 }, 3, "boxes_sleeves"),
  item("32oz Ice", "Ice Cups", { boxes: 0, sleeves: 7 }, 3, "boxes_sleeves"),

  item("8oz Hot", "Hot Cups", { boxes: 0, sleeves: 0 }, 3, "boxes_sleeves"),
  item("12oz Hot", "Hot Cups", { boxes: 0, sleeves: 0 }, 3, "boxes_sleeves"),
  item("16oz Hot", "Hot Cups", { boxes: 0, sleeves: 0 }, 3, "boxes_sleeves"),
  item("20oz Hot", "Hot Cups", { boxes: 0, sleeves: 0 }, 3, "boxes_sleeves"),

  item("16/24oz Flat", "Lids", { boxes: 0, sleeves: 4 }, 2, "boxes_sleeves"),
  item("32oz Flat", "Lids", { boxes: 0, sleeves: 4 }, 2, "boxes_sleeves"),
  item("16/24oz Dome", "Lids", { boxes: 0, sleeves: 1 }, 2, "boxes_sleeves"),
  item("32oz Dome", "Lids", { boxes: 0, sleeves: 1 }, 2, "boxes_sleeves"),
  item("16/24oz Sip", "Lids", { boxes: 0, sleeves: 1 }, 2, "boxes_sleeves"),
  item("32oz Sip", "Lids", { boxes: 0, sleeves: 1 }, 2, "boxes_sleeves"),
  item("Hot Cup Lid", "Lids", { boxes: 0, sleeves: 0 }, 2, "boxes_sleeves"),
  item("Kids Hot Cup Lid", "Lids", { boxes: 0, sleeves: 0 }, 2, "boxes_sleeves"),

  item("Energy", "Energy & Cans", { cases: 0, cans: 106 }, 20, "cases_cans"),
  item("SF Energy", "Energy & Cans", { cases: 0, cans: 19 }, 10, "cases_cans"),
  item("LaCroix", "Energy & Cans", { boxes: 0, cans: 25 }, 10, "boxes_cans"),

  item("Cold Brew", "Beverages & Mixes", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("Ice Cream Mix", "Beverages & Mixes", { boxes: 0, containers: 9 }, 3, "boxes_containers"),
  item("7 Energy Chiller", "Beverages & Mixes", { boxes: 0, containers: 4 }, 2, "boxes_containers"),
  item("Lemonade Concentrate", "Beverages & Mixes", { boxes: 0, containers: 3 }, 2, "boxes_containers"),

  item("Smooth Mix", "Milk", { boxes: 0, containers: 43 }, 10, "boxes_containers"),
  item("Mocha Mix", "Milk", { boxes: 0, containers: 19 }, 8, "boxes_containers"),
  item("Whole Milk", "Milk", { boxes: 0, containers: 29 }, 8, "boxes_containers"),
  item("Skim Milk", "Milk", { boxes: 0, containers: 0 }, 5, "boxes_containers"),
  item("Almond Milk", "Milk", { boxes: 0, containers: 5 }, 3, "boxes_containers"),
  item("Oat Milk", "Milk", { boxes: 0, containers: 7 }, 3, "boxes_containers"),
  item("Coconut Milk", "Milk", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("Tea Chai", "Milk", { boxes: 0, containers: 5 }, 2, "boxes_containers"),

  item("Whipped Cream", "Cream & Foam", { boxes: 0, cans: 8 }, 3, "boxes_cans"),
  item("Cold Foam", "Cream & Foam", { boxes: 0, cans: 9 }, 3, "boxes_cans"),
  item("Heavy Cream", "Cream & Foam", { boxes: 0, containers: 0 }, 2, "boxes_containers"),

  item("Strawberry", "Smoothies", { boxes: 0, containers: 3 }, 2, "boxes_containers"),
  item("Mango", "Smoothies", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("Pina Colada", "Smoothies", { boxes: 0, containers: 3 }, 2, "boxes_containers"),
  item("Wild-Berry", "Smoothies", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("Blueberry Pom", "Smoothies", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("Peach", "Smoothies", { boxes: 0, containers: 0 }, 2, "boxes_containers"),

  item("Chocolate Muffin", "Bakery", { boxes: 0, containers: 5 }, 2, "boxes_containers"),
  item("Blueberry Muffin", "Bakery", { boxes: 0, containers: 3 }, 2, "boxes_containers"),
  item("Lemon Muffin", "Bakery", { boxes: 0, containers: 2 }, 2, "boxes_containers"),

  item("Caramel", "Sauces", { boxes: 0, containers: 12 }, 3, "boxes_containers"),
  item("Dark Chocolate", "Sauces", { boxes: 0, containers: 2 }, 3, "boxes_containers"),
  item("White Chocolate", "Sauces", { boxes: 0, containers: 8 }, 3, "boxes_containers"),
  item("SF Caramel", "Sauces", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("SF Dark Chocolate", "Sauces", { boxes: 0, containers: 0 }, 2, "boxes_containers"),
  item("SF White Chocolate", "Sauces", { boxes: 0, containers: 0 }, 2, "boxes_containers"),

  item("Vanilla", "Syrups", { qty: 12 }, 2),
  item("SF Vanilla", "Syrups", { qty: 0 }, 2),
  item("Blue Raspberry", "Syrups", { qty: 6 }, 2),
  item("Coconut", "Syrups", { qty: 8 }, 2),
  item("Strawberry", "Syrups", { qty: 6 }, 2),
  item("Watermelon", "Syrups", { qty: 0 }, 2),
  item("Salted Caramel", "Syrups", { qty: 4 }, 2),
  item("Toasted Marshmallow", "Syrups", { qty: 3 }, 2),
  item("Hazelnut", "Syrups", { qty: 3 }, 2),
  item("Pineapple", "Syrups", { qty: 4 }, 2),
  item("Cupcake", "Syrups", { qty: 0 }, 2),
  item("Mango", "Syrups", { qty: 0 }, 2),
  item("Kiwi", "Syrups", { qty: 0 }, 2),
  item("Banana", "Syrups", { qty: 0 }, 2),
  item("Peach", "Syrups", { qty: 0 }, 2),
  item("Orange", "Syrups", { qty: 3 }, 2),
  item("Pomegranate", "Syrups", { qty: 2 }, 2),
  item("Raspberry", "Syrups", { qty: 0 }, 2),
  item("Lime", "Syrups", { qty: 0 }, 2),
];

const CATEGORIES = [
  "Beans",
  "Ice Cups",
  "Hot Cups",
  "Lids",
  "Energy & Cans",
  "Beverages & Mixes",
  "Milk",
  "Cream & Foam",
  "Smoothies",
  "Bakery",
  "Sauces",
  "Syrups",
  "Other",
];

/* 7 Brew palette */
const C = {
  navy: "#0A2540",
  blue: "#1D6FE0",
  sky: "#DCEBFB",
  orange: "#F26430",
  cream: "#FFF8EC",
  butter: "#FFD25A",
  ink: "#12233A",
};

function weekLabel(d = new Date()) {
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return monday.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

const totalOf = (it) => Object.values(it.counts).reduce((a, b) => a + b, 0);

function countLabel(it) {
  const counters = UNIT_SETS[it.unitSet] || UNIT_SETS.single;
  return counters
    .map((c) => {
      const v = it.counts[c.key] ?? 0;
      if (v === 0) return null;
      return `${v} ${c.label.toLowerCase()}`;
    })
    .filter(Boolean)
    .join(", ") || "0";
}

function loadLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function buildOrderText(lowItems) {
  const byCategory = {};
  for (const it of lowItems) {
    if (!byCategory[it.category]) byCategory[it.category] = [];
    byCategory[it.category].push(it);
  }

  const lines = [`7 BREW ORDER LIST — Week of ${weekLabel()}`, ""];
  for (const [cat, catItems] of Object.entries(byCategory)) {
    lines.push(cat.toUpperCase());
    for (const it of catItems) {
      const label = countLabel(it);
      lines.push(`  • ${it.name} — have ${label}`);
    }
    lines.push("");
  }
  lines.push(`${lowItems.length} item${lowItems.length !== 1 ? "s" : ""} need attention`);
  lines.push(`Generated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`);
  return lines.join("\n");
}

export default function App() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | todo | low
  const [activeCat, setActiveCat] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showOrderList, setShowOrderList] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCat, setNewItemCat] = useState(CATEGORIES[0]);
  const [newItemUnitSet, setNewItemUnitSet] = useState("single");
  const [status, setStatus] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [copied, setCopied] = useState(false);

  const past = useRef([]);
  const future = useRef([]);
  const [, tick] = useState(0);
  const bump = () => tick((n) => n + 1);

  useEffect(() => {
    const savedItems = loadLocal("brew-items-v2");
    if (savedItems) setItems(savedItems);
    const savedHistory = loadLocal("brew-history-v2");
    if (savedHistory) setHistory(savedHistory);
    setLoading(false);
  }, []);

  const persist = (next) => {
    setItems(next);
    saveLocal("brew-items-v2", next);
  };

  const commit = (next) => {
    past.current.push(items);
    if (past.current.length > 60) past.current.shift();
    future.current = [];
    persist(next);
    bump();
  };

  const undo = () => {
    if (!past.current.length) return;
    const prev = past.current.pop();
    future.current.push(items);
    persist(prev);
    bump();
  };

  const redo = () => {
    if (!future.current.length) return;
    const nxt = future.current.pop();
    past.current.push(items);
    persist(nxt);
    bump();
  };

  const resetAll = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    commit(DEFAULT_ITEMS);
    setConfirmReset(false);
    flash("Reset to the starting list");
  };

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2600);
  };

  const setCount = (id, key, val) => {
    commit(
      items.map((it) =>
        it.id === id ? { ...it, counts: { ...it.counts, [key]: Math.max(0, val) }, counted: true } : it
      )
    );
  };

  const toggleCounted = (id) => {
    commit(items.map((it) => (it.id === id ? { ...it, counted: !it.counted } : it)));
  };

  const removeItem = (id) => commit(items.filter((it) => it.id !== id));

  const addItem = () => {
    if (!newItemName.trim()) return;
    const counts = {};
    UNIT_SETS[newItemUnitSet].forEach((c) => (counts[c.key] = 0));
    commit([
      ...items,
      {
        id: Date.now().toString(),
        name: newItemName.trim(),
        category: newItemCat,
        counts,
        low: 2,
        unitSet: newItemUnitSet,
        note: null,
        counted: false,
      },
    ]);
    setNewItemName("");
    flash(`Added ${newItemName.trim()}`);
  };

  const saveWeek = () => {
    const snap = {
      date: new Date().toISOString(),
      label: weekLabel(),
      items: items.map(({ name, category, counts, unitSet }) => ({ name, category, counts, unitSet })),
    };
    const next = [snap, ...history].slice(0, 26);
    setHistory(next);
    const ok = saveLocal("brew-history-v2", next);
    if (ok) {
      commit(items.map((it) => ({ ...it, counted: false })));
      flash("Count saved. Sheet cleared for next week.");
    } else {
      flash("Couldn't save — try again");
    }
  };

  const copyOrderList = async () => {
    const text = buildOrderText(lowItems);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      flash("Clipboard not available — try long-pressing the text above");
    }
  };

  const counted = items.filter((i) => i.counted).length;
  const lowItems = items.filter((i) => totalOf(i) <= i.low);
  const pct = items.length ? Math.round((counted / items.length) * 100) : 0;

  const visible = useMemo(() => {
    let v = items;
    if (filter === "todo") v = v.filter((i) => !i.counted);
    if (filter === "low") v = v.filter((i) => totalOf(i) <= i.low);
    if (activeCat) v = v.filter((i) => i.category === activeCat);
    return v;
  }, [items, filter, activeCat]);

  const visibleCats = CATEGORIES.filter((c) => visible.some((i) => i.category === c));

  // Group low items by category for the order sheet
  const lowByCategory = useMemo(() => {
    const grouped = {};
    for (const it of lowItems) {
      if (!grouped[it.category]) grouped[it.category] = [];
      grouped[it.category].push(it);
    }
    return grouped;
  }, [lowItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.cream }}>
        <p className="text-sm font-semibold" style={{ color: C.blue }}>
          Loading the count sheet…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: C.cream, color: C.ink }}>
      {/* Header */}
      <div style={{ background: C.navy }} className="px-4 pt-5 pb-4 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black tracking-[0.2em] mb-1.5"
                style={{ background: C.orange, color: "#fff" }}
              >
                7 BREW
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">Weekly Count</h1>
              <p className="text-sm mt-1" style={{ color: C.sky }}>
                Week of {weekLabel()}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0 pt-1">
              <IconBtn onClick={undo} disabled={!past.current.length} title="Undo">
                <Undo2 size={15} />
              </IconBtn>
              <IconBtn onClick={redo} disabled={!future.current.length} title="Redo">
                <Redo2 size={15} />
              </IconBtn>
              <button
                onClick={resetAll}
                className="h-9 px-2.5 rounded-xl flex items-center gap-1 text-xs font-bold transition"
                style={{
                  background: confirmReset ? C.orange : "rgba(255,255,255,0.12)",
                  color: "#fff",
                }}
              >
                <RotateCcw size={14} />
                {confirmReset && "Confirm"}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold tracking-wide" style={{ color: C.sky }}>
                {counted} of {items.length} counted
              </span>
              <span className="text-xs font-black" style={{ color: C.butter }}>
                {pct}%
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.butter}, ${C.orange})` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Filters */}
        <div className="flex gap-2 mt-4 mb-3">
          <Chip active={filter === "all"} onClick={() => setFilter("all")} label={`All ${items.length}`} />
          <Chip active={filter === "todo"} onClick={() => setFilter("todo")} label={`Left ${items.length - counted}`} />
          <Chip
            active={filter === "low"}
            onClick={() => setFilter("low")}
            label={`Low ${lowItems.length}`}
            accent={C.orange}
          />
        </div>

        {/* Category jump */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 mb-2">
          <button
            onClick={() => setActiveCat(null)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
            style={
              activeCat === null
                ? { background: C.navy, color: "#fff" }
                : { background: "#fff", color: C.navy, border: `1.5px solid ${C.sky}` }
            }
          >
            Everything
          </button>
          {CATEGORIES.filter((c) => items.some((i) => i.category === c)).map((cat) => {
            const inCat = items.filter((i) => i.category === cat);
            const done = inCat.filter((i) => i.counted).length;
            const allDone = done === inCat.length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(activeCat === cat ? null : cat)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1"
                style={
                  activeCat === cat
                    ? { background: C.navy, color: "#fff" }
                    : { background: "#fff", color: C.navy, border: `1.5px solid ${allDone ? "#7BC96F" : C.sky}` }
                }
              >
                {allDone && <Check size={11} style={{ color: activeCat === cat ? "#fff" : "#4CA83D" }} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Items */}
        {visible.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-black" style={{ color: C.navy }}>
              {filter === "todo" ? "Everything's counted." : "Nothing here."}
            </p>
            <p className="text-sm mt-1 opacity-60">
              {filter === "todo" ? "Save the count when you're ready." : "Try a different filter."}
            </p>
          </div>
        )}

        {visibleCats.map((cat) => (
          <section key={cat} className="mb-5">
            <div className="flex items-center gap-2 mb-2 mt-1">
              <h2 className="text-sm font-black tracking-wide uppercase" style={{ color: C.blue }}>
                {cat}
              </h2>
              <div className="flex-1 h-px" style={{ background: C.sky }} />
              <span className="text-[11px] font-bold opacity-40">
                {visible.filter((i) => i.category === cat).length}
              </span>
            </div>

            <div className="space-y-2">
              {visible
                .filter((it) => it.category === cat)
                .map((it) => {
                  const total = totalOf(it);
                  const isLow = total <= it.low;
                  const counters = UNIT_SETS[it.unitSet] || UNIT_SETS.single;
                  return (
                    <div
                      key={it.id}
                      className="rounded-2xl overflow-hidden transition-all"
                      style={{
                        background: "#fff",
                        border: `2px solid ${it.counted ? "#8FD98A" : isLow ? C.orange : C.sky}`,
                        boxShadow: it.counted ? "none" : "0 1px 3px rgba(10,37,64,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                        <button
                          onClick={() => toggleCounted(it.id)}
                          className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition"
                          style={{
                            background: it.counted ? "#4CA83D" : "transparent",
                            border: it.counted ? "none" : `2px solid ${C.sky}`,
                          }}
                          title={it.counted ? "Mark as not counted" : "Mark as counted"}
                        >
                          {it.counted && <Check size={14} color="#fff" strokeWidth={3.5} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-bold leading-tight truncate">{it.name}</p>
                          {it.note && <p className="text-[11px] italic opacity-50">{it.note}</p>}
                        </div>
                        {isLow && (
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: "#FFE8DF", color: C.orange }}
                          >
                            LOW
                          </span>
                        )}
                        <button
                          onClick={() => removeItem(it.id)}
                          className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center opacity-25 hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="px-3 pb-2.5 space-y-1.5">
                        {counters.map((c) => (
                          <div key={c.key} className="flex items-center gap-2">
                            <span className="text-xs font-bold w-[74px] shrink-0 opacity-55">{c.label}</span>
                            <button
                              onClick={() => setCount(it.id, c.key, it.counts[c.key] - 1)}
                              className="w-10 h-10 rounded-xl text-xl font-bold flex items-center justify-center active:scale-95 transition"
                              style={{ background: C.sky, color: C.navy }}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={it.counts[c.key]}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => setCount(it.id, c.key, parseInt(e.target.value) || 0)}
                              className="w-14 h-10 text-center rounded-xl font-black text-lg outline-none"
                              style={{ background: C.cream, color: C.navy, border: `1.5px solid ${C.sky}` }}
                            />
                            <button
                              onClick={() => setCount(it.id, c.key, it.counts[c.key] + 1)}
                              className="w-10 h-10 rounded-xl text-xl font-bold flex items-center justify-center text-white active:scale-95 transition"
                              style={{ background: C.blue }}
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}

        {/* Add item */}
        <div className="rounded-2xl p-3 mb-4" style={{ background: "#fff", border: `2px dashed ${C.sky}` }}>
          <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: C.blue }}>
            Add an item
          </p>
          <div className="flex gap-2 mb-2">
            <input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="What are we adding?"
              className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none"
              style={{ background: C.cream, border: `1.5px solid ${C.sky}` }}
            />
            <button
              onClick={addItem}
              className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white active:scale-95"
              style={{ background: C.orange }}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={newItemCat}
              onChange={(e) => setNewItemCat(e.target.value)}
              className="flex-1 min-w-0 rounded-xl px-2 py-2 text-xs font-bold outline-none"
              style={{ background: C.cream, border: `1.5px solid ${C.sky}`, color: C.navy }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={newItemUnitSet}
              onChange={(e) => setNewItemUnitSet(e.target.value)}
              className="flex-1 min-w-0 rounded-xl px-2 py-2 text-xs font-bold outline-none"
              style={{ background: C.cream, border: `1.5px solid ${C.sky}`, color: C.navy }}
            >
              <option value="single">Bottles</option>
              <option value="cases_cans">Cases / Cans</option>
              <option value="boxes_containers">Boxes / Containers</option>
              <option value="boxes_sleeves">Boxes / Sleeves</option>
              <option value="boxes_bags">Boxes / Bags</option>
              <option value="boxes_cans">Boxes / Cans</option>
            </select>
          </div>
        </div>

        {/* History */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between py-3 px-1 text-sm font-bold"
          style={{ color: C.navy }}
        >
          <span className="flex items-center gap-2">
            <Clock size={15} /> Past counts ({history.length})
          </span>
          <ChevronRight size={16} className={showHistory ? "rotate-90 transition" : "transition"} />
        </button>

        {showHistory && (
          <div className="space-y-2 mb-4">
            {!history.length && (
              <p className="text-sm opacity-50 px-1">No saved counts yet. Save one at the bottom.</p>
            )}
            {history.map((snap, i) => {
              const lows = snap.items.filter(
                (it) => Object.values(it.counts).reduce((a, b) => a + b, 0) === 0
              );
              return (
                <div key={i} className="rounded-xl p-3" style={{ background: "#fff", border: `1.5px solid ${C.sky}` }}>
                  <p className="font-black text-sm mb-1" style={{ color: C.navy }}>
                    Week of {snap.label}
                  </p>
                  <p className="text-xs opacity-60 leading-relaxed">
                    {snap.items
                      .filter((it) => Object.values(it.counts).reduce((a, b) => a + b, 0) > 0)
                      .map((it) => {
                        const unitSet = it.unitSet || "single";
                        const counters = UNIT_SETS[unitSet] || UNIT_SETS.single;
                        const parts = counters
                          .map((c) => {
                            const v = it.counts[c.key] ?? 0;
                            return v > 0 ? `${v} ${c.label.toLowerCase()}` : null;
                          })
                          .filter(Boolean)
                          .join(" + ");
                        return `${it.name} (${parts || "0"})`;
                      })
                      .join(" · ") || "All zero"}
                  </p>
                  {lows.length > 0 && (
                    <p className="text-[11px] font-bold mt-1.5" style={{ color: C.orange }}>
                      {lows.length} item{lows.length > 1 ? "s" : ""} at zero
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4"
        style={{ background: "rgba(255,248,236,0.96)", backdropFilter: "blur(8px)", borderTop: `2px solid ${C.sky}` }}
      >
        <div className="max-w-lg mx-auto">
          {status && (
            <p className="text-center text-xs font-bold mb-2" style={{ color: C.blue }}>
              {status}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowOrderList(true)}
              className="relative h-14 px-4 shrink-0 rounded-2xl flex items-center justify-center gap-2 font-black text-sm active:scale-[0.98] transition"
              style={{ background: C.orange, color: "#fff" }}
            >
              <ShoppingCart size={17} strokeWidth={2.5} />
              Order
              {lowItems.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: C.navy, color: "#fff" }}
                >
                  {lowItems.length}
                </span>
              )}
            </button>
            <button
              onClick={saveWeek}
              className="flex-1 h-14 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 text-white active:scale-[0.98] transition"
              style={{ background: counted === items.length ? "#3AA02C" : C.blue }}
            >
              <Save size={17} strokeWidth={2.5} />
              {counted === items.length ? "Save the finished count" : `Save count (${counted}/${items.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Order List Sheet */}
      {showOrderList && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,37,64,0.55)" }}
            onClick={() => setShowOrderList(false)}
          />
          {/* Sheet */}
          <div
            className="relative rounded-t-3xl overflow-hidden flex flex-col"
            style={{ background: C.cream, maxHeight: "85vh" }}
          >
            {/* Sheet header */}
            <div className="px-5 pt-5 pb-4 shrink-0" style={{ background: C.navy }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} color={C.butter} strokeWidth={2.5} />
                  <h2 className="text-lg font-black text-white">Order List</h2>
                </div>
                <button
                  onClick={() => setShowOrderList(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <X size={16} color="#fff" />
                </button>
              </div>
              <p className="text-xs" style={{ color: C.sky }}>
                Week of {weekLabel()} · {lowItems.length} item{lowItems.length !== 1 ? "s" : ""} need attention
              </p>
            </div>

            {/* Sheet body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              {lowItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-black text-base" style={{ color: C.navy }}>Nothing needs ordering!</p>
                  <p className="text-sm opacity-60 mt-1">All items are above their low threshold.</p>
                </div>
              ) : (
                Object.entries(lowByCategory).map(([cat, catItems]) => (
                  <div key={cat} className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xs font-black tracking-widest uppercase" style={{ color: C.blue }}>
                        {cat}
                      </h3>
                      <div className="flex-1 h-px" style={{ background: C.sky }} />
                    </div>
                    <div className="space-y-2">
                      {catItems.map((it) => {
                        const counters = UNIT_SETS[it.unitSet] || UNIT_SETS.single;
                        const total = totalOf(it);
                        return (
                          <div
                            key={it.id}
                            className="rounded-xl px-3 py-2.5 flex items-center justify-between gap-3"
                            style={{ background: "#fff", border: `1.5px solid ${total === 0 ? C.orange : C.sky}` }}
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-sm leading-tight truncate">{it.name}</p>
                              <p className="text-xs mt-0.5 opacity-60">
                                {counters.map((c) => `${it.counts[c.key] ?? 0} ${c.label.toLowerCase()}`).join(" + ")}
                              </p>
                            </div>
                            <span
                              className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full"
                              style={
                                total === 0
                                  ? { background: C.orange, color: "#fff" }
                                  : { background: "#FFE8DF", color: C.orange }
                              }
                            >
                              {total === 0 ? "OUT" : "LOW"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Copy button */}
            {lowItems.length > 0 && (
              <div className="px-5 pb-6 pt-2 shrink-0" style={{ borderTop: `1.5px solid ${C.sky}` }}>
                <button
                  onClick={copyOrderList}
                  className="w-full rounded-2xl py-3.5 font-black text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition"
                  style={{
                    background: copied ? "#3AA02C" : C.navy,
                    color: "#fff",
                  }}
                >
                  {copied ? <CheckCheck size={17} strokeWidth={2.5} /> : <Copy size={17} strokeWidth={2.5} />}
                  {copied ? "Copied to clipboard!" : "Copy order list"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition disabled:opacity-25"
      style={{ background: "rgba(255,255,255,0.12)" }}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, label, accent }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 rounded-xl text-xs font-black transition"
      style={
        active
          ? { background: accent || "#0A2540", color: "#fff" }
          : { background: "#fff", color: "#0A2540", border: "1.5px solid #DCEBFB" }
      }
    >
      {label}
    </button>
  );
}
