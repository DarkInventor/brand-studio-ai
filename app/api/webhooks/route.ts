// import { NextResponse } from "next/server"
// import { headers } from "next/headers"
// import { stripe } from "@/lib/stripe"
// import { supabase } from "@/lib/supabase"
// import { createActionClient } from "@/lib/supabase/server"
// import { PLAN_CREDITS } from "@/config/stripe"
// import type Stripe from "stripe"

// export async function POST(req: Request) {
//   const body = await req.text()
//   const headersList = await headers()
//   const signature = headersList.get("stripe-signature") as string

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
//   } catch (error: any) {
//     console.error(`Webhook Error: ${error.message}`)
//     return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
//   }

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const checkoutSession = event.data.object as Stripe.Checkout.Session

//         // Find user by metadata, email, or Stripe customer ID
//         let userId = checkoutSession.metadata?.userId ?? null
//         const customerEmail = checkoutSession.customer_details?.email ?? null

//         if (!userId && customerEmail) {
//           const { data: userByEmail } = await supabase.from("profiles").select("id").eq("email", customerEmail).single()
//           userId = userByEmail?.id ?? null
//         }

//         if (!userId && checkoutSession.customer) {
//           const { data: userByStripeId } = await supabase.from("profiles").select("id").eq("stripe_customer_id", checkoutSession.customer).single()
//           userId = userByStripeId?.id ?? null
//         }

//         if (!userId) {
//           // Try authenticated user as last resort
//           const supabaseServer = createActionClient()
//           try {
//             const { data: { user } } = await supabaseServer.auth.getUser()
//             userId = user?.id ?? null
//           } catch { /* ignore */ }
//         }

//         if (!userId) {
//           return NextResponse.json({ error: "No user found for this payment." }, { status: 404 })
//         }

//         const customerId = checkoutSession.customer as string

//         // Determine plan name
//         let planName = checkoutSession.metadata?.planName ?? null

//         // If not in metadata, try to get from Stripe subscription product
//         if (!planName && checkoutSession.subscription) {
//           const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string)
//           const productId = subscription.items.data[0]?.price.product as string
//           if (productId) {
//             const product = await stripe.products.retrieve(productId)
//             planName = product.name // Should be "Starter", "Pro", etc.
//           }
//         }

//         // Fallback default
//         if (!planName) planName = "Pro"

//         // Set credits based on plan
//         let credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || 0

//         // Allow override via metadata (for testing or special cases)
//         if (checkoutSession.metadata?.credits) {
//           credits = Number.parseInt(checkoutSession.metadata.credits, 10)
//         }

//         // Get subscription details if available
//         let subscriptionStatus = "active"
//         let subscriptionPeriodEnd: string | null = null
//         if (checkoutSession.subscription) {
//           const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string)
//           subscriptionStatus = subscription.status
//           if (typeof (subscription as any).current_period_end === "number") {
//             subscriptionPeriodEnd = new Date((subscription as any).current_period_end * 1000).toISOString()
//           }
//         }

//         // Upsert profile (create or update)
//         const adminClient = createActionClient()
//         const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

//         const profileData = {
//           id: userId,
//           email: customerEmail,
//           stripe_customer_id: customerId,
//           is_subscribed: true,
//           subscription_status: subscriptionStatus,
//           subscription_period_end: subscriptionPeriodEnd,
//           subscription_plan: planName,
//           credits,
//           updated_at: new Date().toISOString(),
//           ...(profile ? {} : { created_at: new Date().toISOString() }),
//         }

//         if (!profile) {
//           // Create profile
//           const { error: createError } = await adminClient.from("profiles").insert(profileData)
//           if (createError) {
//             console.error("Error creating profile:", createError)
//             return NextResponse.json({ error: "Error creating profile" }, { status: 500 })
//           }
//         } else {
//           // Update profile
//           const { error: updateError } = await adminClient.from("profiles").update(profileData).eq("id", userId)
//           if (updateError) {
//             console.error("Error updating profile:", updateError)
//             return NextResponse.json({ error: "Error updating profile" }, { status: 500 })
//           }
//         }
//         break
//       }

//       case "invoice.paid":
//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice
//         if (invoice.customer && (invoice as any).subscription) {
//           const { data: user } = await supabase.from("profiles").select("id, subscription_plan").eq("stripe_customer_id", invoice.customer).single()
//           if (user) {
//             const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string)
//             const productId = subscription.items.data[0]?.price.product as string
//             let planName = user.subscription_plan
//             if (productId) {
//               try {
//                 const product = await stripe.products.retrieve(productId)
//                 planName = product.name
//               } catch (err) {
//                 console.error("Error fetching product:", err)
//               }
//             }
//             let credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || 0
//             const adminClient = createActionClient()
//             await adminClient.from("profiles").update({
//               is_subscribed: true,
//               subscription_status: subscription.status,
//               subscription_period_end: (typeof (subscription as any).current_period_end === 'number')
//                 ? new Date((subscription as any).current_period_end * 1000).toISOString()
//                 : null,
//               subscription_plan: planName,
//               credits,
//               updated_at: new Date().toISOString(),
//             }).eq("id", user.id)
//           }
//         }
//         break
//       }

//       case "customer.subscription.updated": {
//         const updatedSubscription = event.data.object as Stripe.Subscription
//         if (updatedSubscription.customer) {
//           const { data: user } = await supabase.from("profiles").select("id, subscription_plan").eq("stripe_customer_id", updatedSubscription.customer).single()
//           if (user) {
//             let planName = null
//             if (updatedSubscription.items.data[0]?.price.product) {
//               const productId = updatedSubscription.items.data[0].price.product
//               try {
//                 const product = await stripe.products.retrieve(productId as string)
//                 planName = product.name
//               } catch (err) {
//                 console.error("Error fetching product:", err)
//               }
//             }
//             let credits = null
//             if (planName && PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS]) {
//               if (user.subscription_plan !== planName) {
//                 credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS]
//               }
//             }
//             const adminClient = createActionClient()
//             const updateData: any = {
//               subscription_status: updatedSubscription.status,
//               subscription_period_end: (typeof (updatedSubscription as any).current_period_end === 'number')
//                 ? new Date((updatedSubscription as any).current_period_end * 1000).toISOString()
//                 : null,
//               subscription_plan: planName,
//               is_subscribed: updatedSubscription.status === "active",
//               updated_at: new Date().toISOString(),
//             }
//             if (credits !== null) {
//               updateData.credits = credits
//             }
//             await adminClient.from("profiles").update(updateData).eq("id", user.id)
//           }
//         }
//         break
//       }

//       case "customer.subscription.deleted": {
//         const deletedSubscription = event.data.object as Stripe.Subscription
//         if (deletedSubscription.customer) {
//           const { data: user } = await supabase.from("profiles").select("id").eq("stripe_customer_id", deletedSubscription.customer).single()
//           if (user) {
//             const adminClient = createActionClient()
//             await adminClient.from("profiles").update({
//               is_subscribed: false,
//               subscription_status: deletedSubscription.status,
//               subscription_period_end: null,
//               subscription_plan: null,
//               updated_at: new Date().toISOString(),
//             }).eq("id", user.id)
//           }
//         }
//         break
//       }

//       default:
//         // Handle other event types as needed
//         break
//     }

//     return NextResponse.json({ received: true })
//   } catch (err) {
//     console.error("Webhook processing error:", err)
//     return NextResponse.json({ error: "Webhook processing error" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"
import { createActionClient } from "@/lib/supabase/server"
import { STRIPE_PRICES, PLAN_CREDITS } from "@/config/stripe"
import type Stripe from "stripe"

// Map Stripe Price IDs to internal plan names
const PRICE_TO_PLAN: Record<string, keyof typeof PLAN_CREDITS> = {
  [STRIPE_PRICES.STARTER_MONTHLY]: 'Starter',
  [STRIPE_PRICES.PRO_MONTHLY]: 'Pro',
  [STRIPE_PRICES.BUSINESS_MONTHLY]: 'Business',
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature") as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Resolve user ID
        let userId = session.metadata?.userId ?? null
        const customerEmail = session.customer_details?.email ?? null
        if (!userId && customerEmail) {
          const { data: byEmail } = await supabase.from("profiles").select("id").eq("email", customerEmail).single()
          userId = byEmail?.id ?? null
        }
        if (!userId && session.customer) {
          const { data: byStripe } = await supabase.from("profiles").select("id").eq("stripe_customer_id", session.customer as string).single()
          userId = byStripe?.id ?? null
        }
        if (!userId) {
          try {
            const supabaseServer = createActionClient()
            const { data: { user } } = await supabaseServer.auth.getUser()
            userId = user?.id ?? null
          } catch { /* ignore */ }
        }
        if (!userId) {
          return NextResponse.json({ error: "No user found for payment." }, { status: 404 })
        }

        // Determine plan name via metadata or price mapping
        let planName: string | null = session.metadata?.planName ?? null
        if (!planName && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
            expand: ['items.data.price']
          })
          const priceId = subscription.items.data[0]?.price.id
          planName = priceId ? PRICE_TO_PLAN[priceId] : null
        }
        if (!planName) planName = 'Starter'

        // Assign credits
        let credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || 0
        if (session.metadata?.credits) {
          credits = parseInt(session.metadata.credits, 10)
        }

        // Subscription status & period end
        let subscriptionStatus = 'active'
        let subscriptionPeriodEnd: string | null = null
        if (session.subscription) {
          const subs = await stripe.subscriptions.retrieve(session.subscription as string)
          subscriptionStatus = subs.status
          if (typeof subs.current_period_end === 'number') {
            subscriptionPeriodEnd = new Date(subs.current_period_end * 1000).toISOString()
          }
        }

        // Upsert profile
        const admin = createActionClient()
        const { data: existing } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
        const profileData: any = {
          id: userId,
          email: customerEmail,
          stripe_customer_id: session.customer as string,
          is_subscribed: true,
          subscription_status: subscriptionStatus,
          subscription_period_end: subscriptionPeriodEnd,
          subscription_plan: planName,
          credits,
          updated_at: new Date().toISOString(),
        }
        if (!existing) profileData.created_at = new Date().toISOString()

        if (existing) {
          await admin.from("profiles").update(profileData).eq("id", userId)
        } else {
          await admin.from("profiles").insert(profileData)
        }
        break
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.customer && invoice.subscription) {
          const { data: profile } = await supabase.from("profiles").select("id, subscription_plan").eq("stripe_customer_id", invoice.customer).single()
          if (profile) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string, {
              expand: ['items.data.price']
            })
            const priceId = subscription.items.data[0]?.price.id
            const planName = priceId ? PRICE_TO_PLAN[priceId] : profile.subscription_plan
            const credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || profile.credits || 0
            const periodEnd = typeof subscription.current_period_end === 'number'
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null
            await createActionClient().from("profiles").update({
              is_subscribed: true,
              subscription_status: subscription.status,
              subscription_period_end: periodEnd,
              subscription_plan: planName,
              credits,
              updated_at: new Date().toISOString(),
            }).eq("id", profile.id)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const updatedSub = event.data.object as Stripe.Subscription
        if (updatedSub.customer) {
          const { data: profile } = await supabase.from("profiles").select("id, subscription_plan, credits").eq("stripe_customer_id", updatedSub.customer).single()
          if (profile) {
            const priceId = updatedSub.items.data[0]?.price.id
            const planName = priceId ? PRICE_TO_PLAN[priceId] : profile.subscription_plan
            const credits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || profile.credits || 0
            const periodEnd = typeof updatedSub.current_period_end === 'number'
              ? new Date(updatedSub.current_period_end * 1000).toISOString()
              : null
            await createActionClient().from("profiles").update({
              is_subscribed: updatedSub.status === 'active',
              subscription_status: updatedSub.status,
              subscription_period_end: periodEnd,
              subscription_plan: planName,
              credits,
              updated_at: new Date().toISOString(),
            }).eq("id", profile.id)
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as Stripe.Subscription
        if (deletedSub.customer) {
          const { data: profile } = await supabase.from("profiles").select("id").eq("stripe_customer_id", deletedSub.customer).single()
          if (profile) {
            await createActionClient().from("profiles").update({
              is_subscribed: false,
              subscription_status: deletedSub.status,
              subscription_period_end: null,
              subscription_plan: null,
              updated_at: new Date().toISOString(),
            }).eq("id", profile.id)
          }
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook processing error:", err)
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 })
  }
}
