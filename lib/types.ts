export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployerSettings {
  id: string;
  employer_id: string;
  resumption_time: string;
  closing_time: string;
  grace_period_minutes: number;
  lateness_deduction_amount: number;
  absent_deduction_amount: number;
  lateness_deduction_per_minute: number | null;
  clock_in_radius_meters: number;
  require_location_verification: boolean;
  qr_code_refresh_interval_hours: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  employer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  employee_code: string;
  department: string | null;
  position: string | null;
  salary: number;
  is_active: boolean;
  profile_picture_url: string | null;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employer_id: string;
  attendance_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  clock_in_latitude: number | null;
  clock_in_longitude: number | null;
  clock_out_latitude: number | null;
  clock_out_longitude: number | null;
  is_late: boolean;
  late_minutes: number;
  status: "present" | "late" | "absent" | "half_day";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deduction {
  id: string;
  employee_id: string;
  employer_id: string;
  attendance_id: string | null;
  amount: number;
  reason: "lateness" | "early_leave" | "absence" | "other";
  description: string | null;
  deduction_date: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: "employer" | "employee";
  employer_id: string | null;
  employee_id: string | null;
  push_token: string | null;
  created_at: string;
  updated_at: string;
}
