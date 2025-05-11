import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentCanceledPage() {
  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Canceled</CardTitle>
          <CardDescription>Your payment process was canceled.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">No worries! You can try again whenever you're ready.</p>
          <p className="text-center text-sm text-gray-500 mt-2">
            If you encountered any issues during checkout, please contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/pricing">
            <Button>Try Again</Button>
          </Link>
          <Link href="/support">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
