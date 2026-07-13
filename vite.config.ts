import { defineConfig } from "vite";

function getBasePath() {
  const basePath = process.env.BASE_PATH?.trim();

  if (!basePath || basePath === "/") {
    return "/";
  }

  return basePath.endsWith("/") ? basePath : `${basePath}/`;
}

export default defineConfig({
  base: getBasePath(),
});

