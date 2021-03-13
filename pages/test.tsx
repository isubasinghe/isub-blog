import React, { useReducer } from "react";
import dynamic from "next/dynamic";

const BerkeleyClockSync = dynamic(
  () => import("../components/clock/berkeley"),
  { loading: () => <p>...</p> }
);

const Gossip = dynamic(() => import("../components/gossip"), {
  loading: () => <p>...</p>,
});

const VClockMan = dynamic(() => import("../components/vclock"), {
  loading: () => <p>...</p>,
});

const Test = () => {
  return (
    <>
      <VClockMan />
    </>
  );
};

export default Test;
