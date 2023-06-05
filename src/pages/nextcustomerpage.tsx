import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../lib/autocomplete"),
  {
    ssr: false,
  }
);

export default () => <DynamicComponentWithNoSSR />;
