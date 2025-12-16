"use client"

import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserPlus, Edit, Trash2, Power } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Employee {
  id: string
  employer_id: string
  user_id: string | null
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  department: string | null
  position: string | null
  salary: number
  is_active: boolean
  created_at: string
}

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Support"]

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employerId, setEmployerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    password: "",
  })

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    setLoading(true)
    try {
      // Get current user
      const {
        data: { user },
      } = await getSupabaseBrowserClient().auth.getUser()

      if (!user) {
        router.push("/sign-in")
        return
      }

      // Get employer record
      const { data: employer, error: employerError } = await getSupabaseBrowserClient()
        .from("employers")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (employerError || !employer) {
        console.error("[v0] Error fetching employer:", employerError)
        return
      }

      setEmployerId(employer.id)

      // Fetch employees
      const { data, error } = await getSupabaseBrowserClient()
        .from("employees")
        .select("*")
        .eq("employer_id", employer.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching employees:", error)
        return
      }

      setEmployees(data || [])
    } catch (error) {
      console.error("[v0] Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async () => {
    if (!formData.firstName || !formData.email || !formData.password || !employerId) {
      toast.error("Please fill in all required fields (First Name, Email, and Password)")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setSubmitting(true)
    try {
      const supabase = getSupabaseBrowserClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      })

      if (authError) {
        toast.error(`Failed to create employee account: ${authError.message}`)
        setSubmitting(false)
        return
      }

      if (!authData.user) {
        toast.error("Failed to create employee account")
        setSubmitting(false)
        return
      }

      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .insert({
          user_id: authData.user.id,
          employer_id: employerId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          department: formData.department || null,
          position: formData.position || null,
          salary: Number.parseFloat(formData.salary) || 0,
          employee_code: `EMP${Date.now().toString().slice(-6)}`,
        })
        .select()
        .single()

      if (employeeError) {
        toast.error(`Failed to create employee: ${employeeError.message}`)
        setSubmitting(false)
        return
      }

      // create user profile for the new employee
      const { error: profileError } = await supabase.from("user_profiles").insert({
        user_id: authData.user.id,
        role: "employee",
        employer_id: employerId,
        employee_id: employeeData.id,
      })

      if (profileError) {
        console.error("[v0] Error creating employee profile:", profileError)
        toast.error("Employee account created, but profile setup failed")
      }

      toast.success(`Employee created successfully!`)

      await loadEmployees()
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        password: "",
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error creating employee:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditEmployee = async () => {
    if (!selectedEmployee || !formData.firstName || !formData.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("employees")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          department: formData.department || null,
          position: formData.position || null,
          salary: Number.parseFloat(formData.salary) || 0,
        })
        .eq("id", selectedEmployee.id)
        .eq("employer_id", employerId)

      if (error) {
        toast.error(`Failed to update employee: ${error.message}`)
        setSubmitting(false)
        return
      }

      toast.success("Employee updated successfully!")

      await loadEmployees()
      setSelectedEmployee(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        password: "",
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error updating employee:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("employees").delete().eq("id", id).eq("employer_id", employerId)

      if (error) {
        toast.error(`Failed to delete employee: ${error.message}`)
        return
      }

      toast.success("Employee deleted successfully!")
      await loadEmployees()
    } catch (error) {
      console.error("[v0] Error deleting employee:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const handleToggleStatus = async (employee: Employee) => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("employees")
        .update({ is_active: !employee.is_active })
        .eq("id", employee.id)

      if (error) {
        toast.error(`Failed to toggle status: ${error.message}`)
        return
      }

      await loadEmployees()
    } catch (error) {
      console.error("[v0] Error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      salary: employee.salary.toString(),
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">{/* Loader component */}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
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
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full sm:w-[180px] border rounded px-4 py-2 mt-4 sm:mt-0"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No employees found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || filterDepartment !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first employee"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
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
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{employee.employee_code}</span>
                      </TableCell>
                      <TableCell>{employee.department || "N/A"}</TableCell>
                      <TableCell>{employee.position || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={employee.is_active ? "default" : "secondary"}>
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(employee)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Create a new employee account with login credentials</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-firstName">First Name *</Label>
                <Input
                  id="add-firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-lastName">Last Name</Label>
                <Input
                  id="add-lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-password">Password *</Label>
              <Input
                id="add-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">This password will be used for employee login</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-department">Department</Label>
                <select
                  id="add-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="border rounded px-4 py-2"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-position">Position</Label>
                <Input
                  id="add-position"
                  placeholder="Software Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-salary">Monthly Salary ($)</Label>
              <Input
                id="add-salary"
                type="number"
                placeholder="5000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee} disabled={submitting}>
              {submitting && <div className="mr-2 h-4 w-4 animate-spin text-primary">Loading...</div>}
              Create Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="border rounded px-4 py-2"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  placeholder="Software Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-salary">Monthly Salary ($)</Label>
              <Input
                id="edit-salary"
                type="number"
                placeholder="5000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee} disabled={submitting}>
              {submitting && <div className="mr-2 h-4 w-4 animate-spin text-primary">Loading...</div>}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
