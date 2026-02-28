import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all employees with attendance counts
router.get("/employees", async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            where: { isActive: true },
            include: {
                attendances: {
                    orderBy: { date: 'desc' },
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate counts for each employee
        const formattedEmployees = employees.map(emp => {
            const counts = emp.attendances.reduce((acc, att) => {
                const status = att.status?.toUpperCase();
                if (status === "PRESENT") acc.present++;
                else if (status === "ABSENT") acc.absent++;
                else if (status === "HALF_DAY") acc.halfDay++;
                return acc;
            }, { present: 0, absent: 0, halfDay: 0 });

            return {
                ...emp,
                counts,
                recentAttendances: emp.attendances.slice(0, 30) // Only send back last 30
            };
        });

        res.json(formattedEmployees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
});

// Add new employee
router.post("/employees", async (req, res) => {
    try {
        const { name, phone, role } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Check for unique phone number if provided
        if (phone) {
            const existing = await prisma.employee.findUnique({
                where: { phone }
            });
            if (existing) {
                return res.status(400).json({ message: "Employee with this phone number already exists" });
            }
        }

        const employee = await prisma.employee.create({
            data: {
                name,
                phone,
                role: role || "Staff"
            }
        });

        res.status(201).json({ message: "Employee added successfully", employee });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});

// Mark/Update attendance
router.post("/", async (req, res) => {
    try {
        const { employeeId, status, date } = req.body;

        if (!employeeId || !status) {
            return res.status(400).json({ message: "Employee ID and Status are required" });
        }

        const id = parseInt(employeeId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        const attendanceDate = date ? new Date(date) : new Date();
        if (isNaN(attendanceDate.getTime())) {
            return res.status(400).json({ message: "Invalid Date format" });
        }

        // Zero out the time to compare dates only
        const targetDate = new Date(attendanceDate);
        targetDate.setHours(0, 0, 0, 0);

        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Check if attendance already exists for this day
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                employeeId: id,
                date: {
                    gte: targetDate,
                    lt: nextDate
                }
            }
        });

        let attendance;
        if (existingAttendance) {
            // Update existing record
            attendance = await prisma.attendance.update({
                where: { id: existingAttendance.id },
                data: { status: status.toUpperCase() }
            });
        } else {
            // Create new record
            attendance = await prisma.attendance.create({
                data: {
                    employeeId: id,
                    status: status.toUpperCase(),
                    date: targetDate
                }
            });
        }

        res.status(existingAttendance ? 200 : 201).json({
            message: existingAttendance ? "Attendance updated" : "Attendance recorded",
            attendance
        });
    } catch (error) {
        console.error("Error recording attendance:", error);
        res.status(500).json({ message: "Error recording attendance", error: error.message });
    }
});

// Remove/deactivate employee
router.delete("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const empId = parseInt(id);

        if (isNaN(empId)) {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        // Soft delete - mark as inactive
        const employee = await prisma.employee.update({
            where: { id: empId },
            data: { isActive: false }
        });

        res.json({
            message: "Employee deactivated successfully",
            employee
        });
    } catch (error) {
        console.error("Error removing employee:", error);
        res.status(500).json({ message: "Error removing employee", error: error.message });
    }
});

// Get attendance records with filters
router.get("/", async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.query;

        let where = {};
        if (employeeId) {
            const id = parseInt(employeeId);
            if (!isNaN(id)) where.employeeId = id;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                const sDate = new Date(startDate);
                if (!isNaN(sDate.getTime())) where.date.gte = sDate;
            }
            if (endDate) {
                const eDate = new Date(endDate);
                if (!isNaN(eDate.getTime())) where.date.lte = eDate;
            }
        }

        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: { id: true, name: true, role: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json(attendances);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
});

export default router;
