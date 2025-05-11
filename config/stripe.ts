export const STRIPE_PRODUCTS = {
  MAIN_PRODUCT: "prod_SIAzrgXJe7WltQ",
}

export const STRIPE_PRICES = {
  STARTER_MONTHLY: "price_1RNh9sAPpzV89AesvB3aU49A", // Replace with your actual price ID when available
  PRO_MONTHLY: "price_1RNhB5APpzV89AeszSD55wm2",
  BUSINESS_MONTHLY: "price_business", // Replace with your actual price ID when available
}

export const PLAN_FEATURES = {
  Starter: ["basic_post_scheduling", "standard_image_quality", "basic_support"],
  Pro: [
    "basic_post_scheduling",
    "standard_image_quality",
    "basic_support",
    "priority_image_generation",
    "advanced_post_scheduling",
    "comprehensive_post_management",
    "analytics",
    "advanced_editing",
    "priority_support",
  ],
  Business: [
    "basic_post_scheduling",
    "standard_image_quality",
    "basic_support",
    "priority_image_generation",
    "advanced_post_scheduling",
    "comprehensive_post_management",
    "analytics",
    "advanced_editing",
    "priority_support",
    "team_collaboration",
    "api_access",
    "custom_templates",
    "onboarding_support",
    "unlimited_scheduling",
    "premium_generation",
  ],
}

export const PLAN_IMAGE_LIMITS = {
  Starter: 500,
  Pro: 2000,
  Business: 5000,
  Free: 100,
}

// Add credit allocations by plan
export const PLAN_CREDITS = {
  Starter: 500,
  Pro: 2000,
  Business: 5000,
  Free: 100,
}
