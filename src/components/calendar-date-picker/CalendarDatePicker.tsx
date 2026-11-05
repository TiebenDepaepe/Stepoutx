import { useCallback, useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';
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
  const { months, getDaysForMonth, weekDays } = useCalendarDates(2027);
  const [hoveredTripId, setHoveredTripId] = useState<string | null>(null);

  const handleSelectTrip = useCallback((tripId: string) => {
    if (selectedDates.includes(tripId)) {
      onChange(selectedDates.filter(id => id !== tripId));
    } else {
      onChange([...selectedDates, tripId]);
    }
  }, [selectedDates, onChange]);

  const handleTripHover = useCallback((tripId: string | null) => {
    setHoveredTripId(tripId);
  }, []);

  return (
    <div className="w-full">
      {/* Alert banner for Italy trips */}
      <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs sm:text-sm font-medium">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span><strong>Let op:</strong> Italië reizen vertrekken 1 dag vroeger.</span>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-charcoal/60 mb-4">
        Klik op alle weken waarin je beschikbaar bent.
      </p>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-xs">
        <div className="flex flex-wrap items-center gap-4">
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
        
        <div className="flex flex-col gap-1 text-[11px] bg-lavender/35 border border-purple-accent/15 px-3.5 py-2 rounded-xl text-charcoal/80">
          <span className="font-semibold text-purple-accent">Beschikbare datums:</span>
          <div>• 1 - 6 februari <span className="text-emerald-600 font-bold">(Open)</span></div>
          <div>• 29 maart - 3 april <span className="text-emerald-600 font-bold">(Open)</span></div>
          <div>• 5 - 10 april <span className="text-emerald-600 font-bold">(Open)</span></div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {months.map(({ month, name, year }) => (
          <MonthCalendar
            key={`${year}-${month}`}
            month={month}
            year={year}
            monthName={name}
            days={getDaysForMonth(month, year)}
            selectedTrips={selectedDates}
            onSelectTrip={handleSelectTrip}
            onTripHover={handleTripHover}
            hoveredTripId={hoveredTripId}
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
