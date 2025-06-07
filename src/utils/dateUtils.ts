
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate les dates de début et fin d'une partie
 * Si la partie dure plusieurs jours, affiche "date début - date fin"
 * Sinon, affiche seulement la date de début
 */
export const formatGameDateRange = (startDate: string, endTime: string): string => {
  const start = new Date(startDate);
  
  // Calculer la date de fin en utilisant la date de début et l'heure de fin
  const endDateTime = new Date(startDate);
  const [endHours, endMinutes] = endTime.split(':');
  endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
  
  // Si l'heure de fin est antérieure à l'heure de début, la partie se termine le jour suivant
  const startDateTime = new Date(startDate);
  const [startHours, startMinutes] = startDate.includes('T') 
    ? startDate.split('T')[1].split(':')
    : ['00', '00'];
  startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
  
  if (endDateTime < startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }
  
  // Vérifier si la partie dure plusieurs jours
  const startDateOnly = format(start, 'yyyy-MM-dd');
  const endDateOnly = format(endDateTime, 'yyyy-MM-dd');
  
  if (startDateOnly === endDateOnly) {
    // Partie sur un seul jour
    return format(start, 'dd MMMM yyyy', { locale: fr });
  } else {
    // Partie sur plusieurs jours
    const formattedStart = format(start, 'dd MMMM', { locale: fr });
    const formattedEnd = format(endDateTime, 'dd MMMM yyyy', { locale: fr });
    return `${formattedStart} - ${formattedEnd}`;
  }
};

/**
 * Formate le temps en utilisant start_time et end_time
 */
export const formatGameTimeRange = (startTime: string, endTime: string): string => {
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};
