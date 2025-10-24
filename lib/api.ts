export type AddProjectResult = { ok: true; projectId: string; project?: any } | { ok: false; error: string };
export async function addProject(projectName: string, leadId?: string): Promise<AddProjectResult> {
  try {
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name: projectName, leadId }) });
    const payload = await res.json().catch(() => null);
    if (!res.ok) { const err = payload?.error || payload?.message || `HTTP ${res.status}`; return { ok: false, error: err }; }
    return { ok: true, projectId: payload?.projectId || payload?.id || "", project: payload };
  } catch (err: any) { return { ok: false, error: err?.message || "Network error" }; }
}
