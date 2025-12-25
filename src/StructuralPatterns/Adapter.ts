interface PaymentGateway {
  pay(amount: number): void;
}

class StripePayment implements PaymentGateway {
  pay(amount: number) {
    console.log(`Paid ₹${amount} using Stripe`);
  }
}

// Adaptee (cannot change this)
class RazorpaySDK {
  makePayment(valueInPaise: number) {
    console.log(`Paid ₹${valueInPaise / 100} using Razorpay`);
  }
}

class RazorpayAdapter implements PaymentGateway {
  private razorpay: RazorpaySDK;

  constructor(razorpay: RazorpaySDK) {
    this.razorpay = razorpay;
  }

  pay(amount: number) {
    // adapting rupees → paise
    this.razorpay.makePayment(amount * 100);
  }
}

console.log("Payment Processing System");
const stripePayment = new StripePayment();
const razorpay = new RazorpaySDK();
const razorpayAdapter = new RazorpayAdapter(razorpay);

stripePayment.pay(100);
razorpayAdapter.pay(200);

// EXAMPLE 2


interface Logger {
  log(message: string): void;
}

class CloudLogger {
  sendLog(payload: { msg: string; timestamp: number }): void {}
}

class CloudLoggerAdapter implements Logger {
  private cloudLogger: CloudLogger;

  constructor(cloudLogger: CloudLogger) {
    this.cloudLogger = cloudLogger;
  }

  log(message: string): void {
    this.cloudLogger.sendLog({
      msg: message,
      timestamp: Date.now(),
    });
  }
}

function processOrder(logger: Logger) {
  logger.log("Order processed");
}

processOrder(new CloudLoggerAdapter(new CloudLogger()));