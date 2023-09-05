import Stripe from 'stripe';

const payment = async ({
    stripe = new Stripe(process.env.stripeKey),
    payment_method_types = ["card"],
    mode = "payment",
    customer_email,
    metadata = {},
    success_url=process.env.success_url,
    cancel_url,
    discounts = [],
    line_items = []
} = {}) => {


    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        success_url,
        cancel_url,
        discounts,
        line_items
    })
    return session
}

export default payment