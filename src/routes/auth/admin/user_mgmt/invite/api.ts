import type { InvitePostResponse, InvitePostRequest } from "./+server.ts";

export async function MakeInvite(req: InvitePostRequest, callback: (response: InvitePostResponse) => void) {
  const response = await fetch("/auth/admin/user_mgmt/invite", {
    method: "POST",
    body: JSON.stringify(req),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  })

  callback(await response.json());
}

