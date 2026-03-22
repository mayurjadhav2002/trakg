export const subscriptionLink = (
	productid: string,
	metadata: any,
	email: string
) => {
	if (process.env.NODE_ENV === "development") {
		return `https://test.checkout.dodopayments.com/buy/${productid}?quantity=1&redirect_url=${process.env.PAYMENT_REDIRECT_URL}&email=${email}&${metadata}`;
	}
	return `https://checkout.dodopayments.com/buy/${productid}?quantity=1&redirect_url=${process.env.PAYMENT_REDIRECT_URL}&email=${email}&${metadata}`; // Replace with your actual redirect URL
};


