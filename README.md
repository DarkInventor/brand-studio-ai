# Brand Studio

Brand Studio is an AI-powered platform for generating, managing, and previewing Instagram-ready posts (images and captions) for brands. It leverages OpenAI for creative content generation and Supabase for authentication, data, and storage. This project is designed to help marketing teams, agencies, and solo founders automate and streamline their social media content creation process.

---

## What does it do?
- **Brand Kit Management:** Users can create and manage brand kits, specifying brand name, colors, tone, and logo.
- **AI-Powered Post Generation:** For each brand kit, users can generate Instagram posts. The system uses OpenAI to create both a caption and an image that matches the brand's style.
- **Image Handling:** Generated images are either saved as data URLs (base64) or direct URLs from OpenAI, and are previewable in the dashboard and summary pages.
- **Post Management:** Users can view, edit, and schedule posts. Captions can be regenerated and posts can be updated or deleted.
- **AI Analytics Dashboard:** Get AI-powered insights and recommendations for your content strategy, including brand consistency analysis, caption quality evaluation, and strategic recommendations.
- **Authentication:** Uses Supabase Auth for user sign-up, login, and session management.
- **Dashboard:** A modern dashboard UI to view all posts, filter by brand kit, and manage content.

---

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript
- **UI:** Shadcn/ui, Lucide Icons, Tailwind CSS
- **Backend/API:** Next.js API routes, OpenAI API (for image and caption generation, analytics)
- **Database & Auth:** Supabase (Postgres, Auth, Storage)
- **Deployment:** Vercel

---

## Pricing

Brand Studio offers flexible plans to suit different needs. All plans include commercial usage rights, brand kit management, and access to our AI-powered post generation tools.

| Plan      | Price/month | Images/month | Features                                         |
|-----------|-------------|--------------|--------------------------------------------------|
| Starter   | $9          | 500          | Standard image quality, basic support            |
| Pro       | $24         | 2,000        | Priority image generation, analytics, advanced editing, priority support |
| Business  | $59         | 5,000        | Team collaboration, API access, custom templates, onboarding support |

**Additional Usage:**  
If you exceed your plan's image quota, you can purchase extra image credits at $0.02 per image.

**How are images billed?**  
Each Instagram-ready post (image + caption) uses one image credit.  
- **Cost per image:** $0.011 per image (low quality, 1024x1024)

**AI Analytics Feature Costs:**  
- **Cost per analysis:** $1.00 per content analysis
- **Pro plan:** Includes 10 analyses per month ($10 value)
- **Business plan:** Includes 50 analyses per month ($50 value)
- **Additional analyses:** $1.00 per analysis beyond plan limits

**What you get with each AI analysis:**
- Brand consistency score and detailed feedback
- Caption quality evaluation with actionable recommendations
- Content improvement suggestions (3-5 specific recommendations)
- Overall content strategy recommendation
- Analysis of post distribution across your brand kits

---

## How it works
1. **User signs up/logs in** via Supabase Auth.
2. **User creates a Brand Kit** (name, colors, tone, logo).
3. **User generates posts:**
   - The app sends a prompt to OpenAI to generate a caption and an image.
   - The image is saved as a data URL or direct URL in the database.
   - The caption and image URL are saved as a new post.
4. **User can preview, edit, or schedule posts** from the dashboard.
5. **User can analyze content strategy** with the AI Analytics Dashboard:
   - Select a time range (7 days, 30 days, 90 days, or all time)
   - Click "Analyze Content" to generate AI feedback
   - Review scores, recommendations, and strategic insights
   - Refresh analysis as needed (counts as a new analysis)
6. **All data is stored in Supabase** (brand kits, posts, user profiles).

---

## Running locally

1. Clone the repo and install dependencies:
```
git clone https://github.com/DarkInventor/brand-studio.git
cd brand-studio
npm install
```

2. Set up your `.env.local` with your Supabase and OpenAI credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-key
```

3. Run the dev server:
```
npm run dev
```

4. Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment

- The app is designed for Vercel, but can be deployed anywhere that supports Next.js.
- Set the same environment variables in your deployment platform.

---

## Contributing

- Please keep code modular and well-commented.
- Use TypeScript for all new code.
- UI components should be placed in `app/components` or `components/ui`.
- API and server logic should go in `lib/actions` or `lib/openai.ts`.
- All database types are in `lib/supabase/database.types.ts`.
- For major changes, open a pull request and describe your reasoning.

---

## Notes for future developers

- The OpenAI image API may return either a direct URL or a base64-encoded image. The code handles both.
- Supabase Storage is not used for post images (to avoid extra costs and complexity); images are previewed directly from OpenAI or as data URLs.
- The AI Analytics feature uses OpenAI's GPT-4o model to analyze content and provide recommendations.
- If you want to add more social platforms, extend the brand kit and post models.
- For any issues with authentication or storage, check Supabase project settings and RLS policies.

---

**Questions?**  
Contact us for custom plans, enterprise needs, or support.


