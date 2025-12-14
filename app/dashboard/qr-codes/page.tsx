"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Search, QrCode } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import QRCode from "react-qr-code"

interface Employee {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  department: string | null
  position: string | null
  status: string
}

interface QRData {
  employerId: string
  companyName: string
  latitude: number | null
  longitude: number | null
  timestamp: number
}

export default function QRCodesPage() {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [companyQRKey, setCompanyQRKey] = useState(Date.now())
  const [employerId, setEmployerId] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get employer data
      const { data: employerData } = await supabase
        .from("employers")
        .select("id, company_name, latitude, longitude")
        .eq("user_id", user.id)
        .single()

      if (employerData) {
        setEmployerId(employerData.id)
        setCompanyName(employerData.company_name)
        setLatitude(employerData.latitude)
        setLongitude(employerData.longitude)

        // Get employees
        const { data: employeesData } = await supabase
          .from("employees")
          .select("*")
          .eq("employer_id", employerData.id)
          .order("employee_number", { ascending: true })

        if (employeesData) {
          setEmployees(employeesData)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateQRData = (employeeId?: string): string => {
    const qrData: QRData = {
      employerId,
      companyName,
      latitude,
      longitude,
      timestamp: Date.now(),
    }

    return JSON.stringify(qrData)
  }

  const downloadQR = (qrData: string, filename: string) => {
    const svg = document.getElementById(filename)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    canvas.width = 400
    canvas.height = 400

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `${filename}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const refreshCompanyQR = () => {
    setCompanyQRKey(Date.now())
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_number.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading QR codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QR Codes</h1>
        <p className="text-muted-foreground">Generate and manage QR codes for attendance tracking</p>
      </div>

      {/* Company QR Code */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Company Clock-In QR Code
              </CardTitle>
              <CardDescription>
                Employees scan this code to clock in/out. Contains geofencing data for location verification.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshCompanyQR}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-border w-fit">
              <QRCode
                id={`company-qr-${companyQRKey}`}
                value={generateQRData()}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">QR Code Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium text-foreground">{companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employer ID:</span>
                    <span className="font-mono text-xs text-foreground">{employerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-foreground">
                      {latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="text-foreground">{new Date(companyQRKey).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="font-medium text-sm text-foreground mb-2">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Employee scans this QR code with their device</li>
                  <li>System verifies employee belongs to this company</li>
                  <li>Location is checked against geofencing radius</li>
                  <li>Clock-in/out is recorded with timestamp</li>
                </ul>
              </div>

              <Button onClick={() => downloadQR(generateQRData(), `company-qr-${companyQRKey}`)} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Employee QR Codes</CardTitle>
          <CardDescription>Generate individual QR codes for each employee</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {employee.first_name} {employee.last_name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {employee.employee_number} • {employee.department || "No Department"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border-2 border-border w-fit mx-auto">
                    <QRCode
                      id={`employee-qr-${employee.id}`}
                      value={generateQRData(employee.id)}
                      size={150}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                  <Badge
                    variant={employee.status === "active" ? "default" : "secondary"}
                    className="w-full justify-center"
                  >
                    {employee.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR(generateQRData(employee.id), `${employee.employee_number}-qr`)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No employees found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
