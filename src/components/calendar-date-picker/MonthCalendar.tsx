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
  isVisible: boolean;       // Whether this range has any days in current month (for visual ring)
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
  // Now includes both current month and non-current month days for functionality
  const tripRanges = useMemo(() => {
    const ranges: TripRangeInfo[] = [];
    
    weeks.forEach((week, weekIdx) => {
      let currentTrip: TripWeek | null = null;
      let currentStart = 0;
      let hasVisibleDay = false;  // Track if any day in range is in current month
      
      const flushRange = (endIdx: number) => {
        if (currentTrip && endIdx >= currentStart) {
          // Check clipping based on whether the start/end are actual trip boundaries
          const startDay = week[currentStart];
          const endDay = week[endIdx];
          const isStartClipped = startDay ? !startDay.isTripStart : false;
          const isEndClipped = endDay ? !endDay.isTripEnd : false;
          
          ranges.push({
            trip: currentTrip,
            startIndex: currentStart,
            endIndex: endIdx,
            weekIndex: weekIdx,
            isStartClipped,
            isEndClipped,
            isVisible: hasVisibleDay,
          });
        }
      };
      
      week.forEach((day, dayIdx) => {
        if (day.tripWeek) {
          // This day is part of a trip (regardless of month)
          if (!currentTrip || currentTrip.id !== day.tripWeek.id) {
            // Flush previous range
            flushRange(dayIdx - 1);
            // Start new range
            currentTrip = day.tripWeek;
            currentStart = dayIdx;
            hasVisibleDay = day.isCurrentMonth;
          } else {
            // Continue current range
            if (day.isCurrentMonth) {
              hasVisibleDay = true;
            }
          }
        } else {
          // This day is NOT in a trip
          // Flush current range if we were building one
          if (currentTrip) {
            flushRange(dayIdx - 1);
            currentTrip = null;
            hasVisibleDay = false;
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
              {/* Trip range overlays - functional for all, visual only for visible ranges */}
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
                        "absolute h-7 top-0.5 z-20 flex items-center justify-center",
                        "transition-all duration-200 cursor-pointer",
                        
                        // Visual ring ONLY for ranges with visible days (current month)
                        // Invisible but functional for non-visible ranges
                        isDisabled 
                          ? "cursor-not-allowed" 
                          : range.isVisible && isSelected
                            ? "ring-2 ring-blue-500/70"
                            : range.isVisible && isHovered
                              ? "ring-2 ring-blue-300/70"
                              : range.isVisible
                                ? "hover:ring-2 hover:ring-blue-300/50"
                                : "", // No visual ring for non-visible ranges, but still clickable
                        
                        // Rounded corners - only on non-clipped sides AND only for visible ranges
                        range.isVisible && !range.isStartClipped && "rounded-l-md",
                        range.isVisible && !range.isEndClipped && "rounded-r-md",
                        
                        // Clipped side styling: no rounding
                        range.isVisible && range.isStartClipped && "rounded-l-none",
                        range.isVisible && range.isEndClipped && "rounded-r-none"
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
                
                // Determine background style based on trip and month
                let bgStyle: React.CSSProperties = {};
                let bgClass = "";
                
                if (hasTrip && !isDisabled) {
                  if (day.isCurrentMonth) {
                    // Current month trip days: solid green
                    bgClass = "bg-mint/60";
                  } else {
                    // Other month trip days: striped pattern
                    bgStyle = {
                      background: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 3px,
                        rgba(227, 255, 228, 0.5) 3px,
                        rgba(227, 255, 228, 0.5) 6px
                      )`
                    };
                  }
                } else if (hasTrip && isDisabled) {
                  bgClass = "bg-gray-100/80";
                }
                
                return (
                  <div
                    key={dayIdx}
                    style={bgStyle}
                    className={cn(
                      "relative h-8 flex items-center justify-center text-sm pointer-events-none select-none",
                      bgClass,
                      
                      // TEXT COLORS
                      // Days not in current month: light grey text
                      !day.isCurrentMonth && "text-charcoal/25",
                      // Days in current month with no trip: normal text
                      day.isCurrentMonth && !hasTrip && "text-charcoal/70",
                      // Days in current month WITH trip: bold text
                      day.isCurrentMonth && hasTrip && !isDisabled && "font-semibold text-charcoal",
                      // Selected state: blue text (only for current month)
                      day.isCurrentMonth && isSelected && "text-blue-600",
                      // Hovered state: blue text (only for current month)
                      day.isCurrentMonth && isHovered && "text-blue-500",
                      // Disabled state: gray text
                      isDisabled && "text-gray-400",
                      // Weekend styling (only for non-trip days in current month)
                      isWeekend && !hasTrip && day.isCurrentMonth && "text-charcoal/30",
                      
                      // Rounded corners for trip day cells at the edges (only current month)
                      day.isCurrentMonth && hasTrip && !isDisabled && day.isTripStart && "rounded-l-md",
                      day.isCurrentMonth && hasTrip && !isDisabled && day.isTripEnd && "rounded-r-md"
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
