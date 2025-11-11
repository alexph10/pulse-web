# Supabase Storage Setup Guide

## 📦 Creating Storage Buckets for Pulse Web

Follow these steps to set up the required storage buckets in your Supabase project.

---

## 1. Create the Avatars Bucket

### Step-by-step Instructions:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click the "New bucket" button

3. **Create Avatars Bucket**
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (check this box)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)
   - Click "Create bucket"

4. **Configure Bucket Policies** (Optional but Recommended)
   
   After creating the bucket, you can set up RLS policies:

   ```sql
   -- Policy: Users can upload their own profile pictures and banners
   CREATE POLICY "Users can upload own avatars"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'avatars' AND
     (auth.uid()::text = (storage.foldername(name))[1])
   );

   -- Policy: Everyone can view avatars (public bucket)
   CREATE POLICY "Public avatars are viewable by everyone"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'avatars');

   -- Policy: Users can update their own avatars
   CREATE POLICY "Users can update own avatars"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (
     bucket_id = 'avatars' AND
     (auth.uid()::text = (storage.foldername(name))[1])
   );

   -- Policy: Users can delete their own avatars
   CREATE POLICY "Users can delete own avatars"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'avatars' AND
     (auth.uid()::text = (storage.foldername(name))[1])
   );
   ```

---

## 2. Folder Structure

The app will organize files in the avatars bucket as:

```
avatars/
├── profiles/
│   ├── {userId}-profile-{timestamp}.jpg
│   ├── {userId}-profile-{timestamp}.png
│   └── ...
└── banners/
    ├── {userId}-banner-{timestamp}.jpg
    ├── {userId}-banner-{timestamp}.png
    └── ...
```

---

## 3. Verify Setup

After creating the bucket, verify it's working:

1. Go to Storage → avatars
2. Try uploading a test image manually
3. Check that you can view the public URL
4. Test deleting the image

---

## 4. Alternative: Using Supabase CLI

If you prefer using the CLI:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Create bucket via SQL
supabase db execute --file setup-storage.sql
```

Then create `setup-storage.sql`:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

---

## ✅ Checklist

- [ ] Created `avatars` bucket
- [ ] Set bucket to public
- [ ] Configured file size limit (5 MB recommended)
- [ ] Set up RLS policies (optional but recommended)
- [ ] Tested upload/view/delete operations
- [ ] Verified public URLs are accessible

---

## 🔒 Security Notes

- The `avatars` bucket is public, meaning anyone with the URL can view the images
- RLS policies ensure users can only upload/delete their own files
- Consider adding file size limits to prevent abuse
- Monitor storage usage in Supabase dashboard

---

## 🆘 Troubleshooting

**Images not uploading?**
- Check that the bucket is set to public
- Verify RLS policies are correct
- Check browser console for errors

**Images not displaying?**
- Verify the public URL is correct
- Check CORS settings if loading from different domain
- Ensure bucket is public

**Permission denied errors?**
- Check RLS policies
- Verify user is authenticated
- Check bucket_id in policies matches 'avatars'
