import webpack from "webpack";

import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { IBuildOptions } from "./types/types";

export const buildWebpack = (options: IBuildOptions): webpack.Configuration => {
  const { mode, paths } = options;
  const isDev = mode === "dev";

  return {
    mode: options.mode ?? "dev",
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: "[name].[contenthash].js",
      clean: true,
    },
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    devtool: isDev ? "eval-source-map" : "source-map",
    devServer: isDev ? buildDevServer(options) : undefined,
  };
};
