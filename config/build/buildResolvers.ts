import { Configuration } from "webpack";

import { IBuildOptions } from "./types/types";

export const buildResolvers = (
  options: IBuildOptions
): Configuration["resolve"] => {
  return {
    alias: {
      "@": options.paths.src,
    },
    extensions: [".tsx", ".ts", ".js"],
  };
};
