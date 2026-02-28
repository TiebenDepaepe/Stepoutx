import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarDay, TripWeek } from './useCalendarDates';

interface MonthCalendarProps {
  month: number;
  year: number;
  monthName: string;
  days: CalendarDay[];
  selectedTrips: string[];
  onSelectTrip: (tripId: string) => void;
  weekDays: string[];
}

interface TripRangeInfo {
  trip: TripWeek;
  startIndex: number;
  endIndex: number;
  weekIndex: number;
}

export function MonthCalendar({
  monthName,
  year,
  days,
  selectedTrips,
  onSelectTrip,
  weekDays,
}: MonthCalendarProps) {
  // Group days into weeks
  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  // Group consecutive trip days into visual ranges
  const tripRanges = useMemo(() => {
    const ranges: TripRangeInfo[] = [];
    
    weeks.forEach((week, weekIdx) => {
      let currentTrip: TripWeek | null = null;
      let currentStart = 0;
      
      const flushRange = (endIdx: number) => {
        if (currentTrip) {
          const alreadyAdded = ranges.some(r => r.trip.id === currentTrip!.id && r.weekIndex === weekIdx);
          if (!alreadyAdded) {
            ranges.push({
              trip: currentTrip,
              startIndex: currentStart,
              endIndex: endIdx,
              weekIndex: weekIdx,
            });
          }
        }
      };
      
      week.forEach((day, dayIdx) => {
        if (day.tripWeek) {
          if (!currentTrip || currentTrip.id !== day.tripWeek.id) {
            // Flush previous range
            flushRange(dayIdx - 1);
            // Start new range
            currentTrip = day.tripWeek;
            currentStart = dayIdx;
          }
        } else {
          // Flush current range
          flushRange(dayIdx - 1);
          currentTrip = null;
        }
      });
      
      // Flush at end of week
      flushRange(6);
    });
    
    return ranges;
  }, [weeks]);

  const isTripSelected = (tripId: string) => selectedTrips.includes(tripId);

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Month Header */}
      <div className="bg-gradient-to-r from-lavender/50 to-mint/30 px-4 py-3 border-b border-charcoal/5">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-charcoal text-lg">
            {monthName} <span className="text-charcoal/50 font-medium text-base">{year}</span>
          </h4>
          <CalendarDays className="w-5 h-5 text-purple-accent/60" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={cn(
                "text-center text-xs font-medium py-1.5",
                idx >= 5 // Saturday and Sunday
                  ? "text-charcoal/40" 
                  : "text-charcoal/60"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="space-y-1 relative">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 relative">
              {/* Week container - handles click and hover for the entire trip week */}
              {tripRanges
                .filter(r => r.weekIndex === weekIdx)
                .map((range) => {
                  const isSelected = isTripSelected(range.trip.id);
                  const isDisabled = range.trip.disabled;
                  
                  const handleClick = (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (!isDisabled) {
                      onSelectTrip(range.trip.id);
                    }
                  };
                  
                  return (
                    <div
                      key={`${range.trip.id}-${weekIdx}`}
                      onClick={handleClick}
                      className={cn(
                        "absolute h-7 top-0.5 z-10 flex items-center justify-center",
                        "transition-all duration-200 rounded-md",
                        isDisabled 
                          ? "bg-gray-100/80 cursor-not-allowed" 
                          : isSelected
                            ? "bg-mint/60 ring-4 ring-blue-500 cursor-pointer"
                            : "bg-mint/60 hover:ring-2 hover:ring-blue-300 cursor-pointer",
                        range.startIndex === 0 && "rounded-l-lg",
                        range.endIndex === 6 && "rounded-r-lg"
                      )}
                      style={{
                        left: `${(range.startIndex / 7) * 100}%`,
                        width: `${((range.endIndex - range.startIndex + 1) / 7) * 100}%`,
                      }}
                      role="button"
                      aria-pressed={isSelected}
                      tabIndex={isDisabled ? -1 : 0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isDisabled) {
                            onSelectTrip(range.trip.id);
                          }
                        }
                      }}
                    />
                  );
                })}

              {/* Day cells - purely visual, no interaction */}
              {week.map((day, dayIdx) => {
                const hasTrip = !!day.tripWeek;
                const isSelected = day.tripWeek ? isTripSelected(day.tripWeek.id) : false;
                const isDisabled = day.tripWeek ? day.tripWeek.disabled : false;
                const isWeekend = dayIdx >= 5;
                
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "relative h-8 flex items-center justify-center text-sm pointer-events-none",
                      !day.isCurrentMonth && "text-charcoal/20",
                      day.isCurrentMonth && !hasTrip && "text-charcoal/70",
                      hasTrip && !isDisabled && "font-semibold",
                      isSelected && "text-blue-600",
                      hasTrip && !isSelected && !isDisabled && "text-charcoal",
                      isDisabled && "text-gray-400",
                      isWeekend && !hasTrip && day.isCurrentMonth && "text-charcoal/30"
                    )}
                  >
                    <span className={cn(
                      "relative z-10",
                      day.isTripStart && hasTrip && !isSelected && !isDisabled && "text-purple-accent",
                    )}>
                      {day.dayOfMonth}
                    </span>
                    
                    {/* Day indicator dot for trip start */}
                    {day.isTripStart && hasTrip && !isSelected && !isDisabled && (
                      <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-purple-accent" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonthCalendar;
