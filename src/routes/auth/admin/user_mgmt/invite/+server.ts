import type RequestHandler from "./$types";
import {reportError} from "$lib/error";
import { json } from '@sveltejs/kit';

export type InvitePostResponse = {
  status: "success" | "failure"
  message?: string
}

export type InvitePostRequest = {
  email: "string"
}

export const POST: RequestHandler = async ({ locals, request, cookies }) => {
  if (O.isNone(locals.user)) {
      return json({status: "failure", message: "Unauthorized"})
  }

  try {
    // TODO send email here
    const wellFormedRequest: InvitePostRequest = await request.json();
    console.log("mailing to", wellFormedRequest.email)
    return json({status: "failure", message: "NOT IMPLEMENTED"})
  } catch(e) {
    reportError({cookies})(e);
    return json({status: "failure", message: "Server error."})
  }
}
