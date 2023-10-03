import React from 'react';
import {
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  DragAndDrop,
  Resize,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from '@syncfusion/ej2-react-schedule';
import { scheduleData } from '../data/dummy';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
const Calendar = () => {
  return (
    <div>
      <ScheduleComponent
        height={'650px'}
        eventSettings={{ dataSource: scheduleData }}
      >
        <Inject
          services={[Day, Week, Month, WorkWeek, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};

export default Calendar;
