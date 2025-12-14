import { createBrowserClient } from "@supabase/ssr"

// Initialize Supabase client
const getSupabaseClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Process clock-in using your existing database function
export async function processClockIn(employeeId: string, employerId: string, latitude: number, longitude: number) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("process_clock_in", {
    p_employee_id: employeeId,
    p_employer_id: employerId,
    p_latitude: latitude,
    p_longitude: longitude,
  })

  if (error) {
    console.error("[v0] Clock-in error:", error)
    return { success: false, error: error.message }
  }

  return data
}

// Process clock-out using your existing database function
export async function processClockOut(employeeId: string, latitude?: number, longitude?: number) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("process_clock_out", {
    p_employee_id: employeeId,
    p_latitude: latitude,
    p_longitude: longitude,
  })

  if (error) {
    console.error("[v0] Clock-out error:", error)
    return { success: false, error: error.message }
  }

  return data
}

// Get attendance summary using your existing database function
export async function getAttendanceSummary(
  employerId: string,
  startDate: string,
  endDate: string,
  employeeId?: string,
) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("get_attendance_summary", {
    p_employer_id: employerId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_employee_id: employeeId || null,
  })

  if (error) {
    console.error("[v0] Attendance summary error:", error)
    return null
  }

  return data
}

// Get today's attendance status
export async function getTodayAttendanceStatus(employeeId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("get_today_attendance_status", {
    p_employee_id: employeeId,
  })

  if (error) {
    console.error("[v0] Today status error:", error)
    return null
  }

  return data
}

export async function createEmployerProfile(
  userId: string,
  companyName: string,
  email: string,
  phone?: string,
  address?: string,
) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("create_employer_profile", {
    p_user_id: userId,
    p_company_name: companyName,
    p_email: email,
    p_phone: phone || null,
    p_address: address || null,
    p_city: null,
    p_state: null,
    p_latitude: null,
    p_longitude: null,
  })

  if (error) {
    console.error("[v0] Create employer profile error:", error)
    return { success: false, error: error.message }
  }

  return data
}

export async function createEmployeeForEmployer(
  employerId: string,
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  department?: string,
  position?: string,
  salary?: number,
) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.rpc("create_employee_for_employer", {
    p_employer_id: employerId,
    p_first_name: firstName,
    p_last_name: lastName,
    p_email: email,
    p_phone: phone || null,
    p_department: department || null,
    p_position: position || null,
    p_salary: salary || 0,
  })

  if (error) {
    console.error("[v0] Create employee error:", error)
    return { success: false, error: error.message }
  }

  return data
}
