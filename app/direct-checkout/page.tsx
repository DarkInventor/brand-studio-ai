import { DirectCheckoutButton } from "@/components/stripe/direct-checkout-button"
import { STRIPE_PRICES } from "@/config/stripe"

export default function DirectCheckoutPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h1>

        <div className="space-y-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Starter Plan</h2>
            <p className="text-gray-600 mb-4">$9/month - 500 Images/month</p>
            <DirectCheckoutButton
              priceId={STRIPE_PRICES.STARTER_MONTHLY}
              buttonText="Get Starter Plan"
              className="w-full"
            />
          </div>

          <div className="border p-4 rounded-lg border-primary bg-primary/5">
            <h2 className="text-xl font-semibold">Pro Plan</h2>
            <p className="text-gray-600 mb-4">$24/month - 2,000 Images/month</p>
            <DirectCheckoutButton
              priceId={STRIPE_PRICES.PRO_MONTHLY}
              buttonText="Get Pro Plan"
              className="w-full bg-primary hover:bg-primary/90"
            />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Business Plan</h2>
            <p className="text-gray-600 mb-4">$59/month - 5,000 Images/month</p>
            <DirectCheckoutButton
              priceId={STRIPE_PRICES.BUSINESS_MONTHLY}
              buttonText="Get Business Plan"
              className="w-full"
            />
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          All plans include commercial usage rights and comprehensive brand kit management.
        </p>
      </div>
    </div>
  )
}
