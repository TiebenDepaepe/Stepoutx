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
  onTripHover?: (tripId: string | null) => void;
  hoveredTripId?: string | null;
  weekDays: string[];
}

interface TripRangeInfo {
  trip: TripWeek;
  startIndex: number;
  endIndex: number;
  weekIndex: number;
  isStartClipped: boolean;  // Trip extends to previous month (not visible in current month)
  isEndClipped: boolean;    // Trip extends to next month (not visible in current month)
}

export function MonthCalendar({
  monthName,
  year,
  days,
  selectedTrips,
  onSelectTrip,
  onTripHover,
  hoveredTripId,
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

  // Group consecutive trip days into visual ranges WITHIN EACH WEEK
  // Clipping at month boundaries
  const tripRanges = useMemo(() => {
    const ranges: TripRangeInfo[] = [];
    
    weeks.forEach((week, weekIdx) => {
      let currentTrip: TripWeek | null = null;
      let currentStart = 0;
      let isCurrentStartClipped = false;
      
      const flushRange = (endIdx: number) => {
        if (currentTrip && endIdx >= currentStart) {
          // Check if end is clipped (the day at endIdx+1 would be in the trip but is not current month)
          // Actually: check if the day at endIdx is the last day of this trip that's in current month
          const endDay = week[endIdx];
          const isEndClipped = endDay ? !endDay.isTripEnd : false;
          
          ranges.push({
            trip: currentTrip,
            startIndex: currentStart,
            endIndex: endIdx,
            weekIndex: weekIdx,
            isStartClipped: isCurrentStartClipped,
            isEndClipped: isEndClipped,
          });
        }
      };
      
      week.forEach((day, dayIdx) => {
        if (day.tripWeek && day.isCurrentMonth) {
          // This day is part of a trip AND in current month
          if (!currentTrip || currentTrip.id !== day.tripWeek.id) {
            // Flush previous range
            flushRange(dayIdx - 1);
            // Start new range
            currentTrip = day.tripWeek;
            currentStart = dayIdx;
            // Check if start is clipped (this is not the actual trip start)
            isCurrentStartClipped = !day.isTripStart;
          }
        } else {
          // This day is either NOT in a trip OR not in current month
          // Flush current range if we were building one
          if (currentTrip) {
            flushRange(dayIdx - 1);
            currentTrip = null;
          }
        }
      });
      
      // Flush at end of week
      flushRange(6);
    });
    
    return ranges;
  }, [weeks]);

  const isTripSelected = (tripId: string) => selectedTrips.includes(tripId);
  const isTripHovered = (tripId: string) => hoveredTripId === tripId;

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
              {/* Week container - handles click and hover for the trip week */}
              {tripRanges
                .filter(r => r.weekIndex === weekIdx)
                .map((range) => {
                  const isSelected = isTripSelected(range.trip.id);
                  const isHovered = isTripHovered(range.trip.id);
                  const isDisabled = range.trip.disabled;
                  
                  const handleClick = (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (!isDisabled) {
                      onSelectTrip(range.trip.id);
                    }
                  };

                  const handleMouseEnter = () => {
                    if (!isDisabled && onTripHover) {
                      onTripHover(range.trip.id);
                    }
                  };

                  const handleMouseLeave = () => {
                    if (onTripHover) {
                      onTripHover(null);
                    }
                  };
                  
                  return (
                    <div
                      key={`${range.trip.id}-${weekIdx}`}
                      onClick={handleClick}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={cn(
                        "absolute h-7 top-0.5 z-10 flex items-center justify-center",
                        "transition-all duration-200 cursor-pointer",
                        isDisabled 
                          ? "bg-gray-100/80 cursor-not-allowed" 
                          : isSelected
                            ? "bg-mint/60 ring-2 ring-blue-500/70"
                            : isHovered
                              ? "bg-mint/60 ring-2 ring-blue-300/70"
                              : "bg-mint/60 hover:ring-2 hover:ring-blue-300/50",
                        
                        // Rounded corners - only on non-clipped sides
                        !range.isStartClipped && "rounded-l-md",
                        !range.isEndClipped && "rounded-r-md",
                        
                        // Clipped side styling: no rounding
                        range.isStartClipped && "rounded-l-none",
                        range.isEndClipped && "rounded-r-none"
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

              {/* Day cells - purely visual */}
              {week.map((day, dayIdx) => {
                const hasTrip = !!day.tripWeek;
                const isSelected = day.tripWeek ? isTripSelected(day.tripWeek.id) : false;
                const isHovered = day.tripWeek ? isTripHovered(day.tripWeek.id) : false;
                const isDisabled = day.tripWeek ? day.tripWeek.disabled : false;
                const isWeekend = dayIdx >= 5;
                
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "relative h-8 flex items-center justify-center text-sm pointer-events-none select-none",
                      // Days not in current month: light grey
                      !day.isCurrentMonth && "text-charcoal/25",
                      // Days in current month with no trip: normal
                      day.isCurrentMonth && !hasTrip && "text-charcoal/70",
                      // Days in current month WITH trip: bold
                      day.isCurrentMonth && hasTrip && !isDisabled && "font-semibold text-charcoal",
                      // Selected state
                      isSelected && "text-blue-600",
                      // Hovered state
                      isHovered && "text-blue-500",
                      // Disabled state
                      isDisabled && "text-gray-400",
                      // Weekend styling (only for non-trip days in current month)
                      isWeekend && !hasTrip && day.isCurrentMonth && "text-charcoal/30"
                    )}
                  >
                    <span className="relative z-10">
                      {day.dayOfMonth}
                    </span>
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
