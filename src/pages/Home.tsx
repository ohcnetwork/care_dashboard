import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      Hello Home
      <br />
      <Link className="underline" to={"/404"}>
        About
      </Link>
    </div>
  );
};
