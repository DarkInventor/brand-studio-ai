import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Testing Supabase admin client...")

    // Try a simple query
    const { data, error } = await supabaseAdmin.from("profiles").select("count").limit(1)

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
      message: "Supabase admin client is working correctly",
      data,
    })
  } catch (error: any) {
    console.error("Error testing Supabase admin client:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error creating Supabase admin client",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
