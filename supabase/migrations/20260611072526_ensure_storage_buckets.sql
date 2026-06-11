
-- Insert storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, NULL),
  ('project-images', 'project-images', true, 10485760, NULL),
  ('certifications', 'certifications', true, 5242880, NULL),
  ('resumes', 'resumes', true, 10485760, NULL),
  ('og-images', 'og-images', true, 5242880, NULL)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads from all buckets
CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');
CREATE POLICY "public_read_project_images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "public_read_certifications" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'certifications');
CREATE POLICY "public_read_resumes" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');
CREATE POLICY "public_read_og_images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'og-images');

-- Allow authenticated uploads to all buckets
CREATE POLICY "auth_upload_avatars" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "auth_upload_project_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "auth_upload_certifications" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certifications');
CREATE POLICY "auth_upload_resumes" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "auth_upload_og_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'og-images');

-- Allow authenticated updates/deletes
CREATE POLICY "auth_update_avatars" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');
CREATE POLICY "auth_delete_avatars" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars');
CREATE POLICY "auth_update_project_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "auth_delete_project_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "auth_update_certifications" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'certifications');
CREATE POLICY "auth_delete_certifications" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'certifications');
CREATE POLICY "auth_update_resumes" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes');
CREATE POLICY "auth_delete_resumes" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes');
CREATE POLICY "auth_update_og_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'og-images');
CREATE POLICY "auth_delete_og_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'og-images');
