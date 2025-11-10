import { applyAction, deserialize } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import type { ActionResult } from "@sveltejs/kit";
import { Either as E } from "effect";

export function BuildServerURL() {
  if (process.env.ENVIRONMENT && process.env.ENVIRONMENT == 'prod') {
    return "http://backend:8000";
  } else {
    return "http://localhost:8000";
  }
}

/**
Helper method to use instead of use:enhance; posts JSOn to the server.
*/
export function SubmitJson(getter: () => Object) {
  return async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) => {
    event.preventDefault();
    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: JSON.stringify(getter())
    })
    const result: ActionResult = deserialize(await response.text());
    if (result.type === "success") {
      await invalidateAll();
    }
    applyAction(result)
  };
}

export function ParseJson<T>(encodedObject: string): E.Either<T, Error> {
  try {
    return E.right(JSON.parse(encodedObject) as T)
  } catch (error) {
    return E.left(error as Error)
  }
}

export function WrapFault<T>(job: (...params: any[]) => T, ...params: any[]): E.Either<T, Error> {
  try {
    return E.right(job(params))
  } catch (error) {
    return E.left(error as Error)
  }
}

/**
Given a function that takes a value and returns a result,
Returns a function that takes a result and returns a result.

Useful for chaining functions that can fail anywhere.
*/
export function andThen<In, Out, E1, E2>(funct: (param: In) => E.Either<Out, E1>): (paramResult: E.Either<In, E2>) => E.Either<Out, E1 | E2> {
  return E.match({
    onLeft(err) {
      return E.left(err)
    },
    onRight(val) {
      const second = funct(val)
      return second
    }
  })
}


/**
Given a function that takes a value and returns a result wrapped in a promise,
Returns a function that takes a result and returns a result wrapped in a promise.

Useful for transitions between synchronous to asynchronous functions in a result chain.
*/
export function andThenToAsync<In, Out, E1, E2>(funct: (param: In) => Promise<E.Either<Out, E1>>): (paramResult: E.Either<In, E2>) => Promise<E.Either<Out, E1 | E2>> {
  return async (paramResult) => {
    return E.match({
      async onLeft(err: E2) {
        return E.left(err)
      },
      async onRight(val: In) {
        return await funct(val)
      }
    })(paramResult)
  }
}


/**
Given a function that takes a value and returns a result wrapped in a promise,
Returns a function that takes a result wrapped in a promise and returns a result wrapped in a promise.

Useful for chaining asynchronous functions that can fail anywhere.
*/
export function andThenAsync<In, Out, E1, E2>(funct: (param: In) => Promise<E.Either<Out, E1>>): (paramResult: Promise<E.Either<In, E2>>) => Promise<E.Either<Out, E1 | E2>> {
  return async (paramResult) => {
    const awaitedResult = await paramResult;
    return E.match({
      async onLeft(err: E2) {
        return E.left(err)
      },
      async onRight(val: In) {
        return await funct(val)
      }
    })(awaitedResult)
  }
}

