import React, { useEffect, useState } from "react";
import music from "../audio/ZZ Top - Sharp Dressed Man.mp3";

const CheckSlots = () => {
  const [availableSlots, setAvailableSlots] = useState(false);

  const timeInterval = 10000;

  const apiUrl =
    "https://schedule.setmore.com/api/v1/slots/8688dc13-c222-4065-bfff-016615800ac2/id5bfXiM2Sdw4rA2NKbgtoSF5a0WFY27/15/0/29/0";
  const queryParams = new URLSearchParams({
    timezone: "America/Los_Angeles",
    date: "02/01/2024",
    timeFormat: "HH:mm",
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`${apiUrl}?${queryParams}`);
        const data = await response.json();
        checkSlots(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchSlots, timeInterval);
    return () => clearInterval(intervalId);
  }, []);

  const checkSlots = (data) => {
    const slots = data.data.slots;
    const hasAvailableSlots = Object.values(slots).some(
      (slotArray) => slotArray.length > 0
    );
    if (hasAvailableSlots) {
      setAvailableSlots(true);
      playSound();
    }
  };

  const playSound = () => {
    const audio = new Audio(music);
    audio.play();
  };

  return (
    <div>
      {availableSlots ? (
        <p>Available slots found!</p>
      ) : (
        <p>Checking for slots...</p>
      )}
    </div>
  );
};

export { CheckSlots };
