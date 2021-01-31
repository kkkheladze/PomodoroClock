function App() {
  const [displayTime, setDisplayTime] = React.useState(1500);
  const [breakTime, setBreakTime] = React.useState(300);
  const [sessionTime, setSessionTime] = React.useState(1500);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio(
      "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    )
  );
  console.log(formatTime(displayTime));
  function playBreakSound() {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }
  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }
  function changeTime(amount, type) {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      } else if (sessionTime > 60 * 59 && amount > 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  }
  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };
  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };
  return (
    <div className="text-center stuff">
      <button className="btn" id="break-increment"></button>
      <button className="btn" id="session-increment"></button>
      <h1>PomodoroClock</h1>
      <div className="dual-container text-center justify-content-center">
        {/*break well*/}
        <div>
          <h3 id="break-label">Break Length</h3>
          <div className="time-sets">
            <button
              id="break-decrement"
              className="btn btn-primary"
              onClick={() => changeTime(-60, "break")}
            >
              <i class="fas fa-sort-down"></i>
            </button>
            <h3 id="break-length">{formatTime(breakTime)}</h3>
            <button
              id="session-decrement"
              className="btn btn-primary"
              onClick={() => changeTime(+60, "break")}
            >
              <i class="fas fa-sort-up"></i>
            </button>
          </div>
        </div>

        {/*session well*/}
        <div>
          <h3 id="session-label">Session Length</h3>
          <div className="time-sets">
            <button
              className="btn btn-primary"
              onClick={() => changeTime(-60, "session")}
            >
              <i class="fas fa-sort-down"></i>
            </button>
            <h3 id="session-length">{formatTime(sessionTime)}</h3>
            <button
              className="btn btn-primary"
              onClick={() => changeTime(+60, "session")}
            >
              <i class="fas fa-sort-up"></i>
            </button>
          </div>
        </div>
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <button id="start_stop" className="btn btn-primary" onClick={controlTime}>
        {timerOn ? (
          <i className="fas fa-pause"></i>
        ) : (
          <i className="fas fa-play"></i>
        )}
      </button>
      <button id="reset" className="btn btn-primary" onClick={resetTime}>
        <i className="fas fa-sync-alt"></i>
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
