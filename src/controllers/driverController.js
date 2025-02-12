const pool = require("../../config/db");
const { checkPrivilege } = require('../helpers/jwtHelperFunctions');

// Get all drivers with pagination
const getAllDrivers = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        const [drivers] = await pool.query("SELECT * FROM Drivers ORDER BY driver_name ASC LIMIT ? OFFSET ?", [limit, offset]);

        res.json(drivers);
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};

// Get available drivers
const getAvailableDrivers = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const [drivers] = await pool.query("SELECT * FROM Drivers WHERE status = 'available'");
        res.json(drivers);
    } catch (error) {
        console.error("Error fetching available drivers:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};

// Get single driver by name
const getDriverByName = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const searchDriver = req.query.driver_name;
        const [driver] = await pool.query("SELECT * FROM Drivers WHERE driver_name = ?", [searchDriver]);
        if (driver.length === 0) return res.status(404).json({ error: "Driver not found" });
        res.json(driver[0]);
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({ error: "Database query failed" });
    }
};

// Create new driver
const createDriver = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const { driver_name, contact_number } = req.body;
        const [result] = await pool.query(
            "INSERT INTO Drivers (driver_name, contact_number) VALUES (?, ?)",
            [driver_name, contact_number]
        );
        res.json({ message: "Driver added", driver_id: result.insertId });
    } catch (error) {
        console.error("Error adding driver:", error);
        res.status(500).json({ error: "Database insert failed" });
    }
};

// Update driver
const updateDriver = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const { driver_id, driver_name, contact_number } = req.body;
        const [result] = await pool.query(
            "UPDATE Drivers SET driver_name = ?, contact_number = ? WHERE driver_id = ?",
            [driver_name, contact_number, driver_id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Driver not found" });
        res.json({ message: "Driver updated" });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ error: "Database update failed" });
    }
};

// Delete driver
const deleteDriver = async (req, res) => {
    try {
        checkPrivilege(req, res, ['Admin']);

        const { driver_id } = req.body;
        const [result] = await pool.query("DELETE FROM Drivers WHERE driver_id = ?", [driver_id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Driver not found" });
        res.json({ message: "Driver deleted" });
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).json({ error: "Database delete failed" });
    }
};

module.exports = {
    getAllDrivers,
    getDriverByName,
    createDriver,
    updateDriver,
    deleteDriver,
    getAvailableDrivers
};