import { useCallback, useState } from "react";
import { useRouter } from "next/router";

type LoginMode = "bot" | "member" | "user" | "webhook";

function parseWebhook(urlStr: string) {
  const url = new URL(urlStr);
  const { hostname, pathname } = url;
  const domain = hostname.split(".").slice(-2).join(".");
  if (domain !== "discord.com") {
    return {};
  }
  const [, sApi, sWebhooks, id, token] = pathname.split("/");
  if (sApi !== "api" || sWebhooks !== "webhooks") {
    return {};
  }
  return {
    id,
    token,
  };
}

export const useLogin = (mode?: LoginMode, prompt = true) => {
  const [error, setError] = useState<string>();
  const router = useRouter();

  const login = useCallback(
    (webhookUrl?: string) => {
      if (!mode) throw new Error("mode is required");
      if (mode === "webhook") {
        if (webhookUrl) {
          const { id, token } = parseWebhook(webhookUrl);
          if (id && token) {
            return router.push(`/api/auth/webhook?id=${id}&token=${token}`);
          }
          setError("Invalid webhook URL");
          return Promise.reject("Invalid webhook URL");
        }
        return router.push("/prompt/login/webhook");
      }
      if (prompt) {
        return router.push(`/prompt/login/${mode}`);
      }
      return router.push(`/api/auth/oauth?mode=${mode}`);
    },
    [mode]
  );

  return {
    login,
    error,
  };
};
