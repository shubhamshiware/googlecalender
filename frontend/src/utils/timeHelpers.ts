export const getHourFromMinutes = (minutes: number) => {
  return Math.floor(minutes / 60);
};

export const getMinutesFromHour = (hour: number) => {
  return hour * 60;
};

export const getTimeInMinutes = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes();
};

export const getEventPosition = (event: { start: Date; end: Date }, dayStart: Date) => {
  const eventMinutes = getTimeInMinutes(event.start);
  const dayMinutes = getTimeInMinutes(dayStart);
  const topPercent = ((eventMinutes - dayMinutes) / (24 * 60)) * 100;
  const heightPercent = ((event.end.getTime() - event.start.getTime()) / (24 * 60 * 60 * 1000)) * 100;
  
  return {
    top: `${Math.max(0, topPercent)}%`,
    height: `${Math.max(5, heightPercent)}%`,
  };
};

export const getEventDurationInMinutes = (start: Date, end: Date) => {
  return Math.round((end.getTime() - start.getTime()) / 60000);
};

export const getEventDurationText = (start: Date, end: Date) => {
  const minutes = getEventDurationInMinutes(start, end);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
