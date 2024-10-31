import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Test() {
  const notify = () => toast("Hello, World!");

  return (
    <div>
      <button onClick={notify}>Show Toast</button>
    </div>
  );
}

export default Test;
