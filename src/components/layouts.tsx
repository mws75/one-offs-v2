import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
    <main className="flex h-full justify-center ">
      <div className="h-full w-full lg:max-w-4xl">{props.children}</div>
    </main>
  );
};
