import { useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useCalendarDates } from './useCalendarDates';
import { MonthCalendar } from './MonthCalendar';

interface CalendarDatePickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
  error?: string | null;
}

export function CalendarDatePicker({ 
  selectedDates, 
  onChange,
  error 
}: CalendarDatePickerProps) {
  const { months, getDaysForMonth, weekDays } = useCalendarDates(2026);

  const handleSelectTrip = useCallback((tripId: string) => {
    if (selectedDates.includes(tripId)) {
      onChange(selectedDates.filter(id => id !== tripId));
    } else {
      onChange([...selectedDates, tripId]);
    }
  }, [selectedDates, onChange]);

  return (
    <div className="w-full">
      {/* Subtitle */}
      <p className="text-sm text-charcoal/60 mb-4">
        Selecteer alle weken waarin je beschikbaar bent.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-mint/60 border border-mint" />
          <span className="text-charcoal/70">Beschikbaar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-mint/60 ring-2 ring-blue-500" />
          <span className="text-charcoal/70">Geselecteerd</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300 flex items-center justify-center">
            <span className="text-[8px] text-gray-400">×</span>
          </div>
          <span className="text-charcoal/70">Vol</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {months.map(({ month, name, year }) => (
          <MonthCalendar
            key={`${year}-${month}`}
            month={month}
            year={year}
            monthName={name}
            days={getDaysForMonth(month, year)}
            selectedTrips={selectedDates}
            onSelectTrip={handleSelectTrip}
            weekDays={weekDays}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-500 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default CalendarDatePicker;
