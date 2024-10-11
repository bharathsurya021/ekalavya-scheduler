import { useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const useTransformEvents = (events) => {
  return useMemo(() => {
    return events.map((event) => {
      const startDate = dayjs.utc(event.startDate);
      const endDate = dayjs.utc(event.endDate);
      return {
        id: event._id,
        collection_id: event.collection_id,
        year: startDate.year(),
        month: startDate.month() + 1,
        day: startDate.date(),
        startDate,
        endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        alloted_devices: event.alloted_devices,
      };
    });
  }, [events]);
};

export default useTransformEvents;
