import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";

const Avatar: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        local.class
      )}
      {...others}
    />
  );
};

const AvatarImage: Component<ComponentProps<"img">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <img
      class={cn("aspect-square h-full w-full", local.class)}
      {...others}
    />
  );
};

const AvatarFallback: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        local.class
      )}
      {...others}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
