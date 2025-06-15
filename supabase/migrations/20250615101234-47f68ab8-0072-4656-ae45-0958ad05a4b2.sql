
INSERT INTO public.badges (name, description, icon, background_color, border_color)
SELECT
  'Profil vérifié',
  'Atteste que le profil a été vérifié par notre équipe via un document d''identité.',
  '/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png',
  '#e6f7ff',
  '#91d5ff'
WHERE NOT EXISTS (
  SELECT 1 FROM public.badges WHERE name = 'Profil vérifié'
);
