export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const allowedIds = [8663339];
    if (!allowedIds.includes(Number(user.id))) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    await setUserSession(event, { user }, { maxAge: 60 * 60 * 24 * 30 });
    return sendRedirect(event, "/");
  },
});
