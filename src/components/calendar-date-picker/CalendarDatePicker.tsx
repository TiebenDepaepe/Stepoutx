import { useCallback, useState } from 'react';
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
        
        <div className="flex flex-col gap-1 text-[11px] bg-lavender/35 border border-purple-accent/10 px-3 py-2 rounded-xl text-charcoal/80">
          <span className="font-semibold text-purple-accent">Open datums:</span>
          <div>• 10 - 15 augustus <span className="text-amber-600 font-bold">(last minute plek)</span></div>
          <div>• 17 - 22 augustus <span className="text-amber-600 font-bold">(last minute plek)</span></div>
          <div>• 24 - 29 augustus <span className="text-purple-accent font-bold">(1 plek)</span></div>
          <div>• 31 augustus - 5 september</div>
          <div>• 7 - 12 september</div>
          <div>• 14 - 19 september</div>
          <div>• 21 - 26 september</div>
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
