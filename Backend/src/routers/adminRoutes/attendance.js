import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all employees
router.get("/employees", async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                attendances: {
                    orderBy: { date: 'desc' },
                    take: 30 // Last 30 attendance records
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(employees);
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

        const employee = await prisma.employee.create({
            data: {
                name,
                phone,
                role: role || "Staff"
            }
        });

        res.status(201).json({
            message: "Employee added successfully",
            employee
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});

// Remove/deactivate employee
router.delete("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete - mark as inactive
        const employee = await prisma.employee.update({
            where: { id: parseInt(id) },
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

// Mark attendance
router.post("/", async (req, res) => {
    try {
        const { employeeId, isPresent, date } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const attendance = await prisma.attendance.create({
            data: {
                employeeId: parseInt(employeeId),
                isPresent: isPresent !== undefined ? isPresent : true,
                date: date ? new Date(date) : new Date()
            }
        });

        res.status(201).json({
            message: "Attendance recorded",
            attendance
        });
    } catch (error) {
        console.error("Error recording attendance:", error);
        res.status(500).json({ message: "Error recording attendance", error: error.message });
    }
});

// Get attendance records with filters
router.get("/", async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.query;

        let where = {};
        if (employeeId) where.employeeId = parseInt(employeeId);
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
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
