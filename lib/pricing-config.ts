export const STRIPE_PRICE_IDS = {
  // Monthly plans
  basic_monthly: "price_1234", // Replace with your actual Stripe price ID
  pro_monthly: "price_5678", // Replace with your actual Stripe price ID
  enterprise_monthly: "price_9012", // Replace with your actual Stripe price ID

  // Yearly plans
  basic_yearly: "price_yearly_1234", // Replace with your actual Stripe price ID
  pro_yearly: "price_yearly_5678", // Replace with your actual Stripe price ID
  enterprise_yearly: "price_yearly_9012", // Replace with your actual Stripe price ID
}

// Features for each plan
export const PLAN_FEATURES = {
  basic: ["Generate up to 50 brand assets", "Basic templates", "Email support"],
  pro: ["Generate up to 200 brand assets", "Advanced templates", "Priority support", "Custom brand voice"],
  enterprise: ["Unlimited brand assets", "All templates", "Dedicated support", "Custom brand voice", "API access"],
}
