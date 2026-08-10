import { createFileRoute } from "@tanstack/react-router";

const APPROVED_EVENTS = new Set([
  "PURCHASE_COMPLETE",
  "PURCHASE_APPROVED",
]);

function extractHottok(request: Request, payload: Record<string, unknown>): string | null {
  const header =
    request.headers.get("x-hotmart-hottok") ??
    request.headers.get("hottok") ??
    request.headers.get("X-HOTMART-HOTTOK");
  if (header) return header;
  const fromBody = (payload as { hottok?: unknown }).hottok;
  return typeof fromBody === "string" ? fromBody : null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/webhooks/hotmart")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["HOTMART_HOTTOK"];
        if (!expected) {
          console.error("[hotmart] HOTMART_HOTTOK is not configured");
          return new Response("Not configured", { status: 500 });
        }

        let payload: Record<string, unknown>;
        try {
          payload = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const hottok = extractHottok(request, payload);
        if (!hottok || !timingSafeEqual(hottok, expected)) {
          console.warn("[hotmart] rejected request with invalid HOTTOK");
          return new Response("Unauthorized", { status: 401 });
        }

        const event = String(payload["event"] ?? payload["status"] ?? "UNKNOWN");
        const data = (payload["data"] ?? {}) as Record<string, unknown>;
        const buyer = (data["buyer"] ?? {}) as Record<string, unknown>;
        const rawEmail =
          (typeof buyer["email"] === "string" ? (buyer["email"] as string) : null) ??
          (typeof (payload["email"] as unknown) === "string" ? (payload["email"] as string) : null);
        const email = rawEmail ? rawEmail.trim().toLowerCase() : null;

        console.log(`[hotmart] event=${event} email=${email ?? "n/a"}`);

        if (!APPROVED_EVENTS.has(event.toUpperCase())) {
          return Response.json({ ok: true, ignored: event });
        }

        if (!email) {
          console.warn("[hotmart] approved purchase without buyer email");
          return Response.json({ ok: true, skipped: "missing_email" });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error: allowError } = await supabaseAdmin
          .from("allowed_emails")
          .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
        if (allowError) {
          console.error(`[hotmart] failed to allowlist ${email}: ${allowError.message}`);
          return new Response("Error", { status: 500 });
        }

        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
          const alreadyExists =
            inviteError.status === 422 ||
            /already|exists|registered/i.test(inviteError.message);

          if (!alreadyExists) {
            console.error(`[hotmart] invite failed for ${email}: ${inviteError.message}`);
            return new Response("Error", { status: 500 });
          }

          const { error: approveError } = await supabaseAdmin
            .from("profiles")
            .update({ approved: true })
            .eq("email", email)
            .eq("approved", false);
          if (approveError) {
            console.error(`[hotmart] approve failed for ${email}: ${approveError.message}`);
            return new Response("Error", { status: 500 });
          }
          console.log(`[hotmart] existing user approved: ${email}`);
          return Response.json({ ok: true, action: "approved_existing" });
        }

        console.log(`[hotmart] invitation sent: ${email}`);
        return Response.json({ ok: true, action: "invited" });
      },
    },
  },
});
