
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateFilterProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedDate,
  setSelectedDate
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Date
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
              !selectedDate && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: fr })
            ) : (
              <span>Choisir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            locale={fr}
            className="bg-gray-700 text-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
