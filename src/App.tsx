import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import mob from "@/assets/Mob.png";
import tree from "@/assets/Tree.jpg";
import Dashboard from "@/assets/dashboard-svgrepo-com.svg";

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <div className="underline font-bold text-3xl">What's up doggy dawg</div>
      <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link>
      <div className="counterWrapper">
        <span>Here's your fucking counter: {counter}</span>
        <button
          onClick={() => {
            throw new Error();
          }}
        >
          +
        </button>
        <button onClick={() => setCounter(counter - 1)}>-</button>
      </div>
      <img src={mob} alt="mob" width={200} height={200} />
      <img src={tree} alt="mob" width={200} height={200} />
      <Dashboard color="grey" fill="grey" width={50} height={50} />
      <Outlet />
    </div>
  );
};

export default App;
