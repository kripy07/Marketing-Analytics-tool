import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface FilterPanelProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function FilterPanel({
  dateRange,
  setDateRange,
  selectedStatus,
  setSelectedStatus,
  selectedChannel,
  setSelectedChannel,
  onClearFilters,
  activeFiltersCount
}: FilterPanelProps) {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} active
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Campaign Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Channel Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Marketing Channel</label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="search">Search Ads</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Today", days: 0 },
              { label: "Last 7 days", days: 7 },
              { label: "Last 30 days", days: 30 },
              { label: "Last 90 days", days: 90 },
              { label: "This Year", days: 365 }
            ].map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const from = new Date(today);
                  from.setDate(today.getDate() - filter.days);
                  setDateRange({ from, to: today });
                }}
                className="h-8"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}