import React from "react";
import { twMerge } from "tailwind-merge";

interface TitleProps
  extends Pick<React.HTMLAttributes<HTMLElement>, "className"> {
  text: string;
}

function Title({ text, className }: TitleProps) {
  return (
    <h1
      className={twMerge(
        "font-title text-primary text-2xl text-start",
        className
      )}
    >
      {text}
    </h1>
  );
}

export default Title;
