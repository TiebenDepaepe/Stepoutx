import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  getDate,
} from 'date-fns';

export interface TripWeek {
  id: string;
  startDate: Date;
  endDate: Date;
  label: string;
  disabled: boolean;
  full: boolean;
  month: number; // 5 = June, 6 = July, 7 = August
  year: number;
}

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  tripWeek?: TripWeek;
  isTripStart: boolean;
  isTripEnd: boolean;
  isInTripRange: boolean;
}

// Parse the available dates from the form
const rawTripData = [
  { date: '22 juni - 27 juni', disabled: false, full: false },
  { date: '29 juni - 4 juli', disabled: false, full: false },
  { date: '6 juli - 11 juli', disabled: false, full: false },
  { date: '13 juli - 18 juli', disabled: false, full: false },
  { date: '20 juli - 25 juli', disabled: false, full: false },
  { date: '27 juli - 1 augustus', disabled: false, full: false },
  { date: '3 - 8 augustus', disabled: false, full: false },
  { date: '10 - 15 augustus', disabled: false, full: false },
  { date: '17 - 22 augustus', disabled: false, full: false },
  { date: '24 - 29 augustus', disabled: false, full: false },
  { date: '31 augustus - 5 september', disabled: false, full: false },
  { date: '7 - 12 september', disabled: false, full: false },
  { date: '14 - 19 september', disabled: false, full: false },
  { date: '21 - 26 september', disabled: false, full: false },
  { date: '28 september - 3 oktober', disabled: false, full: false },
];

// Helper to parse Dutch month names
function parseDutchDate(dateStr: string, year: number): Date {
  const months: Record<string, number> = {
    'januari': 0, 'februari': 1, 'maart': 2, 'april': 3, 'mei': 4, 'juni': 5,
    'juli': 6, 'augustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = dateStr.trim().split(' ');
  const day = parseInt(parts[0], 10);
  const month = months[parts[1].toLowerCase()] || 0;
  
  return new Date(year, month, day);
}

function parseTripWeek(trip: typeof rawTripData[0], year: number): TripWeek {
  const parts = trip.date.split(' - ');
  
  // Handle single-month format (e.g., "22 juni - 27 juni")
  // Handle cross-month format (e.g., "29 juni - 4 juli")
  // Handle simplified format (e.g., "3 - 8 augustus")
  
  let startStr: string;
  let endStr: string;
  
  if (parts[0].includes(' ')) {
    // Full format: "22 juni"
    startStr = parts[0];
  } else {
    // Short format: "3" - need to extract month from end
    const endParts = parts[1].split(' ');
    startStr = `${parts[0]} ${endParts.slice(1).join(' ')}`;
  }
  
  if (parts[1].includes(' ')) {
    // Full format: "27 juni" or "4 juli"
    endStr = parts[1];
  } else {
    // Short format - need month from context
    const startParts = startStr.split(' ');
    endStr = `${parts[1]} ${startParts.slice(1).join(' ')}`;
  }
  
  const startDate = parseDutchDate(startStr, year);
  const endDate = parseDutchDate(endStr, year);
  
  // Adjust year for end date if it's in next year (not needed for summer trips)
  if (endDate < startDate) {
    endDate.setFullYear(year + 1);
  }
  
  return {
    id: trip.date,
    startDate,
    endDate,
    label: trip.date,
    disabled: trip.disabled,
    full: trip.full,
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  };
}

export function useCalendarDates(selectedYear: number = 2026) {
  const tripWeeks = useMemo(() => {
    return rawTripData.map(trip => parseTripWeek(trip, selectedYear));
  }, [selectedYear]);

  const months = useMemo(() => [
    { month: 5, name: 'Juni', year: selectedYear },
    { month: 6, name: 'Juli', year: selectedYear },
    { month: 7, name: 'Augustus', year: selectedYear },
    { month: 8, name: 'September', year: selectedYear },
    { month: 9, name: 'Oktober', year: selectedYear },
  ], [selectedYear]);

  const getDaysForMonth = (month: number, year: number): CalendarDay[] => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);
    
    // Get full weeks including days from prev/next months
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return allDays.map(date => {
      const dayOfMonth = getDate(date);
      const isCurrentMonth = isSameMonth(date, monthStart);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      
      // Find if this day is part of any trip week
      const tripWeek = tripWeeks.find(tw => {
        const start = new Date(tw.startDate);
        const end = new Date(tw.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate >= start && checkDate <= end;
      });
      
      const isTripStart = tripWeek ? isSameDay(date, tripWeek.startDate) : false;
      const isTripEnd = tripWeek ? isSameDay(date, tripWeek.endDate) : false;
      const isInTripRange = !!tripWeek;
      
      return {
        date,
        dayOfMonth,
        isCurrentMonth,
        isWeekend,
        tripWeek,
        isTripStart,
        isTripEnd,
        isInTripRange,
      };
    });
  };

  const getTripByDate = (date: Date): TripWeek | undefined => {
    return tripWeeks.find(tw => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const start = new Date(tw.startDate);
      const end = new Date(tw.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  return {
    tripWeeks,
    months,
    getDaysForMonth,
    getTripByDate,
    weekDays,
  };
}

export type { TripWeek as TripWeekType };
