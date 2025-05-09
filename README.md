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

### Updated Brand Advertisement Generation Service - Pricing Plans

Thank you for sharing the OpenAI pricing details! I'll update our pricing plans based on the actual GPT Image 1 costs from the reference you provided.

## Revised Cost Breakdown (Our Actual Costs)

| Operation | Base Cost
|-----|-----
| Image Generation (GPT Image 1, Low quality, 1024x1024) | $0.011 per image
| Image Generation (GPT Image 1, Medium quality, 1024x1024) | $0.042 per image
| Text Tokens for Prompts (GPT-4o-mini) | ~$0.0005 per prompt (avg. 3,000 tokens)
| Caption Generation (GPT-3.5 Turbo) | ~$0.0005 per caption (avg. 500 tokens)
| Text/Logo Processing | $0.0000 (done locally)
| Storage & Caching | $0.0005 per ad
| Total Base Cost (Low Quality) | $0.012 per ad
| Total Base Cost (Medium Quality) | $0.043 per ad
| Total Base Cost (High Quality) | $0.168 per ad


## Updated Pricing Plans (With 30% Margin)

### 1. STARTER PLAN

**$7.99/month**

- Generate up to 100 brand advertisements monthly
- Cost per ad: $0.08 (includes 30% margin)
- Features:

- GPT-Image-1 powered visuals (Low quality)
- Unique GPT-3.5 Turbo captions
- Logo placement
- Basic image sizes (1024x1024)
- Email support
- 7-day image storage





**Perfect for:** Small businesses, solopreneurs, and startups just beginning their social media journey.

### 2. PROFESSIONAL PLAN

**$19.99/month**

- Generate up to 200 brand advertisements monthly
- Cost per ad: $0.10 (includes 30% margin)
- Features:

- Everything in Starter, plus:
- Medium quality image generation
- Priority image processing
- Premium image sizes (1024x1536, 1536x1024)
- Custom text overlay options
- Batch processing (up to 10 ads at once)
- 30-day image storage
- Chat support
- Basic analytics





**Perfect for:** Growing businesses, marketing agencies handling multiple clients, and content creators with regular posting schedules.

### 3. ENTERPRISE PLAN

**$99.99/month**

- Generate up to 500 brand advertisements monthly
- Cost per ad: $0.20 (includes 30% margin)
- Features:

- Everything in Professional, plus:
- High quality image generation
- Highest priority processing
- All available image sizes and formats
- Advanced batch processing (up to 50 ads at once)
- API access for integration
- Custom brand voice profiles
- 90-day image storage
- Dedicated account manager
- Comprehensive analytics dashboard
- White-label option (+$20/month)





**Perfect for:** Marketing agencies, large brands, e-commerce businesses with extensive product catalogs, and companies managing multiple brand identities.

## Additional Options (All Plans)

- **Pay-as-you-go credits**:

- Low Quality: $10 for 100 additional ad generations
- Medium Quality: $15 for 100 additional ad generations
- High Quality: $30 for 100 additional ad generations



- **Image storage extension**: $5/month for additional 60 days of storage
- **Custom brand voice training**: $49 one-time fee per brand
- **Bulk discount**: 10% off when purchasing 6+ months upfront


## Comparison Table

| Feature | STARTER | PROFESSIONAL | ENTERPRISE
|-----|-----
| Monthly Price | $7.99 | $19.99 | $99.99
| Ads per Month | 100 | 200 | 500
| Cost per Ad | $0.08 | $0.10 | $0.20
| Image Quality | Low | Medium | High
| Image Sizes | Basic | Extended | All Available
| Batch Processing | No | Yes (10) | Yes (50)
| Storage Period | 7 days | 30 days | 90 days
| Support | Email | Chat | Dedicated Manager
| API Access | No | No | Yes
| Analytics | No | Basic | Comprehensive


## Profit Margin Analysis

| Plan | Monthly Revenue | Estimated Costs | Profit Margin
|-----|-----
| STARTER (Low Quality) | $7.99 | $1.20 (100 ads) | 85%
| PROFESSIONAL (Medium Quality) | $19.99 | $8.60 (200 ads) | 57%
| ENTERPRISE (High Quality) | $99.99 | $84.00 (500 ads) | 16%


## Why These Prices Work

1. **Starter Plan**: Extremely affordable entry point with healthy margins due to low-quality images
2. **Professional Plan**: Best value for most users with balanced quality and cost
3. **Enterprise Plan**: Premium offering with highest quality images (which have significantly higher costs)


The pricing structure encourages users to start with the Starter plan and upgrade as they see results. The Professional plan offers the best balance of quality and value, while the Enterprise plan caters to users who demand the highest quality and are willing to pay for it.

Note that the Enterprise plan has a lower margin percentage but higher absolute profit per customer, making it valuable for your business despite the higher costs associated with high-quality image generation.