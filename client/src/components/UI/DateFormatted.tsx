import React from "react";

interface DateFormattedProps {
  dateObj: Date | null;
  className?: string;
  label?: string;
  time?: boolean;
}

const DateFormatted: React.FC<DateFormattedProps> = ({
  dateObj,
  className,
  label,
  time = false,
}) => {
  let formattedDate;
  if (dateObj !== null) {
    const newDate = new Date(dateObj);
    formattedDate = `${newDate.toLocaleDateString()}`;
    if (time) {
      formattedDate = `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`;
    }
  }

  return (
    <p className={`${className} font-[600] text-slate-400 `}>
      {label && label + " "}
      {dateObj !== null ? formattedDate : "not set."}
    </p>
  );
};

export default DateFormatted;
