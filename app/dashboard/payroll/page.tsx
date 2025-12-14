"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, TrendingDown, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Employee, EmployerSettings } from "@/lib/types"

interface PayrollData {
  employee: Employee
  latenessCount: number
  totalLateMinutes: number
  baseDeduction: number
  perMinuteDeduction: number
  totalDeductions: number
  netSalary: number
}

export default function PayrollPage() {
  const [payrollData, setPayrollData] = useState<PayrollData[]>([])
  const [filteredData, setFilteredData] = useState<PayrollData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [settings, setSettings] = useState<EmployerSettings | null>(null)

  useEffect(() => {
    fetchPayrollData()
  }, [selectedMonth])

  useEffect(() => {
    if (searchQuery) {
      const filtered = payrollData.filter(
        (item) =>
          item.employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.employee.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.employee.department?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(payrollData)
    }
  }, [searchQuery, payrollData])

  const fetchPayrollData = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseBrowserClient()

      // Get current user and employer
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: employer } = await supabase.from("employers").select("id").eq("user_id", user.id).single()

      if (!employer) return

      // Fetch employer settings
      const { data: settingsData } = await supabase
        .from("employer_settings")
        .select("*")
        .eq("employer_id", employer.id)
        .single()

      setSettings(settingsData)

      // Fetch all active employees
      const { data: employees, error: employeesError } = await supabase
        .from("employees")
        .select("*")
        .eq("employer_id", employer.id)
        .eq("is_active", true)
        .order("first_name")

      if (employeesError) throw employeesError

      // Calculate date range for selected month
      const startDate = `${selectedMonth}-01`
      const endDate = new Date(selectedMonth + "-01")
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(0)
      const endDateStr = endDate.toISOString().slice(0, 10)

      // Fetch attendance records for the month
      const { data: attendanceRecords } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("employer_id", employer.id)
        .gte("attendance_date", startDate)
        .lte("attendance_date", endDateStr)

      // Fetch deductions for the month
      const { data: deductions } = await supabase
        .from("deductions")
        .select("*")
        .eq("employer_id", employer.id)
        .gte("deduction_date", startDate)
        .lte("deduction_date", endDateStr)

      // Calculate payroll for each employee
      const payroll: PayrollData[] = employees.map((employee) => {
        const employeeAttendance = attendanceRecords?.filter((a) => a.employee_id === employee.id) || []
        const employeeDeductions = deductions?.filter((d) => d.employee_id === employee.id) || []

        const latenessCount = employeeAttendance.filter((a) => a.is_late).length
        const totalLateMinutes = employeeAttendance.reduce((sum, a) => sum + (a.late_minutes || 0), 0)

        // Calculate deductions
        let baseDeduction = 0
        let perMinuteDeduction = 0

        if (settingsData) {
          baseDeduction = latenessCount * settingsData.lateness_deduction_amount
          if (settingsData.lateness_deduction_per_minute) {
            perMinuteDeduction = totalLateMinutes * settingsData.lateness_deduction_per_minute
          }
        }

        const otherDeductions = employeeDeductions.reduce((sum, d) => sum + Number(d.amount), 0)
        const totalDeductions = baseDeduction + perMinuteDeduction + otherDeductions
        const netSalary = Number(employee.salary) - totalDeductions

        return {
          employee,
          latenessCount,
          totalLateMinutes,
          baseDeduction,
          perMinuteDeduction,
          totalDeductions,
          netSalary,
        }
      })

      setPayrollData(payroll)
      setFilteredData(payroll)
    } catch (error) {
      console.error("[v0] Error fetching payroll data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportPayroll = () => {
    // Create CSV content
    const headers = [
      "Employee Code",
      "Name",
      "Department",
      "Position",
      "Base Salary",
      "Lateness Count",
      "Late Minutes",
      "Base Deductions",
      "Per-Minute Deductions",
      "Total Deductions",
      "Net Salary",
    ]

    const rows = filteredData.map((item) => [
      item.employee.employee_code,
      `${item.employee.first_name} ${item.employee.last_name}`,
      item.employee.department || "N/A",
      item.employee.position || "N/A",
      item.employee.salary.toFixed(2),
      item.latenessCount,
      item.totalLateMinutes,
      item.baseDeduction.toFixed(2),
      item.perMinuteDeduction.toFixed(2),
      item.totalDeductions.toFixed(2),
      item.netSalary.toFixed(2),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payroll-${selectedMonth}.csv`
    a.click()
  }

  const totalBaseSalary = filteredData.reduce((sum, item) => sum + Number(item.employee.salary), 0)
  const totalDeductions = filteredData.reduce((sum, item) => sum + item.totalDeductions, 0)
  const totalNetSalary = filteredData.reduce((sum, item) => sum + item.netSalary, 0)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">View and manage employee salary and deductions</p>
        </div>
        <Button onClick={exportPayroll} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Base Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalBaseSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredData.length} employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">₦{totalDeductions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From lateness & penalties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Payable</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalNetSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After all deductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Month:</label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-[180px]"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll</CardTitle>
          <CardDescription>
            Showing payroll summary for{" "}
            {new Date(selectedMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No payroll data</h3>
              <p className="text-sm text-muted-foreground">No employee records found for this month.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead className="text-center">Lateness</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.employee.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.employee.first_name} {item.employee.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.employee.employee_code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{item.employee.department || "N/A"}</span>
                          <span className="text-xs text-muted-foreground">{item.employee.position || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₦{Number(item.employee.salary).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant={item.latenessCount > 0 ? "destructive" : "secondary"}>
                            {item.latenessCount}x late
                          </Badge>
                          {item.totalLateMinutes > 0 && (
                            <span className="text-xs text-muted-foreground">{item.totalLateMinutes} mins</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-destructive">
                            -₦{item.totalDeductions.toLocaleString()}
                          </span>
                          {item.totalDeductions > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.baseDeduction > 0 && <div>Base: ₦{item.baseDeduction.toFixed(0)}</div>}
                              {item.perMinuteDeduction > 0 && <div>Per min: ₦{item.perMinuteDeduction.toFixed(0)}</div>}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₦{item.netSalary.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deduction Settings Info */}
      {settings && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-sm">Current Deduction Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Base deduction per lateness:</span>{" "}
                <span className="font-medium">₦{settings.lateness_deduction_amount}</span>
              </div>
              {settings.lateness_deduction_per_minute && (
                <div>
                  <span className="text-muted-foreground">Per-minute deduction:</span>{" "}
                  <span className="font-medium">₦{settings.lateness_deduction_per_minute}/min</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Grace period:</span>{" "}
                <span className="font-medium">{settings.grace_period_minutes} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
