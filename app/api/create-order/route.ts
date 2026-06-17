import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const COMMISSION_DEPOSIT_PAISE = 1_000_000 // ₹10,000

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const amount = Number(body.amount ?? COMMISSION_DEPOSIT_PAISE)

    if (!Number.isInteger(amount) || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise' },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `sevvagam_${Date.now()}`,
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
