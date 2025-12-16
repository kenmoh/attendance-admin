"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Clock, MapPin, DollarSign, Building2, Save, CheckCircle, Navigation, User } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { EmployerSettings } from "@/lib/types"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [employerId, setEmployerId] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string>("")

  // Employer profile fields
  const [employerEmail, setEmployerEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [state, setState] = useState<string>("")
  const [country, setCountry] = useState<string>("Nigeria")
  const [logoUrl, setLogoUrl] = useState<string>("")

  const [settings, setSettings] = useState<EmployerSettings>({
    id: "",
    employer_id: "",
    resumption_time: "09:00:00",
    closing_time: "17:00:00",
    grace_period_minutes: 15,
    lateness_deduction_amount: 0,
    absent_deduction_amount: 0,
    lateness_deduction_per_minute: null,
    clock_in_radius_meters: 100,
    require_location_verification: true,
    qr_code_refresh_interval_hours: 24,
    created_at: "",
    updated_at: "",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lateNotifications: true,
    dailyReport: false,
    weeklyReport: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        console.log("[v0] Authenticated user:", user?.id)

        if (!user) {
          console.log("[v0] No authenticated user found")
          setLoading(false)
          return
        }

        setUserEmail(user.email || "")

        const { data: employerData, error: employerError } = await supabase
          .from("employers")
          .select("id, company_name, email, phone, address, city, state, country, latitude, longitude, logo_url")
          .eq("user_id", user.id)
          .single()

        console.log("[v0] Employer data:", employerData)
        console.log("[v0] Employer error:", employerError)

        if (employerData) {
          setEmployerId(employerData.id)
          setCompanyName(employerData.company_name || "")
          setEmployerEmail(employerData.email || "")
          setPhone(employerData.phone || "")
          setAddress(employerData.address || "")
          setCity(employerData.city || "")
          setState(employerData.state || "")
          setCountry(employerData.country || "Nigeria")
          setLatitude(employerData.latitude)
          setLongitude(employerData.longitude)
          setLogoUrl(employerData.logo_url || "")

          const { data: settingsData, error: settingsError } = await supabase
            .from("employer_settings")
            .select("*")
            .eq("employer_id", employerData.id)
            .single()

          console.log("[v0] Settings data:", settingsData)
          console.log("[v0] Settings error:", settingsError)

          if (settingsData) {
            setSettings(settingsData)
          }
        }

        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single()

        console.log("[v0] Profile data:", profileData)
        console.log("[v0] Profile error:", profileError)

        if (profileData) {
          setUserName(profileData.full_name || "")
        }
      } catch (error) {
        console.error("[v0] Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCurrentLocation = () => {
    setLocationLoading(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocationLoading(false)
        setLocationError("")
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocationError("Failed to get location. Please check your browser permissions.")
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSaveSettings = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("employer_settings").upsert(
        {
          employer_id: employerId,
          resumption_time: settings.resumption_time,
          closing_time: settings.closing_time,
          grace_period_minutes: settings.grace_period_minutes,
          lateness_deduction_amount: settings.lateness_deduction_amount,
          absent_deduction_amount: settings.absent_deduction_amount,
          lateness_deduction_per_minute: settings.lateness_deduction_per_minute,
          clock_in_radius_meters: settings.clock_in_radius_meters,
          require_location_verification: settings.require_location_verification,
          qr_code_refresh_interval_hours: settings.qr_code_refresh_interval_hours,
        },
        { onConflict: "employer_id" },
      )

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleSaveCompany = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error: employerError } = await supabase
        .from("employers")
        .update({
          company_name: companyName,
          email: employerEmail,
          phone: phone || null,
          address: address || null,
          city: city || null,
          state: state || null,
          country: country || null,
          latitude: latitude,
          longitude: longitude,
          logo_url: logoUrl || null,
        })
        .eq("id", employerId)

      if (employerError) throw employerError

      await supabase.from("user_profiles").update({ full_name: userName }).eq("user_id", user.id)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your company and attendance settings</p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Attendance Settings */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Work Hours
              </CardTitle>
              <CardDescription>Set the standard work hours for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="resumptionTime">Resumption Time</Label>
                  <Input
                    id="resumptionTime"
                    type="time"
                    value={settings.resumption_time?.substring(0, 5) || "09:00"}
                    onChange={(e) => setSettings({ ...settings, resumption_time: e.target.value + ":00" })}
                  />
                  <p className="text-xs text-muted-foreground">When employees should clock in</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={settings.closing_time?.substring(0, 5) || "17:00"}
                    onChange={(e) => setSettings({ ...settings, closing_time: e.target.value + ":00" })}
                  />
                  <p className="text-xs text-muted-foreground">When employees can clock out</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="gracePeriod">Grace Period (minutes)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  min="0"
                  max="60"
                  value={settings.grace_period_minutes}
                  onChange={(e) =>
                    setSettings({ ...settings, grace_period_minutes: Number.parseInt(e.target.value) || 0 })
                  }
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Time after resumption time before an employee is marked as late
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Deduction Rules
              </CardTitle>
              <CardDescription>Configure automatic salary deductions for attendance violations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latenessDeductionAmount">Lateness Deduction Amount ($)</Label>
                  <Input
                    id="latenessDeductionAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.lateness_deduction_amount}
                    onChange={(e) =>
                      setSettings({ ...settings, lateness_deduction_amount: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Fixed deduction amount for lateness</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latenessDeductionPerMinute">Lateness Deduction Per Minute ($)</Label>
                  <Input
                    id="latenessDeductionPerMinute"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.lateness_deduction_per_minute || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lateness_deduction_per_minute: e.target.value ? Number.parseFloat(e.target.value) : null,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Deduction per minute of lateness (optional)</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="absentDeductionAmount">Absent Deduction Amount ($)</Label>
                <Input
                  id="absentDeductionAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.absent_deduction_amount}
                  onChange={(e) =>
                    setSettings({ ...settings, absent_deduction_amount: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">Deduction for a full day absence</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Verification
              </CardTitle>
              <CardDescription>Configure location-based clock-in verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireLocationVerification">Require Location Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Employees must be within the specified radius to clock in
                  </p>
                </div>
                <Switch
                  id="requireLocationVerification"
                  checked={settings.require_location_verification}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, require_location_verification: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="clockInRadius">Clock-in Radius (meters)</Label>
                <Input
                  id="clockInRadius"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.clock_in_radius_meters}
                  onChange={(e) =>
                    setSettings({ ...settings, clock_in_radius_meters: Number.parseInt(e.target.value) || 100 })
                  }
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum distance from office location for valid clock-in
                </p>
              </div>

              {settings.require_location_verification && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium text-foreground mb-2">Current Radius Visualization</h4>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="relative">
                      <div
                        className="absolute rounded-full border-2 border-primary/30 bg-primary/10"
                        style={{
                          width: `${Math.min(settings.clock_in_radius_meters, 200)}px`,
                          height: `${Math.min(settings.clock_in_radius_meters, 200)}px`,
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Building2 className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Employees must be within {settings.clock_in_radius_meters}m to clock in
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                QR Code Settings
              </CardTitle>
              <CardDescription>Configure QR code refresh interval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qrRefreshInterval">QR Code Refresh Interval (hours)</Label>
                <Input
                  id="qrRefreshInterval"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.qr_code_refresh_interval_hours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      qr_code_refresh_interval_hours: Number.parseInt(e.target.value) || 24,
                    })
                  }
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  How often the QR code should be refreshed (1-168 hours)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company & Profile
              </CardTitle>
              <CardDescription>Manage your company details and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic company info */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={employerEmail}
                    onChange={(e) => setEmployerEmail(e.target.value)}
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                />
              </div>

              <Separator />

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input
                  id="companyAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    id="companyCity"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyState">State</Label>
                  <Input
                    id="companyState"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCountry">Country</Label>
                  <Input
                    id="companyCountry"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company ID</Label>
                <div className="flex items-center gap-2">
                  <Input value={employerId} disabled className="font-mono bg-muted" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(employerId)}
                    className="bg-transparent"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">This ID is used to link QR codes to your organization</p>
              </div>

              <Separator />

              {/* Office location */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Office Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Set the office location for location-based clock-in verification
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={latitude ?? ""}
                      onChange={(e) => setLatitude(e.target.value ? Number.parseFloat(e.target.value) : null)}
                      placeholder="e.g., 6.5244"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={longitude ?? ""}
                      onChange={(e) => setLongitude(e.target.value ? Number.parseFloat(e.target.value) : null)}
                      placeholder="e.g., 3.3792"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="w-full sm:w-auto"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    {locationLoading ? "Getting Location..." : "Get Current Location"}
                  </Button>
                  {locationError && <p className="text-sm text-destructive">{locationError}</p>}
                  {latitude && longitude && !locationError && (
                    <p className="text-sm text-muted-foreground">
                      Location set: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Logo */}
              <div className="space-y-2">
                <Label htmlFor="companyLogoUrl">Logo URL</Label>
                <Input
                  id="companyLogoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-muted-foreground">URL to your company logo image</p>
                {logoUrl && (
                  <div className="mt-2">
                    <img
                      src={logoUrl}
                      alt="Company logo preview"
                      className="h-20 w-20 object-contain rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Account owner */}
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Your Email</Label>
                <Input id="userEmail" type="email" value={userEmail} disabled className="bg-muted" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveCompany} disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when you receive email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lateNotifications">Late Arrival Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when employees arrive late</p>
                </div>
                <Switch
                  id="lateNotifications"
                  checked={notifications.lateNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, lateNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyReport">Daily Report</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily attendance summary</p>
                </div>
                <Switch
                  id="dailyReport"
                  checked={notifications.dailyReport}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReport: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReport">Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">Receive a weekly attendance summary</p>
                </div>
                <Switch
                  id="weeklyReport"
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
