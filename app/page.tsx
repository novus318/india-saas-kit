import PaymentManager from '@/components/PaymentManager';
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

      <PaymentManager />

      {!session && (
        <div className="mt-10 p-4 border border-yellow-500/50 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          Note: You are currently not signed in. Payment will be processed as guest (mock).
        </div>
      )}
    </main>
  );
}
