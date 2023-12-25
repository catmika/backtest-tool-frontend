export type BuildMode = "prod" | "dev";

export interface IBuildPaths {
  entry: string;
  html: string;
  output: string;
  public: string;
  src: string;
}

export interface IBuildOptions {
  port: number;
  paths: IBuildPaths;
  mode: BuildMode;
  analyzer?: boolean;
}
