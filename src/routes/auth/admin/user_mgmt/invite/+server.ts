import type { RequestHandler } from '@sveltejs/kit';
import { reportError } from "$lib/error";
import { json } from '@sveltejs/kit';
import { Option as O, Either as E } from "effect";
import { CreateUser } from '$lib/database_update';

export type InvitePostResponse = {
  status: "success" | "failure"
  message?: string
}

export type InvitePostRequest = {
  email: string
}

export const POST: RequestHandler = async ({ locals, request }) => {
  if (O.isNone(locals.user)) {
      return json({status: "failure", message: "Unauthorized"})
  }

  const req = await request.json() as InvitePostRequest
  return json(E.match(await CreateUser(req.email), {
      onLeft(error) {
          reportError({req})(error)
          return {status: "failure", message: error.message}
      },
      onRight() {
          return {status: "success", message: "Invite was sent to the email successfully."}
      }
  }))
}
