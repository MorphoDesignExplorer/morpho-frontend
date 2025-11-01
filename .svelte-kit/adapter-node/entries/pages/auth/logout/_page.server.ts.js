import { redirect } from "@sveltejs/kit";
const load = ({ cookies }) => {
  cookies.delete("jwt", { path: "/", secure: true, httpOnly: true });
  return redirect(308, "/");
};
export {
  load
};
