import { useEffect, useState } from "react";

export default function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState("");

  // Hàm update thời gian
  const updateCurrentDate = () => {
    const currentDate = new Date();

    // Format định dạng
    const formattedDate = ` ${formatAMPM(
      currentDate
    )} ${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    // Update state theo format
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    updateCurrentDate();
    const intervalId = setInterval(updateCurrentDate, 60000);

    // cleanup function mỗi 1phut
    return () => clearInterval(intervalId);
  }, []);

  // Hàm format theo AM/PM
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour format to 12-hour format
    hours %= 12;
    hours = hours || 12;

    // Ensure minutes are always displayed with two digits
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  return { currentDate };
}
