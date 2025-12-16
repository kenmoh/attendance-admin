import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"
import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 verflow-hidden items-center justify-center rounded-lg bg-primary">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 13, 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              EasyAttendance ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our attendance management
              platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and email address</li>
              <li>Company and organizational information</li>
              <li>Employee identification details</li>
              <li>Phone numbers and contact information</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Attendance Data</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Clock-in and clock-out timestamps</li>
              <li>Location data (GPS coordinates) when using geofencing features</li>
              <li>QR code scan records</li>
              <li>Attendance status and patterns</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Device Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device type and operating system</li>
              <li>Browser type and version</li>
              <li>IP address</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our attendance management services</li>
              <li>Verify employee identity and location during clock-in/out</li>
              <li>Generate attendance reports and analytics</li>
              <li>Calculate salary deductions based on attendance policies</li>
              <li>Send notifications and alerts related to attendance</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Location Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              When geofencing is enabled, we collect location data only at the time of clock-in and clock-out. This data
              is used solely to verify that employees are within the designated work area. We do not continuously track
              employee locations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your employer (for attendance records and reports)</li>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption in transit and
              at rest, secure authentication, and regular security audits. However, no method of transmission over the
              Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain attendance data for the period specified by your employer or as required by applicable laws.
              Upon account termination, we will delete or anonymize your data within 90 days, unless retention is
              required for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at
              privacy@EasyAttendance.com.
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
