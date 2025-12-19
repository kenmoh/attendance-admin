import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Clock, MapPin, QrCode, Users, Shield, BarChart3, CheckCircle, ArrowRight, Star } from "lucide-react"
import Image from 'next/image'

const features = [
  {
    icon: Clock,
    title: "Smart Clock-In/Out",
    description: "Employees clock in and out with precision. Set grace periods and automatic lateness tracking.",
  },
  {
    icon: MapPin,
    title: "Geofencing",
    description: "Define clock-in radius to ensure employees are on-site when marking attendance.",
  },
  {
    icon: QrCode,
    title: "QR Code Verification",
    description: "Generate unique QR codes tied to your company ID for secure employee verification.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Create, manage, and organize your workforce with departments and roles.",
  },
  {
    icon: Shield,
    title: "Deduction Rules",
    description: "Automatic salary deductions based on late arrivals and absences. Fully customizable.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Real-time dashboards and exportable reports for payroll and compliance.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "HR Director, TechFlow Inc.",
    content: "EasyAttendance cut our payroll processing time by 60%. The QR verification alone saved us countless hours.",
    avatar: "/professional-woman-diverse.png",
  },
  {
    name: "Marcus Johnson",
    role: "Operations Manager, BuildRight Co.",
    content: "The geofencing feature ensures our field teams are actually on-site. Game changer for construction.",
    avatar: "/professional-man.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "CEO, StartupHub",
    content: "Simple, beautiful, and it just works. Our team adopted it in a day with zero training needed.",
    avatar: "/confident-business-woman.png",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    period: "/employee/month",
    description: "Perfect for small teams getting started",
    features: ["Up to 25 employees", "Basic clock-in/out", "QR code verification", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$19",
    period: "/employee/month",
    description: "For growing businesses that need more",
    features: [
      "Unlimited employees",
      "Geofencing",
      "Custom deduction rules",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
    ],
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 overflow-hidden items-center justify-center rounded-lg bg-primary">
            

                <Image
                src="/easyattendancesm.png"
                width={500}
                height={500}
                alt="EasyAttendance Logo"
              />

            </div>
            <span className="text-xl font-bold text-foreground">COPENG</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              Trusted by 2,000+ companies worldwide
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Attendance Management, <span className="text-primary">Simplified</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Track employee attendance with GPS verification, QR codes, and smart automation. Reduce payroll errors,
              enforce policies, and save hours every week.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-16 sm:mt-24">
            <div className="absolute -inset-4 rounded-2xl bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <img
                src="/modern-dashboard-interface-with-attendance-charts-.jpg"
                alt="EasyAttendance Dashboard Preview"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage attendance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for modern workplaces. Simple enough for small teams, scalable for enterprises.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
     {/* <section id="testimonials" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by HR teams everywhere
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">See what our customers have to say about COPENG</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-border bg-card p-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free for 14 days. No credit card required.</p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${plan.highlighted ? "border-primary bg-card shadow-xl scale-105" : "border-border bg-card"
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href="/sign-up">{plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--background)/0.1),transparent_70%)]" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
                Ready to streamline your attendance?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of companies already saving time and money with EasyAttendance.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/sign-up">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
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
              <p className="mt-4 text-sm text-muted-foreground">Modern attendance management for modern teams.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} COPENG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
