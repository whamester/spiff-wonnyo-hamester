import React, { useState, useEffect } from "react";
import "./ProgressBarSolution.scss";

const ProgressBarSolution = () => {
  const totalRequestTime = 20;

  const [seconds, setSeconds] = useState(0);
  const [intervalID, setIntervalId] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [allowCancel, setAllowCancel] = useState(false);

  useEffect(() => {
    setIsRunning(seconds > 0);
  }, [seconds]);

  const docStyle = document.documentElement.style;

  const reset = () => {
    docStyle.removeProperty("--minWidth");
    docStyle.removeProperty("--seconds");
    docStyle.removeProperty("--maxWidth");
    setSeconds(0);
  };
  return (
    <div>
      {/* START REQUEST BUTTON */}
      <button
        disabled={isRunning}
        className="btn"
        onClick={() => {
          // Set the initial state
          reset();

          // Display Finish request button
          setAllowCancel(true);

          // Set up the default time duration for the request
          // In this case we want it to be a little over 15 s
          docStyle.setProperty("--seconds", `${totalRequestTime}s`);

          // Setting the interval for each second passed
          // this will allow us to manage the time duration of the request
          // and its effects on the UI
          const interval = setInterval(function () {
            setSeconds((seconds) => seconds + 1);
          }, 1000);
          setIntervalId(interval);

          //After the expected request time passes, we want to clear the interval
          //For a rear request we could handle a message or retry the request.
          setTimeout(() => {
            clearInterval(interval);
          }, totalRequestTime * 1000);
        }}
      >
        {allowCancel ? `Loading... ${seconds}` : "Start Request"}
      </button>

      {/* FINISH REQUEST BUTTON */}
      {allowCancel ? (
        <button
          className="btn cancel"
          onClick={() => {
            setAllowCancel(false);
            clearInterval(intervalID);

            const innerBar = getComputedStyle(
              document.getElementById("progress-bar-child")
            );
            const innerBarWidth = innerBar.getPropertyValue("width");

            docStyle.setProperty("--minWidth", `${innerBarWidth}px`);
            docStyle.setProperty("--seconds", "1s");
            docStyle.setProperty("--maxWidth", "0%");

            setTimeout(reset, 3000);
          }}
        >
          Finish Request
        </button>
      ) : null}

      {/* PROGRESS BAR */}
      <div
        id="progress-bar-container"
        className={`progress-bar-container ${seconds === 0 ? "hidden" : ""}`}
      >
        <div className="progress-bar-child progress"></div>
        <div
          id="progress-bar-child"
          className={`progress-bar-child shrinker ${
            isRunning ? "timelapse" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBarSolution;
