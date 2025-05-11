import { SubscriptionStatus } from "@/components/stripe/subscription-status"
import { CreditBalance } from "@/components/credit-balance"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
          <SubscriptionStatus />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="bg-white p-6 rounded-lg border mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{session.user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                <p className="text-sm text-gray-500 truncate">{session.user.id}</p>
              </div>
            </div>
          </div>

          {/* <CreditBalance /> */}
        </div>
      </div>
    </div>
  )
}
