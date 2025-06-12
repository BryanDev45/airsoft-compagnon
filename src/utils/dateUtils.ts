
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate les dates de début et fin d'une partie
 * Si la partie dure plusieurs jours, affiche "date début - date fin"
 * Sinon, affiche seulement la date de début
 */
export const formatGameDateRange = (startDate: string, startTime?: string, endTime?: string, endDate?: string): string => {
  const start = new Date(startDate);
  
  // Vérifier que la date de début est valide
  if (!isValid(start)) {
    return 'Date invalide';
  }
  
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

/**
 * Formate une date simple avec affichage conditionnel de la date de fin
 * Utilisé pour les tuiles de recherche et profils
 */
export const formatGameDate = (startDate: string, endDate?: string): string => {
  // Vérifier que startDate existe et n'est pas vide
  if (!startDate || startDate.trim() === '') {
    return 'Date non spécifiée';
  }

  const start = new Date(startDate);
  
  // Vérifier que la date de début est valide
  if (!isValid(start)) {
    console.warn('Date de début invalide:', startDate);
    return 'Date invalide';
  }

  const startFormatted = format(start, 'dd/MM/yyyy', { locale: fr });
  
  // Si pas de date de fin ou date de fin vide, afficher seulement la date de début
  if (!endDate || endDate.trim() === '') {
    return startFormatted;
  }

  const end = new Date(endDate);
  
  // Si la date de fin n'est pas valide, afficher seulement la date de début
  if (!isValid(end)) {
    console.warn('Date de fin invalide:', endDate);
    return startFormatted;
  }
  
  // Si même date, afficher seulement la date de début
  if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    return startFormatted;
  }
  
  // Si dates différentes, afficher la plage
  const endFormatted = format(end, 'dd/MM/yyyy', { locale: fr });
  return `${startFormatted} - ${endFormatted}`;
};
