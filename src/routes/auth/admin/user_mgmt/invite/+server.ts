import type { RequestHandler } from '@sveltejs/kit';
import { reportError } from "$lib/error";
import { json } from '@sveltejs/kit';
import { Option as O } from "effect";

export type InvitePostResponse = {
  status: "success" | "failure"
  message?: string
}

export type InvitePostRequest = {
  email: "string"
}

export const POST: RequestHandler = async ({ locals, request }) => {
  if (O.isNone(locals.user)) {
      return json({status: "failure", message: "Unauthorized"})
  }

  try {
    // TODO send email here
    const wellFormedRequest: InvitePostRequest = await request.json();
    console.log("mailing to", wellFormedRequest.email)
    return json({status: "failure", message: "NOT IMPLEMENTED"})
  } catch(e) {
    reportError({locals})(e as Error);
    return json({status: "failure", message: "Server error."})
  }
}
