import React from "react";
import { AppImage } from "./AppImage";

export const Logo = ({ source, style = {}, args = {} }) => {
  return (
    <AppImage
      source={source}
      resizeMode="contain"
      style={{
        ...style,
        height: style.height || 100,
        width: style.width || 100,
      }}
      args={args}
    />
  );
};
