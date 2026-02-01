import PaymentButton from '@/components/PaymentButton';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-border bg-gradient-to-b from-muted/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-muted/50 lg:p-4">
          IndiaStack SaaS Boilerplate
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left gap-8">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/50">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Razorpay Payment
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-muted-foreground`}>
            Secure Razorpay integration with UPI/Card support.
          </p>
          <div className="mt-4">
            <PaymentButton amount={999} />
          </div>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/50">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            GST Invoice
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-muted-foreground`}>
            Auto-generated GST compliant invoices.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Invoice available after payment (check Order ID)
          </div>
        </div>
      </div>

      {!session && (
        <div className="mt-10 p-4 border border-yellow-500/50 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          Note: You are currently not signed in. Payment will be processed as guest (mock).
        </div>
      )}
    </main>
  );
}
