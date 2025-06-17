
import { supabase } from '@/integrations/supabase/client';

/**
 * Incrémenter le compteur de téléchargements du bot Discord
 */
export const incrementDiscordBotDownloads = async () => {
  try {
    // Récupérer les statistiques actuelles
    const { data: currentStats } = await supabase
      .from('discord_bot_stats')
      .select('download_count')
      .single();

    // Incrémenter le compteur
    const { error } = await supabase
      .from('discord_bot_stats')
      .update({ 
        download_count: (currentStats?.download_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .single();

    if (error) {
      console.error('Erreur lors de l\'incrémentation des téléchargements du bot Discord:', error);
    } else {
      console.log('Téléchargement du bot Discord enregistré');
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des téléchargements du bot Discord:', error);
  }
};

/**
 * Incrémenter le compteur d'invitations du bot Discord
 */
export const incrementDiscordBotInvites = async () => {
  try {
    // Récupérer les statistiques actuelles
    const { data: currentStats } = await supabase
      .from('discord_bot_stats')
      .select('invite_count')
      .single();

    // Incrémenter le compteur
    const { error } = await supabase
      .from('discord_bot_stats')
      .update({ 
        invite_count: (currentStats?.invite_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .single();

    if (error) {
      console.error('Erreur lors de l\'incrémentation des invitations du bot Discord:', error);
    } else {
      console.log('Invitation du bot Discord enregistrée');
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des invitations du bot Discord:', error);
  }
};

/**
 * Incrémenter le compteur d'installations PWA
 */
export const incrementPwaInstalls = async () => {
  try {
    // Récupérer les statistiques actuelles
    const { data: currentStats } = await supabase
      .from('pwa_stats')
      .select('install_count')
      .single();

    // Incrémenter le compteur
    const { error } = await supabase
      .from('pwa_stats')
      .update({ 
        install_count: (currentStats?.install_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .single();

    if (error) {
      console.error('Erreur lors de l\'incrémentation des installations PWA:', error);
    } else {
      console.log('Installation PWA enregistrée');
    }
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des installations PWA:', error);
  }
};

/**
 * Incrémenter le compteur de visites d'une page
 */
export const incrementPageVisit = async (pagePath: string) => {
  try {
    // Vérifier si la page existe déjà
    const { data: existingPage } = await supabase
      .from('page_visit_stats')
      .select('visit_count')
      .eq('page_path', pagePath)
      .single();

    if (existingPage) {
      // Incrémenter le compteur de la page existante
      const { error } = await supabase
        .from('page_visit_stats')
        .update({ 
          visit_count: existingPage.visit_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('page_path', pagePath);

      if (error) {
        console.error('Erreur lors de l\'incrémentation des visites de page:', error);
      }
    } else {
      // Créer une nouvelle entrée pour cette page
      const { error } = await supabase
        .from('page_visit_stats')
        .insert({
          page_path: pagePath,
          visit_count: 1,
          unique_visitors: 1
        });

      if (error) {
        console.error('Erreur lors de la création des statistiques de page:', error);
      }
    }

    console.log(`Visite de page enregistrée pour: ${pagePath}`);
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des visites de page:', error);
  }
};
