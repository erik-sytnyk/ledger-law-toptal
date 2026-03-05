const API_BASE = import.meta.env.VITE_API_URL || "";

export async function generateDemand(payload) {
  const res = await fetch(`${API_BASE}/api/generate-demand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }
  return data;
}
