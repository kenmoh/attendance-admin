import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"
import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 overflow-hidden items-center justify-center rounded-lg bg-primary">
               <Image
                src="/easyattendancesm.png"
                width={500}
                height={500}
                alt="EasyAttendance Logo"
              />
            </div>
            <span className="text-xl font-bold text-foreground">EasyAttendance</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 13, 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using EasyAttendance, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              EasyAttendance provides cloud-based attendance management software including employee tracking, QR code
              verification, geofencing, reporting, and payroll integration features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">To use EasyAttendance, you must:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Be authorized to bind your organization to these terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated tools to access the service without permission</li>
              <li>Falsify attendance records or location data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Subscription and Billing</h2>
            <p className="text-muted-foreground leading-relaxed">
              Paid subscriptions are billed on a monthly or annual basis. You authorize us to charge your payment method
              for all fees incurred. Subscriptions automatically renew unless cancelled before the renewal date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Ownership</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of all data you input into EasyAttendance. We have a license to use this data solely to
              provide our services to you. Upon termination, you may export your data within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance that
              temporarily affects availability. We are not liable for any losses due to service interruptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, EasyAttendance shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              Either party may terminate this agreement at any time. Upon termination, your right to use the service
              ceases immediately. We may terminate accounts that violate these terms without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these terms from time to time. We will notify you of material changes via email or through
              the service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, contact us at legal@EasyAttendance.com.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EasyAttendance. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
