# Brand Studio

Brand Studio is an AI-powered platform for generating, managing, and previewing Instagram-ready posts (images and captions) for brands. It leverages OpenAI for creative content generation and Supabase for authentication, data, and storage. This project is designed to help marketing teams, agencies, and solo founders automate and streamline their social media content creation process.

## What does it do?
- **Brand Kit Management:** Users can create and manage brand kits, specifying brand name, colors, tone, and logo.
- **AI-Powered Post Generation:** For each brand kit, users can generate Instagram posts. The system uses OpenAI to create both a caption and an image that matches the brand's style.
- **Image Handling:** Generated images are either saved as data URLs (base64) or direct URLs from OpenAI, and are previewable in the dashboard and summary pages.
- **Post Management:** Users can view, edit, and schedule posts. Captions can be regenerated and posts can be updated or deleted.
- **Authentication:** Uses Supabase Auth for user sign-up, login, and session management.
- **Dashboard:** A modern dashboard UI to view all posts, filter by brand kit, and manage content.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript
- **UI:** Shadcn/ui, Lucide Icons, Tailwind CSS
- **Backend/API:** Next.js API routes, OpenAI API (for image and caption generation)
- **Database & Auth:** Supabase (Postgres, Auth, Storage)
- **Deployment:** Vercel

## How it works
1. **User signs up/logs in** via Supabase Auth.
2. **User creates a Brand Kit** (name, colors, tone, logo).
3. **User generates posts:**
   - The app sends a prompt to OpenAI to generate a caption and an image.
   - The image is saved as a data URL or direct URL in the database.
   - The caption and image URL are saved as a new post.
4. **User can preview, edit, or schedule posts** from the dashboard.
5. **All data is stored in Supabase** (brand kits, posts, user profiles).

## Running locally
1. Clone the repo and install dependencies:
   ```sh
   git clone https://github.com/DarkInventor/brand-studio.git
   cd brand-studio
   npm install
   ```
2. Set up your `.env.local` with your Supabase and OpenAI credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-key
   ```
3. Run the dev server:
   ```sh
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000)

## Deployment
- The app is designed for Vercel, but can be deployed anywhere that supports Next.js.
- Set the same environment variables in your deployment platform.

## Contributing
- Please keep code modular and well-commented.
- Use TypeScript for all new code.
- UI components should be placed in `app/components` or `components/ui`.
- API and server logic should go in `lib/actions` or `lib/openai.ts`.
- All database types are in `lib/supabase/database.types.ts`.
- For major changes, open a pull request and describe your reasoning.

## Notes for future developers
- The OpenAI image API may return either a direct URL or a base64-encoded image. The code handles both.
- Supabase Storage is not used for post images (to avoid extra costs and complexity); images are previewed directly from OpenAI or as data URLs.
- If you want to add more social platforms, extend the brand kit and post models.
- For any issues with authentication or storage, check Supabase project settings and RLS policies.

---

**Maintainer:** @DarkInventor

For questions, open an issue or contact the maintainer.
