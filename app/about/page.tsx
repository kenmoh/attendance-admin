import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Clock, Target, Users, Heart, Award, Globe } from "lucide-react"
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Image
                src="/easyattendancesm.png"
                width={500}
                height={500}
                alt="EasyAttendance Logo"
              />
            </div>
            <span className="text-xl font-bold text-foreground">EasyAttendance</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              We're building the future of <span className="text-primary">workforce management</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              EasyAttendance was founded with a simple mission: make attendance tracking effortless, accurate, and fair for
              businesses of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                To empower businesses with intelligent attendance management tools that eliminate inefficiencies, reduce
                payroll errors, and create transparency between employers and employees. We believe time tracking should
                be simple, secure, and stress-free.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-foreground">Our Values</h2>
              <ul className="mt-4 space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Transparency:</strong> Fair policies and clear data for everyone
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Innovation:</strong> Cutting-edge tech like geofencing and QR
                    verification
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Reliability:</strong> Enterprise-grade security and 99.9% uptime
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-foreground">2,000+</p>
              <p className="mt-2 text-muted-foreground">Companies Trust Us</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-foreground">45+</p>
              <p className="mt-2 text-muted-foreground">Countries Worldwide</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-foreground">5M+</p>
              <p className="mt-2 text-muted-foreground">Clock-ins Daily</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-foreground">99.9%</p>
              <p className="mt-2 text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-center">Our Story</h2>
          <div className="mt-12 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              EasyAttendance was born from a frustration we all know too well. Our founders, former HR managers and software
              engineers, witnessed countless hours wasted on manual attendance tracking, disputes over clock-in times,
              and payroll errors that damaged trust between employers and employees.
            </p>
            <p>
              In 2020, we decided to build something better. We combined location-based technology, biometric
              verification, and intelligent automation to create a system that works for everyone. No more buddy
              punching. No more disputes. Just accurate, transparent attendance data.
            </p>
            <p>
              Today, EasyAttendance serves businesses from small startups to Fortune 500 companies across 45 countries. Our
              platform processes over 5 million clock-ins daily, helping companies save time, reduce costs, and build
              trust with their teams.
            </p>
            <p className="font-semibold text-foreground">
              But we're just getting started. Join us in transforming how the world manages time and attendance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--background)/0.1),transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
                Ready to transform your attendance tracking?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/90">
                Start your 14-day free trial. No credit card required.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/sign-up">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                   <Image
                src="/easyattendancesm.png"
                width={500}
                height={500}
                alt="EasyAttendance Logo"
              />
              </div>
              <span className="text-xl font-bold text-foreground">EasyAttendance</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EasyAttendance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
