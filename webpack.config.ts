import path from "path";
import webpack from "webpack";

import { buildWebpack } from "./config/build/buildWebpack";
import { BuildMode, IBuildPaths } from "./config/build/types/types";

interface IEnvVariables {
  mode: BuildMode;
  port: number;
  analyzer?: boolean;
}

export default (env: IEnvVariables) => {
  const paths: IBuildPaths = {
    output: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "src", "index.tsx"),
    html: path.resolve(__dirname, "public", "index.html"),
    public: path.resolve(__dirname, "public"),
    src: path.resolve(__dirname, "src"),
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer,
  });
  return config;
};
