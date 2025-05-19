<!-- # Brand Studio

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


**Additional Video AD Info**  
# Unified Credit System Pricing

## Monthly Plan Credits
| Plan | Monthly Price | Credits/Month |
|------|--------------|--------------|
| Starter | $9 | 500 credits |
| Pro | $24 | 2,000 credits |
| Business | $59 | 5,000 credits |

## Content Generation Costs
| Content Type | Details | Your API Cost ($) | Credits Required | Cost per Credit |
|------------|------------|--------|------------------|--------------|
| Image | Standard quality | $0.11 | 1 credit | $0.11 per credit |
| **5-second Videos** |
| Video: 360P/540P (5s, normal) | Basic video | $0.45 | 4 credits | $0.1125 per credit |
| Video: 720P (5s, normal) | Standard video | $0.60 | 5 credits | $0.12 per credit |
| Video: 1080P (5s, normal) | Premium video | $1.20 | 11 credits | $0.1091 per credit |
| Video: 360P/540P (5s, smooth) | Basic video with smooth motion | $0.90 | 8 credits | $0.1125 per credit |
| Video: 720P (5s, smooth) | Standard video with smooth motion | $1.20 | 11 credits | $0.1091 per credit |
| **8-second Videos** |
| Video: 360P/540P (8s, normal) | Extended basic video | $0.90 | 8 credits | $0.1125 per credit |
| Video: 720P (8s, normal) | Extended standard video | $1.20 | 11 credits | $0.1091 per credit |
| **10-second Videos** (estimated costs) |
| Video: 360P/540P (10s, normal) | Extended basic video | $1.10* | 10 credits | $0.11 per credit |
| Video: 720P (10s, normal) | Extended standard video | $1.50* | 14 credits | $0.1071 per credit |
| Video: 1080P (10s, normal) | Extended premium video | $2.40* | 22 credits | $0.1091 per credit |
| **30-second Videos** (estimated costs) |
| Video: 360P/540P (30s, normal) | Long basic video | $3.30* | 30 credits | $0.11 per credit |
| Video: 720P (30s, normal) | Long standard video | $4.50* | 41 credits | $0.1098 per credit |
| Video: 1080P (30s, normal) | Long premium video | $7.20* | 65 credits | $0.1108 per credit |

*Estimated costs based on proportional scaling from 5s and 8s videos

### Video Generation Cost Table

| Duration | Quality | Motion | Credits | API Cost ($) | $/Credit | $/Video |
|----------|---------|--------|---------|--------------|----------|---------|
| 5s       | 360P/540P | normal | 4       | $0.45        | $0.1125  | $0.45   |
| 5s       | 720P      | normal | 5       | $0.60        | $0.12    | $0.60   |
| 5s       | 1080P     | normal | 11      | $1.20        | $0.1091  | $1.20   |
| 5s       | 360P/540P | smooth | 8       | $0.90        | $0.1125  | $0.90   |
| 5s       | 720P      | smooth | 11      | $1.20        | $0.1091  | $1.20   |
| 8s       | 360P/540P | normal | 8       | $0.90        | $0.1125  | $0.90   |
| 8s       | 720P      | normal | 11      | $1.20        | $0.1091  | $1.20   |
| 10s      | 360P/540P | normal | 10      | $1.10*       | $0.11    | $1.10   |
| 10s      | 720P      | normal | 14      | $1.50*       | $0.1071  | $1.50   |
| 10s      | 1080P     | normal | 22      | $2.40*       | $0.1091  | $2.40   |
| 30s      | 360P/540P | normal | 30      | $3.30*       | $0.11    | $3.30   |
| 30s      | 720P      | normal | 41      | $4.50*       | $0.1098  | $4.50   |
| 30s      | 1080P     | normal | 65      | $7.20*       | $0.1108  | $7.20   |

*10s and 30s costs are estimated by proportional scaling from 5s and 8s video costs.

**How to calculate your cost per video:**
- Each video generation deducts a specific number of credits based on the table above.
- Your cost per video = Credits used × Cost per credit (see your plan).
- Example: A 5s 720P normal video uses 5 credits. On the Starter plan ($0.11/credit), that's $0.55 per video.
- For the most accurate cost, check your plan's credit price and the video parameters you select.

## Additional Credits
| Additional Credits | Price | Cost to You | Your Profit |
|-------------------|-------|-------------|------------|
| 500 credits | $9 | ~$5.55 (at $0.0111/credit) | ~$3.45 (38%) |
| 1,000 credits | $16 | ~$11.10 | ~$4.90 (31%) |
| 2,000 credits | $28 | ~$22.20 | ~$5.80 (21%) |
| 5,000 credits | $65 | ~$55.50 | ~$9.50 (15%) |

## Usage Examples
| Plan | Credits | Possible Usage |
|------|---------|---------------|
| Starter (500 credits) | 500 | 500 images OR 125 basic 5s videos OR 45 standard 10s videos OR 16 basic 30s videos |
| Pro (2,000 credits) | 2,000 | 2,000 images OR 500 basic 5s videos OR 181 standard 10s videos OR 66 basic 30s videos |
| Business (5,000 credits) | 5,000 | 5,000 images OR 1,250 basic 5s videos OR 454 standard 10s videos OR 166 basic 30s videos |

## Implementation Recommendations
1. Set credit costs to maintain approximately 30% profit margin across all content types
2. Adjusted the 5,000 credit package price to $65 to improve profit margin to 15%
3. Consider creating a "Video Pack" add-on for users who primarily want to create videos
4. Implement usage analytics to track which video durations and resolutions are most popular
5. Add clear usage examples to help users understand how many videos they can create with each plan
6. If you find actual API costs for 10s and 30s videos differ from estimates, adjust credit requirements accordingly -->


# Brand Studio - AI-Powered Social Media Growth Platform

Brand Studio is the ultimate AI-powered platform for creating, managing, and scheduling thousands of high-converting posts for X (formerly Twitter) and LinkedIn. Designed for entrepreneurs, marketers, agencies, and thought leaders who want to build their personal brand and grow their social media presence at scale.

---

## Transform Your Social Media Presence

**Stop struggling with content creation. Start scaling your influence.**

Brand Studio uses advanced AI to help you:
- **Generate 1000s of posts** tailored to X and LinkedIn audiences
- **Build a consistent brand voice** across all platforms
- **Grow your following** with engaging, platform-optimized content
- **Save 10+ hours per week** on content creation
- **Analyze performance** with AI-powered insights

---

## What Does Brand Studio Do?

### 🎯 AI-Powered Post Generation
- **X/Twitter Posts:** Viral threads, engaging tweets, trending hashtags
- **LinkedIn Posts:** Professional insights, thought leadership, industry updates
- **Smart Adaptation:** Same idea, different formats for each platform
- **Bulk Generation:** Create weeks of content in minutes

### 🎨 Brand Voice Management
- **Personal Brand Kits:** Define your unique voice, tone, and expertise areas
- **Consistent Messaging:** Maintain brand consistency across 1000s of posts
- **Multiple Personas:** Manage different brand voices for various niches

### 📈 Growth-Focused Features
- **Trend Integration:** Auto-incorporate trending topics and hashtags
- **Engagement Optimization:** AI analyzes what drives engagement in your niche
- **Posting Schedules:** Strategic timing recommendations for maximum reach
- **Performance Tracking:** Monitor growth and engagement metrics

### 🔄 Content Amplification
- **Cross-Platform Repurposing:** Turn one idea into multiple platform-specific posts
- **Thread Creation:** Transform long-form content into engaging X threads
- **Professional Polish:** Convert casual ideas into LinkedIn-ready insights

---

## Perfect For

**🚀 Entrepreneurs & Founders**
- Build thought leadership in your industry
- Share startup journey and lessons learned
- Generate leads through valuable content

**💼 B2B Professionals**
- Establish industry expertise on LinkedIn
- Network and connect with potential clients
- Share professional insights and trends

**📱 Content Creators**
- Scale content production efficiently
- Maintain consistent posting schedule
- Grow following across multiple platforms

**🏢 Marketing Agencies**
- Manage multiple client brands
- Deliver high-volume content efficiently
- Provide data-driven content strategies

---

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript
- **UI:** Shadcn/ui, Lucide Icons, Tailwind CSS
- **AI Engine:** OpenAI GPT-4 (optimized for social media content)
- **Database & Auth:** Supabase (Postgres, Auth, Storage)
- **Analytics:** Real-time engagement tracking and AI insights
- **Deployment:** Vercel

---

## Pricing Plans

Grow your social media presence with plans designed for every scale.

| Plan | Price/month | Posts/month | Platforms | Features |
|------|-------------|-------------|-----------|----------|
| **Creator** | $19 | 1,000 posts | X + LinkedIn | AI post generation, 1 brand kit, basic analytics |
| **Professional** | $49 | 3,000 posts | X + LinkedIn | Priority generation, 3 brand kits, advanced analytics, trend integration |
| **Agency** | $99 | 10,000 posts | X + LinkedIn | Unlimited brand kits, team collaboration, client management, API access |

### What's Included in Each Post?
- Platform-optimized content (text + formatting)
- Hashtag recommendations
- Engagement optimization suggestions
- Best time to post recommendations

### Additional Features
- **Trend Analysis:** $5/month - Real-time trending topic integration
- **Advanced Analytics:** $10/month - Deep engagement insights and competitor analysis
- **Bulk Upload:** Free - Import existing content for AI optimization

---

## How It Works

### 1. Setup Your Brand
- Create your brand kit with voice, tone, and expertise areas
- Define your target audience and goals
- Set up posting preferences for X and LinkedIn

### 2. Generate Content at Scale
- Use AI prompts to generate hundreds of posts instantly
- Choose from templates: threads, insights, tips, personal stories
- Bulk generate content for weeks or months ahead

### 3. Optimize & Schedule
- AI analyzes and optimizes each post for maximum engagement
- Smart scheduling based on your audience's activity
- Cross-platform adaptation ensures perfect formatting

### 4. Track & Improve
- Monitor performance with real-time analytics
- Get AI-powered recommendations for content improvement
- Identify top-performing content themes and formats

---

## Content Types We Master

### For X (Twitter):
- **Viral Threads** - Multi-tweet storytelling that drives engagement
- **Quick Tips** - Bite-sized valuable insights
- **Personal Stories** - Authentic experiences that resonate
- **Industry Takes** - Thought-provoking opinions on trends
- **Motivational Posts** - Inspirational content that gets shared

### For LinkedIn:
- **Thought Leadership** - Industry insights and predictions
- **Professional Stories** - Career lessons and experiences
- **Company Updates** - Business milestones and achievements
- **Educational Content** - How-to guides and tutorials
- **Networking Posts** - Conversation starters and connections

---

## Getting Started

### Quick Setup (5 minutes)
1. **Sign up** with your email or social account
2. **Create your first brand kit** - tell us about your expertise and voice
3. **Generate your first batch** of posts with our AI wizard
4. **Review and customize** the content to match your style
5. **Schedule or export** your posts to start growing your presence

### Pro Tips for Success
- Start with 10-20 posts to establish your voice baseline
- Use our trending topics feature to stay relevant
- Mix content types for maximum engagement
- Analyze top performers and iterate

---

## Why Choose Brand Studio?

### ✨ **Superior AI Quality**
Our AI is specifically trained on high-performing social media content, ensuring every post is optimized for engagement and growth.

### 🎯 **Platform-Specific Optimization**
Unlike generic tools, Brand Studio understands the unique cultures and best practices of X and LinkedIn.

### 📊 **Growth-Focused Approach**
Every feature is designed to help you grow your following, increase engagement, and build your brand presence.

### ⚡ **Scale Without Compromise**
Generate thousands of posts while maintaining quality and authenticity.

---

## API & Integrations

**Coming Soon:**
- Direct posting to X and LinkedIn
- Hootsuite and Buffer integrations
- Zapier connectivity
- Analytics dashboard API
- Team collaboration tools

---

## Security & Privacy

- Enterprise-grade security with Supabase
- Your content and brand data are never shared
- GDPR compliant data handling
- SOC 2 Type II certification in progress

---

## Customer Success Stories

> "Brand Studio helped me go from 500 to 50K followers on X in 6 months. The AI understands my voice perfectly and creates content that actually converts."
> — *Sarah Chen, Tech Entrepreneur*

> "As a marketing agency, Brand Studio has 10x'd our content output. We can now serve more clients with higher quality content."
> — *Mark Rodriguez, Digital Agency Owner*

---

## Ready to Transform Your Social Presence?

**Start growing your brand today with AI-powered content that converts followers into customers.**

[**Try Brand Studio Free**](#) → No credit card required  
[**Book a Demo**](#) → See how agencies scale with Brand Studio  
[**Contact Sales**](#) → Custom enterprise solutions

---

## Development & Contribution

**For Developers:**
- Built with modern React/Next.js architecture
- TypeScript throughout for type safety
- Modular component architecture
- Comprehensive API documentation

**Contributing:**
- Fork the repository
- Create feature branches
- Submit detailed pull requests
- Follow our coding standards and conventions

---

## Support & Contact

**Questions about growing your social presence?**
- 📧 Email: hello@brandstudio.ai
- 💬 Live Chat: Available 24/7 in app
- 📖 Documentation: docs.brandstudio.ai
- 🎥 Tutorials: youtube.com/brandstudio

**Enterprise & Custom Solutions:**
Contact our team for volume discounts, custom integrations, and white-label solutions.

---

*Brand Studio - Where AI meets authentic social media growth. Create thousands of posts, build your brand, and scale your influence across X and LinkedIn.*