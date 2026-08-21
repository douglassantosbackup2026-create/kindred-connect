CREATE POLICY "Assinantes assistem treinos videos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'treinos-videos' AND (public.is_admin() OR public.acesso_pro_ativo()));

CREATE POLICY "Admins enviam treinos videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'treinos-videos' AND public.is_admin());

CREATE POLICY "Admins atualizam treinos videos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'treinos-videos' AND public.is_admin())
  WITH CHECK (bucket_id = 'treinos-videos' AND public.is_admin());

CREATE POLICY "Admins apagam treinos videos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'treinos-videos' AND public.is_admin());