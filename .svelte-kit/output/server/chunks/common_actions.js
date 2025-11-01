const common_actions = {
  logout: async ({ cookies }) => {
    cookies.delete("jwt", { path: "/" });
  }
};
export {
  common_actions as c
};
