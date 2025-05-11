import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Testing Supabase service client...")

    // Create the service client
    const supabase = createServiceClient()

    // Try a simple query
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Error querying Supabase",
          error: error.message,
          hint: error.hint,
          details: error.details,
          code: error.code,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase service client is working correctly",
      data,
    })
  } catch (error: any) {
    console.error("Error testing Supabase service client:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error creating Supabase service client",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
