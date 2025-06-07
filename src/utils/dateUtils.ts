
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate les dates de début et fin d'une partie
 * Si la partie dure plusieurs jours, affiche "date début - date fin"
 * Sinon, affiche seulement la date de début
 */
export const formatGameDateRange = (startDate: string, startTime?: string, endTime?: string): string => {
  const start = new Date(startDate);
  
  // Calculer la date de fin
  let endDate = new Date(startDate);
  
  if (startTime && endTime) {
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${startDate}T${endTime}:00`);
    
    // Si l'heure de fin est antérieure à l'heure de début, la partie se termine le jour suivant
    if (endDateTime < startDateTime) {
      endDate.setDate(endDate.getDate() + 1);
    }
  }
  
  // Vérifier si la partie dure plusieurs jours
  const startDateOnly = format(start, 'yyyy-MM-dd');
  const endDateOnly = format(endDate, 'yyyy-MM-dd');
  
  if (startDateOnly === endDateOnly) {
    // Partie sur un seul jour
    return format(start, 'dd MMMM yyyy', { locale: fr });
  } else {
    // Partie sur plusieurs jours
    const formattedStart = format(start, 'dd MMMM', { locale: fr });
    const formattedEnd = format(endDate, 'dd MMMM yyyy', { locale: fr });
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
