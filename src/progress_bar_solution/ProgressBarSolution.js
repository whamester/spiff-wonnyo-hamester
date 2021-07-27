import React, { useState, useEffect } from "react";
import "./ProgressBarSolution.scss";

const ProgressBarSolution = () => {
  const defaultHoldTime = 15; //Defining the time for the progress to hold until request finishes
  const docStyle = document.documentElement.style;

  // In case the breakpoint comes from another source, insted of just true/false flag
  // Each number corresponds to the percentage that will slow down the progress
  const breakpoints = [5, 20, 50, 70];

  const [seconds, setSeconds] = useState(0); // Traking request time
  const [intervalID, setIntervalId] = useState(); // Id of the mocked request interval
  const [allowCancel, setAllowCancel] = useState(false); // Display the Finish request button
  const [withBreakpoints, setWithBreakpoints] = useState(false);

  const getProperty = (id, property) => {
    if (!id || !property) {
      return;
    }
    return getComputedStyle(document.getElementById(id))?.getPropertyValue(
      property
    );
  };

  useEffect(() => {
    if (seconds === 0 || !withBreakpoints) {
      return;
    }

    const containerWidth = getProperty(
      "progress-bar-container",
      "width"
    )?.replaceAll("px", "");
    const childWidth = getProperty("progress-bar-child", "width")?.replaceAll(
      "px",
      ""
    );
    const currentPercentage = Math.round((childWidth / containerWidth) * 100);
    const itemFound = breakpoints.find((value) => {
      return (
        currentPercentage > 0 &&
        currentPercentage <= value * 1.1 &&
        currentPercentage >= value - value * 0.1
      );
    });

    if (itemFound) {
      docStyle.setProperty("--minWidth", `${childWidth}px`);
      docStyle.setProperty("--seconds", `${defaultHoldTime * 1.5}s`);
      setTimeout(
        () => docStyle.setProperty("--seconds", `${defaultHoldTime}s`),
        1500
      );
    }
  }, [seconds, withBreakpoints]);

  const reset = () => {
    docStyle.removeProperty("--minWidth");
    docStyle.removeProperty("--seconds");
    docStyle.removeProperty("--maxWidth");
    setSeconds(0);
  };

  const onStartRequest = () => {
    // Set the initial state
    reset();

    // Display Finish request button
    setAllowCancel(true);

    // Set up the default time duration for the request
    // In this case we want it to be a little over 15 s
    docStyle.setProperty("--seconds", `${defaultHoldTime}s`);

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
    }, defaultHoldTime * 1000);
  };

  const onFinishRequest = () => {
    // Hide the cancel button
    setAllowCancel(false);
    // Clear the interval of the mocked request
    clearInterval(intervalID);

    const innerBarWidth = getProperty("progress-bar-child", "width");
    // Setting the progress bar variables according to the current state
    docStyle.setProperty("--minWidth", `${innerBarWidth}`);
    docStyle.setProperty("--seconds", "1s");
    docStyle.setProperty("--maxWidth", "100%");

    // Reset after 3 seconds
    // Setting the seconds to 0 will remove the progress bar from the screen
    setTimeout(reset, 3000);
  };

  return (
    <div>
      {/* START REQUEST BUTTON */}
      <button disabled={seconds > 0} className="btn" onClick={onStartRequest}>
        {allowCancel ? "Loading..." : "Start Request"}
      </button>

      {/* FINISH REQUEST BUTTON */}
      {allowCancel ? (
        <button className="btn cancel" onClick={onFinishRequest}>
          Finish Request
        </button>
      ) : null}

      {/* SWITCH TO ENABLE BREAKPOINTS */}
      <div className="switch-container" disabled={seconds > 0}>
        <label className="switch">
          <input
            type="checkbox"
            checked={withBreakpoints}
            onChange={({ target }) => {
              setWithBreakpoints(target.checked);
            }}
          />
          <span className="slider round"> </span>
        </label>
        <span className="switch-text small-label">Active breakpoints</span>
      </div>

      {/* PROGRESS BAR */}
      <div
        id="progress-bar-container"
        className={`progress-bar-container ${seconds === 0 ? "hidden" : ""}`}
      >
        <div
          id="progress-bar-child"
          className="progress-bar-child progress "
        ></div>
      </div>
    </div>
  );
};

export default ProgressBarSolution;
