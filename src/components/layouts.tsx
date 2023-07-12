import { PropsWithChildren, useEffect } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  useEffect(() => {
    document.title = "Byte-Size-Tech";
  }, []);

  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full overflow-y-scroll lg:max-w-4xl">
        {props.children}
      </div>
    </main>
  );
};
