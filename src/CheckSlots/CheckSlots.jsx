import React, { useState } from "react";
import music from "../audio/Scott-McKenzie-San-Francisco.mp3";

const CheckSlots = () => {
  const [availableSlots, setAvailableSlots] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const [started, setStarted] = useState(false);
  const [timeInterval, setTimeInterval] = useState(30000); // Default to 30 seconds

  const apiUrl =
    "https://schedule.setmore.com/api/v1/slots/8688dc13-c222-4065-bfff-016615800ac2/id5bfXiM2Sdw4rA2NKbgtoSF5a0WFY27/15/0/29/0";

  const getFirstDaysOfNextFourMonths = () => {
    const dates = [];
    const currentDate = new Date();
    for (let i = 0; i < 5; i++) {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      const formattedDate = `${String(firstDayOfMonth.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(firstDayOfMonth.getDate()).padStart(
        2,
        "0"
      )}/${firstDayOfMonth.getFullYear()}`;
      dates.push(formattedDate);
    }
    return dates;
  };

  const startChecking = () => {
    setStarted(true);
    const dates = getFirstDaysOfNextFourMonths();
    setAvailableSlots(
      dates.reduce((acc, date) => ({ ...acc, [date]: "In progress" }), {})
    );

    const id = setInterval(() => {
      let foundSlots = false;

      dates.forEach((date) => {
        if (foundSlots) return;

        const queryParams = new URLSearchParams({
          timezone: "America/Los_Angeles",
          date,
          timeFormat: "HH:mm",
        });

        fetch(`${apiUrl}?${queryParams}`)
          .then((response) => response.json())
          .then((data) => {
            const slots = data.data.slots;
            const hasAvailableSlots = Object.values(slots).some(
              (slotArray) => slotArray.length > 0
            );
            if (hasAvailableSlots) {
              setAvailableSlots((prevSlots) => ({
                ...prevSlots,
                [date]: "Slots found",
              }));
              foundSlots = true;
              clearInterval(id);
              setStarted(false);
              setIntervalId(null);
              playSound();
            } else {
              setAvailableSlots((prevSlots) => ({
                ...prevSlots,
                [date]: "No slots",
              }));
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setAvailableSlots((prevSlots) => ({
              ...prevSlots,
              [date]: "Error",
            }));
          });
      });

      if (foundSlots) {
        clearInterval(id);
        setStarted(false);
        setIntervalId(null);
      }
    }, timeInterval);
    setIntervalId(id);
  };

  const stopChecking = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setStarted(false);
    setIntervalId(null);
  };

  const playSound = () => {
    const audio = new Audio(music);
    audio.play();
  };

  return (
    <div>
      <div>
        <label>
          Enter time interval (in milliseconds):
          <input
            type="number"
            value={timeInterval}
            onChange={(e) => setTimeInterval(Number(e.target.value))}
          />
        </label>
      </div>
      {started ? (
        <button onClick={stopChecking}>Stop</button>
      ) : (
        <button onClick={startChecking}>Start</button>
      )}
      <ul>
        {Object.entries(availableSlots).map(([date, status]) => (
          <li key={date}>
            {date}: {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { CheckSlots };
