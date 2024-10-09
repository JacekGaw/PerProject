import React from 'react'

interface DateFormattedProps {
    dateObj: Date,
    className?: string,
    label?: string,
    time?: boolean
}

const DateFormatted: React.FC<DateFormattedProps> = ({dateObj, className, label, time = true}) => {
    const newDate = new Date(dateObj);
    let formattedDate = `${newDate.toLocaleDateString()}`;
    if(time) {
        formattedDate = `${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()}`;
    }

    

    return (
        <p className={`text-xs font-[600] text-slate-400 ${className}`}>
        {label && label + " "}{formattedDate}
        </p>
    )
}

export default DateFormatted;