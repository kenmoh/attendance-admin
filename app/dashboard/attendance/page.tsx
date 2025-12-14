"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarIcon, Search, Download, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Employee, AttendanceRecord } from "@/lib/types"

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: employerData } = await supabase.from("employers").select("id").eq("user_id", user.id).single()

        if (!employerData) return

        setEmployerId(employerData.id)

        const { data: employeesData } = await supabase
          .from("employees")
          .select("*")
          .eq("employer_id", employerData.id)
          .order("created_at", { ascending: false })

        if (employeesData) setEmployees(employeesData)

        const dateStr = format(selectedDate, "yyyy-MM-dd")
        const { data: attendanceData } = await supabase
          .from("attendance_records")
          .select("*")
          .eq("employer_id", employerData.id)
          .eq("attendance_date", dateStr)
          .order("created_at", { ascending: false })

        if (attendanceData) setAttendance(attendanceData)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedDate])

  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const getAttendanceForDate = () => {
    const dateAttendance = attendance.filter((a) => a.attendance_date === dateStr)

    return employees.map((emp) => {
      const record = dateAttendance.find((a) => a.employee_id === emp.id)
      return {
        employee: emp,
        record: record || null,
      }
    })
  }

  const attendanceData = getAttendanceForDate()

  const filteredData = attendanceData.filter(({ employee, record }) => {
    const matchesSearch =
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_code.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "present") return matchesSearch && record?.status === "present"
    if (statusFilter === "late") return matchesSearch && record?.status === "late"
    if (statusFilter === "absent") return matchesSearch && !record

    return matchesSearch
  })

  const stats = {
    present: attendanceData.filter(({ record }) => record?.status === "present").length,
    late: attendanceData.filter(({ record }) => record?.status === "late").length,
    absent: attendanceData.filter(({ record }) => !record).length,
  }

  const getStatusBadge = (record: AttendanceRecord | null) => {
    if (!record) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Absent
        </Badge>
      )
    }
    if (record.status === "late") {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-3 w-3" />
          Late ({record.late_minutes}min)
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3" />
        Present
      </Badge>
    )
  }

  const exportToCSV = () => {
    const headers = [
      "Employee Code",
      "Name",
      "Department",
      "Clock In",
      "Clock Out",
      "Status",
      "Late Minutes",
    ]
    const rows = filteredData.map(({ employee, record }) => [
      employee.employee_code,
      `${employee.first_name} ${employee.last_name}`,
      employee.department || "N/A",
      record?.clock_in_time ? new Date(record.clock_in_time).toLocaleTimeString() : "-",
      record?.clock_out_time ? new Date(record.clock_out_time).toLocaleTimeString() : "-",
      record?.status || "absent",
      record?.late_minutes || 0,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-${dateStr}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading attendance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Track daily attendance records</p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.present}</p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.late}</p>
                <p className="text-sm text-muted-foreground">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left sm:w-[200px] bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Showing attendance for {format(selectedDate, "MMMM d, yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No employees yet</h3>
              <p className="text-muted-foreground mt-1">Add employees to start tracking attendance.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Deduction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map(({ employee, record }) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {employee.first_name[0]}
                              {employee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{employee.employee_code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department || "N/A"}</TableCell>
                      <TableCell>
                        {record?.clock_in_time ? (
                          <span className="font-mono text-sm">
                            {new Date(record.clock_in_time).toLocaleTimeString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record?.clock_out_time ? (
                          <span className="font-mono text-sm">
                            {new Date(record.clock_out_time).toLocaleTimeString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record)}</TableCell>
                      <TableCell className="text-right">
                        {record?.late_minutes ? (
                          <span className="text-sm text-muted-foreground">{record.late_minutes} min</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
