
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate les dates de début et fin d'une partie
 * Si la partie dure plusieurs jours, affiche "date début - date fin"
 * Sinon, affiche seulement la date de début
 */
export const formatGameDateRange = (startDate: string, startTime?: string, endTime?: string, endDate?: string): string => {
  const start = new Date(startDate);
  
  // Calculer la date de fin
  let finalEndDate = new Date(endDate || startDate);
  
  // Si on n'a pas de end_date spécifique mais qu'on a les heures
  if (!endDate && startTime && endTime) {
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${startDate}T${endTime}:00`);
    
    // Si l'heure de fin est antérieure à l'heure de début, la partie se termine le jour suivant
    if (endDateTime < startDateTime) {
      finalEndDate.setDate(finalEndDate.getDate() + 1);
    }
  }
  
  // Vérifier si la partie dure plusieurs jours
  const startDateOnly = format(start, 'yyyy-MM-dd');
  const endDateOnly = format(finalEndDate, 'yyyy-MM-dd');
  
  if (startDateOnly === endDateOnly) {
    // Partie sur un seul jour
    return format(start, 'dd MMMM yyyy', { locale: fr });
  } else {
    // Partie sur plusieurs jours - afficher les deux dates complètes séparées par un tiret
    const formattedStart = format(start, 'dd MMMM yyyy', { locale: fr });
    const formattedEnd = format(finalEndDate, 'dd MMMM yyyy', { locale: fr });
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
