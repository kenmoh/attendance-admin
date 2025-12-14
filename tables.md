-- =============================================
-- ATTENDANCE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =============================================
-- Migration 001: Create Tables
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE user_role AS ENUM ('employer', 'employee');
CREATE TYPE attendance_status AS ENUM ('present', 'late', 'absent', 'half_day');
CREATE TYPE deduction_reason AS ENUM ('lateness', 'early_leave', 'absence', 'other');

-- =============================================
-- EMPLOYERS TABLE
-- =============================================
-- Stores employer/company information

CREATE TABLE employers (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
company_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20),
address TEXT,
city VARCHAR(100),
state VARCHAR(100),
country VARCHAR(100) DEFAULT 'Nigeria',
-- Office location for QR code and distance verification
latitude DECIMAL(10, 8),
longitude DECIMAL(11, 8),
-- Company logo URL (optional)
logo_url TEXT,
-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_employer_user UNIQUE (user_id)

);

-- =============================================
-- EMPLOYER SETTINGS TABLE
-- =============================================
-- Configurable settings for attendance rules

CREATE TABLE employer_settings (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
-- Work schedule
resumption_time TIME NOT NULL DEFAULT '09:00:00',
closing_time TIME NOT NULL DEFAULT '17:00:00',
-- Lateness configuration
grace_period_minutes INTEGER NOT NULL DEFAULT 15,
lateness_deduction_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
absent_deduction_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
lateness_deduction_per_minute DECIMAL(10, 2) DEFAULT NULL,
-- Location verification
clock_in_radius_meters INTEGER NOT NULL DEFAULT 100,
require_location_verification BOOLEAN DEFAULT TRUE,
-- QR Code settings
qr_code_refresh_interval_hours INTEGER DEFAULT 24,
-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_employer_settings UNIQUE (employer_id)

);

-- =============================================
-- EMPLOYEES TABLE
-- =============================================
-- Stores employee information linked to employers

CREATE TABLE employees (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
-- Personal information
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL,
phone VARCHAR(20),
-- Employment details
employee_code VARCHAR(20) NOT NULL,
department VARCHAR(100),
position VARCHAR(100),
salary DECIMAL(12, 2) DEFAULT 0.00,
-- Status
is_active BOOLEAN DEFAULT TRUE,
-- Profile picture URL (optional)
profile_picture_url TEXT,
-- Timestamps
hire_date DATE DEFAULT CURRENT_DATE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_employee_user UNIQUE (user_id),
    CONSTRAINT unique_employee_code_per_employer UNIQUE (employer_id, employee_code)

);

-- =============================================
-- ATTENDANCE RECORDS TABLE
-- =============================================
-- Daily attendance records for each employee

CREATE TABLE attendance_records (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
-- Date of attendance
attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
-- Clock in/out times
clock_in_time TIMESTAMP WITH TIME ZONE,
clock_out_time TIMESTAMP WITH TIME ZONE,
-- Location data at clock-in
clock_in_latitude DECIMAL(10, 8),
clock_in_longitude DECIMAL(11, 8),
clock_in_distance_meters INTEGER,
-- Location data at clock-out (optional)
clock_out_latitude DECIMAL(10, 8),
clock_out_longitude DECIMAL(11, 8),
-- Lateness tracking
is_late BOOLEAN DEFAULT FALSE,
late_minutes INTEGER DEFAULT 0,
-- Status
status attendance_status DEFAULT 'present',
-- Notes
notes TEXT,
-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one record per employee per day
    CONSTRAINT unique_daily_attendance UNIQUE (employee_id, attendance_date)

);

-- =============================================
-- DEDUCTIONS TABLE
-- =============================================
-- Records of salary deductions

CREATE TABLE deductions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
attendance_id UUID REFERENCES attendance_records(id) ON DELETE SET NULL,
-- Deduction details
amount DECIMAL(10, 2) NOT NULL,
reason deduction_reason NOT NULL DEFAULT 'lateness',
description TEXT,
-- Date
deduction_date DATE NOT NULL DEFAULT CURRENT_DATE,
-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER PROFILES TABLE
-- =============================================
-- Extended user profile for auth.users

CREATE TABLE user_profiles (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
role user_role NOT NULL,
-- Reference to either employer or employee
employer_id UUID REFERENCES employers(id) ON DELETE SET NULL,
employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
-- Push notification token
push_token TEXT,
-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_user_profile UNIQUE (user_id)

);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Employers
CREATE INDEX idx_employers_user_id ON employers(user_id);

-- Employees
CREATE INDEX idx_employees_employer_id ON employees(employer_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);

-- Attendance Records
CREATE INDEX idx_attendance_employee_id ON attendance_records(employee_id);
CREATE INDEX idx_attendance_employer_id ON attendance_records(employer_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, attendance_date);

-- Deductions
CREATE INDEX idx_deductions_employee_id ON deductions(employee_id);
CREATE INDEX idx_deductions_employer_id ON deductions(employer_id);
CREATE INDEX idx_deductions_date ON deductions(deduction_date);

-- User Profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
language 'plpgsql';

CREATE TRIGGER update_employers_updated_at
    BEFORE UPDATE ON employers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_settings_updated_at
    BEFORE UPDATE ON employer_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
$$
