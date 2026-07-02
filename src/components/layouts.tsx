import { PropsWithChildren, useEffect } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  useEffect(() => {
    document.title = "Byte-Size-Tech";
  }, []);

  return (
<<<<<<< HEAD
    <main className="flex min-h-screen justify-center overflow-x-hidden">
=======
    <main className="flex min-h-screen justify-center overflow-x-hidden overflow-y-auto">
>>>>>>> old-style-mobile
      <div className="w-full lg:max-w-4xl">{props.children}</div>
    </main>
  );
};
