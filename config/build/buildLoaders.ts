import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";

import { IBuildOptions } from "./types/types";

export const buildLoaders = (
  options: IBuildOptions
): ModuleOptions["rules"] => {
  const isDev = options.mode === "development";

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  };

  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: "@svgr/webpack",
        options: {
          icon: true,
          svgoConfig: {
            plugins: [
              { name: "convertColors", params: { currentColor: true } },
            ],
          },
        },
      },
    ],
  };

  const cssLoader = {
    test: /\.css$/i,
    use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
  };

  // const tsLoader = {
  //   //ts-loader can work with tsx. If we used JS we would need babel-loader and it's configuration
  //   test: /\.tsx?$/,
  //   use: "ts-loader",
  //   exclude: /node_modules/,
  // };

  const tsLoader = {
    //   //ts-loader can work with tsx. If we used JS we would need babel-loader and it's configuration
    test: /\.tsx?$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
          }),
          transpileOnly: isDev,
        },
      },
    ],
    exclude: /node_modules/,
  };

  return [
    //ORDER IS IMPORTANT
    svgLoader,
    assetLoader,
    cssLoader,
    tsLoader,
  ];
};
