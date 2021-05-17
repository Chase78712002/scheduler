import { useState } from "react";

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (!replace) {
      setHistory((prev) => [...prev, newMode]);
    }
    setHistory(prev => [...prev.slice(0,-1), newMode])
    setMode(newMode);
  };
  const back = () => {
    if (history.length >  1) {
      setHistory((prev) => {
        const reversedHistory = [...prev].slice(0, -1);
        const previousMode = reversedHistory.slice(-1)[0];
        // console.log("reversedHistory: ", reversedHistory);
        // console.log("previousMode: ", previousMode);
        setMode(previousMode);
        return reversedHistory;
      });
    }
  };

  return { mode, transition, back };
};

export default useVisualMode;
