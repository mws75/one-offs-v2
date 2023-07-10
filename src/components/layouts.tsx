import { PropsWithChildren, useEffect } from "react";

export const PageLayout = (props: PropsWithChildren<{}>) => {
  useEffect(() => {
    document.title = "Byte-Size-Tech";
    const favicon = document.getElementById("favicon");
    favicon?.setAttribute("href", "../../public/pixel_shark_2.png");
  }, []);

  return (
    <main className="flex h-full justify-center ">
      <div className="h-full w-full lg:max-w-4xl">{props.children}</div>
    </main>
  );
};
