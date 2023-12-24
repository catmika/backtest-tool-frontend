import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

import { IBuildOptions } from "./types/types";

export const buildDevServer = (
  options: IBuildOptions
): DevServerConfiguration => {
  return {
    port: options.port ?? 3000,
    static: options.paths.public,
    open: true,
    //Works only for dev server. For example if host static with nginx we would need to proxy index.html
    historyApiFallback: true,
    compress: true,
    hot: true,
  };
};
