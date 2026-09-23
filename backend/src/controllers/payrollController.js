const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| PAYROLL CALCULATION
|--------------------------------------------------------------------------
*/

const calculatePayroll = ({
    basic_salary = 0,

    house_allowance = 0,
    transport_allowance = 0,
    other_allowance = 0,

    allowances = 0,
    overtime = 0,
    bonus = 0,

    tax_deduction = 0,
    loan_deduction = 0,
    late_deduction = 0,
    unpaid_leave_deduction = 0,
    advance_deduction = 0,
    other_deduction = 0,
}) => {
    const basic = Number(basic_salary) || 0;

    const house = Number(house_allowance) || 0;
    const transport = Number(transport_allowance) || 0;
    const otherAllowance =
        Number(other_allowance) || 0;

    const existingAllowances =
        Number(allowances) || 0;

    const overtimeAmount =
        Number(overtime) || 0;

    const bonusAmount =
        Number(bonus) || 0;

    /*
    |--------------------------------------------------------------------------
    | Total Allowances
    |--------------------------------------------------------------------------
    */

    const totalAllowances =
        house +
        transport +
        otherAllowance +
        existingAllowances;

    /*
    |--------------------------------------------------------------------------
    | Gross Salary
    |--------------------------------------------------------------------------
    */

    const grossSalary =
        basic +
        totalAllowances +
        overtimeAmount +
        bonusAmount;

    /*
    |--------------------------------------------------------------------------
    | Deductions
    |--------------------------------------------------------------------------
    */

    const tax =
        Number(tax_deduction) || 0;

    const loan =
        Number(loan_deduction) || 0;

    const late =
        Number(late_deduction) || 0;

    const unpaid =
        Number(unpaid_leave_deduction) || 0;

    const advance =
        Number(advance_deduction) || 0;

    const otherDeduction =
        Number(other_deduction) || 0;

    const totalDeduction =
        tax +
        loan +
        late +
        unpaid +
        advance +
        otherDeduction;

    /*
    |--------------------------------------------------------------------------
    | Net Salary
    |--------------------------------------------------------------------------
    */

    const netSalary =
        grossSalary -
        totalDeduction;

    return {
        total_allowances: totalAllowances,
        gross_salary: grossSalary,
        total_deduction: totalDeduction,
        net_salary: netSalary,
    };
};


/*
|--------------------------------------------------------------------------
| GET ALL PAYROLL
|--------------------------------------------------------------------------
*/

const getPayroll = async (req, res) => {
    try {
        const {
            month,
            year,
            department_id,
            search,
            status,
        } = req.query;

        let query = `
            SELECT
                p.id,
                p.employee_id,
                p.payroll_month,

                p.basic_salary,

                p.allowances,
                p.overtime,
                p.bonus,

                p.deductions,
                p.tax,
                p.net_salary,

                p.payment_status,
                p.payment_date,
                p.payment_method,

                p.house_allowance,
                p.transport_allowance,
                p.other_allowance,

                p.gross_salary,

                p.tax_deduction,
                p.loan_deduction,
                p.late_deduction,
                p.unpaid_leave_deduction,
                p.advance_deduction,
                p.other_deduction,
                p.total_deduction,

                p.notes,
                p.created_at,
                p.updated_at,

                e.employee_code,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.position,
                e.salary,

                d.id AS department_id,
                d.name AS department_name

            FROM payroll p

            INNER JOIN employees e
                ON p.employee_id = e.id

            LEFT JOIN departments d
                ON e.department_id = d.id

            WHERE 1 = 1
        `;

        const params = [];

        /*
        |--------------------------------------------------------------------------
        | MONTH
        |--------------------------------------------------------------------------
        */

        if (month) {
            query += `
                AND MONTH(p.payroll_month) = ?
            `;

            params.push(Number(month));
        }

        /*
        |--------------------------------------------------------------------------
        | YEAR
        |--------------------------------------------------------------------------
        */

        if (year) {
            query += `
                AND YEAR(p.payroll_month) = ?
            `;

            params.push(Number(year));
        }

        /*
        |--------------------------------------------------------------------------
        | DEPARTMENT
        |--------------------------------------------------------------------------
        */

        if (department_id) {
            query += `
                AND e.department_id = ?
            `;

            params.push(department_id);
        }

        /*
        |--------------------------------------------------------------------------
        | PAYMENT STATUS
        |--------------------------------------------------------------------------
        */

        if (status) {
            query += `
                AND p.payment_status = ?
            `;

            params.push(status);
        }

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if (search) {
            query += `
                AND (
                    e.first_name LIKE ?
                    OR e.last_name LIKE ?
                    OR e.employee_code LIKE ?
                    OR e.email LIKE ?
                )
            `;

            const searchValue =
                `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ORDER
        |--------------------------------------------------------------------------
        */

        query += `
            ORDER BY
                p.payroll_month DESC,
                e.first_name ASC
        `;

        const [rows] =
            await pool.execute(
                query,
                params
            );

        return res.status(200).json({
            success: true,
            payroll: rows,
        });

    } catch (error) {
        console.error(
            "Get payroll error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load payroll",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| GET PAYROLL BY ID
|--------------------------------------------------------------------------
*/

const getPayrollById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] =
            await pool.execute(
                `
                SELECT
                    p.*,

                    e.employee_code,
                    e.first_name,
                    e.last_name,
                    e.email,
                    e.phone,
                    e.position,
                    e.salary,

                    d.id AS department_id,
                    d.name AS department_name

                FROM payroll p

                INNER JOIN employees e
                    ON p.employee_id = e.id

                LEFT JOIN departments d
                    ON e.department_id = d.id

                WHERE p.id = ?

                LIMIT 1
                `,
                [id]
            );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Payroll record not found",
            });
        }

        return res.status(200).json({
            success: true,
            payroll: rows[0],
        });

    } catch (error) {
        console.error(
            "Get payroll by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load payroll",
            error: error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| CREATE PAYROLL
|--------------------------------------------------------------------------
*/

const createPayroll = async (req, res) => {
    const connection =
        await pool.getConnection();

    try {

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        | req.body || {} prevents:
        | Cannot destructure property 'employee_id'
        |--------------------------------------------------------------------------
        */

        const body = req.body || {};

        const {
            employee_id,
            payroll_month,

            house_allowance = 0,
            transport_allowance = 0,
            other_allowance = 0,

            allowances = 0,
            overtime = 0,
            bonus = 0,

            tax_deduction = 0,
            loan_deduction = 0,

            late_deduction = null,
            unpaid_leave_deduction = null,

            advance_deduction = 0,
            other_deduction = 0,

            notes = null,
        } = body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee ID is required",
            });
        }

        if (!payroll_month) {
            return res.status(400).json({
                success: false,
                message:
                    "Payroll month is required",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | VALIDATE DATE
        |--------------------------------------------------------------------------
        */

        const payrollDate =
            new Date(payroll_month);

        if (
            Number.isNaN(
                payrollDate.getTime()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payroll month. Use YYYY-MM-DD",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | GET EMPLOYEE
        |--------------------------------------------------------------------------
        */

        const [employees] =
            await connection.execute(
                `
                SELECT
                    id,
                    employee_code,
                    first_name,
                    last_name,
                    salary,
                    status

                FROM employees

             WHERE employee_code = ?

                LIMIT 1
                `,
                [employee_id]
            );


        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee not found",
            });
        }


        const employee =
            employees[0];


        /*
        |--------------------------------------------------------------------------
        | CHECK EMPLOYEE STATUS
        |--------------------------------------------------------------------------
        */

        if (
            employee.status &&
            employee.status !== "Active"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payroll can only be created for an active employee",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | BASIC SALARY
        |--------------------------------------------------------------------------
        */

        const basic_salary =
            Number(employee.salary) || 0;


        /*
        |--------------------------------------------------------------------------
        | PREVENT DUPLICATE PAYROLL
        |--------------------------------------------------------------------------
        */

        const [existing] =
            await connection.execute(
                `
                SELECT
                    id

                FROM payroll

                WHERE employee_id = ?

                AND payroll_month = ?

                LIMIT 1
                `,
                [
                    employee_id,
                    payroll_month,
                ]
            );


        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Payroll already exists for this employee for this month",
                payrollId:
                    existing[0].id,
            });
        }


        /*
        |--------------------------------------------------------------------------
        | AUTOMATIC LATE DEDUCTION
        |--------------------------------------------------------------------------
        */

        let automaticLateDeduction = 0;
        let lateCount = 0;


        /*
        |--------------------------------------------------------------------------
        | If HR manually sends late_deduction,
        | use that amount.
        |
        | Otherwise automatically calculate:
        | 500 PKR × late days
        |--------------------------------------------------------------------------
        */

        if (late_deduction !== null) {

            automaticLateDeduction =
                Number(
                    late_deduction
                ) || 0;

        } else {

            try {

                const [lateRows] =
                    await connection.execute(
                        `
                        SELECT
                            COUNT(*) AS late_count

                        FROM attendance

                        WHERE employee_id = ?

                        AND MONTH(attendance_date)
                            = MONTH(?)

                        AND YEAR(attendance_date)
                            = YEAR(?)

                        AND status = 'Late'
                        `,
                        [
                            employee_id,
                            payroll_month,
                            payroll_month,
                        ]
                    );


                lateCount =
                    Number(
                        lateRows[0]?.late_count ||
                        0
                    );


                /*
                |--------------------------------------------------------------------------
                | Late policy
                |--------------------------------------------------------------------------
                */

                automaticLateDeduction =
                    lateCount * 500;

            } catch (attendanceError) {

                console.log(
                    "Late deduction skipped:",
                    attendanceError.message
                );

                automaticLateDeduction = 0;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | AUTOMATIC UNPAID LEAVE DEDUCTION
        |--------------------------------------------------------------------------
        */

        let automaticUnpaidLeaveDeduction = 0;
        let unpaidDays = 0;


        /*
        |--------------------------------------------------------------------------
        | If manually provided, use it.
        | Otherwise calculate automatically.
        |--------------------------------------------------------------------------
        */

        if (
            unpaid_leave_deduction !== null
        ) {

            automaticUnpaidLeaveDeduction =
                Number(
                    unpaid_leave_deduction
                ) || 0;

        } else {

            try {

                const [leaveRows] =
                    await connection.execute(
                        `
                        SELECT

                            COALESCE(
                                SUM(total_days),
                                0
                            ) AS unpaid_days

                        FROM leaves

                        WHERE employee_id = ?

                        AND MONTH(start_date)
                            = MONTH(?)

                        AND YEAR(start_date)
                            = YEAR(?)

                        AND status = 'Approved'

                        AND (
                            leave_type = 'Unpaid'

                            OR

                            leave_type =
                                'Unpaid Leave'
                        )
                        `,
                        [
                            employee_id,
                            payroll_month,
                            payroll_month,
                        ]
                    );


                unpaidDays =
                    Number(
                        leaveRows[0]?.unpaid_days ||
                        0
                    );


                /*
                |--------------------------------------------------------------------------
                | Daily salary
                |--------------------------------------------------------------------------
                */

                const dailySalary =
                    basic_salary / 30;


                automaticUnpaidLeaveDeduction =
                    unpaidDays *
                    dailySalary;

            } catch (leaveError) {

                console.log(
                    "Unpaid leave deduction skipped:",
                    leaveError.message
                );

                automaticUnpaidLeaveDeduction =
                    0;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | CALCULATE PAYROLL
        |--------------------------------------------------------------------------
        */

        const calculation =
            calculatePayroll({

                basic_salary,

                house_allowance,
                transport_allowance,
                other_allowance,

                allowances,
                overtime,
                bonus,

                tax_deduction,

                loan_deduction,

                late_deduction:
                    automaticLateDeduction,

                unpaid_leave_deduction:
                    automaticUnpaidLeaveDeduction,

                advance_deduction,

                other_deduction,
            });


        /*
        |--------------------------------------------------------------------------
        | START TRANSACTION
        |--------------------------------------------------------------------------
        */

        await connection.beginTransaction();


        /*
        |--------------------------------------------------------------------------
        | INSERT PAYROLL
        |--------------------------------------------------------------------------
        */

        const [result] =
            await connection.execute(
                `
                INSERT INTO payroll
                (
                    employee_id,
                    payroll_month,

                    basic_salary,

                    allowances,
                    overtime,
                    bonus,

                    deductions,
                    tax,
                    net_salary,

                    payment_status,

                    house_allowance,
                    transport_allowance,
                    other_allowance,

                    gross_salary,

                    tax_deduction,
                    loan_deduction,
                    late_deduction,
                    unpaid_leave_deduction,
                    advance_deduction,
                    other_deduction,

                    total_deduction,

                    notes
                )

                VALUES
                (
                    ?,
                    ?,

                    ?,

                    ?,
                    ?,
                    ?,

                    ?,
                    ?,
                    ?,

                    'Pending',

                    ?,
                    ?,
                    ?,

                    ?,

                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,

                    ?,

                    ?
                )
                `,
                [

                    employee_id,
                    payroll_month,

                    basic_salary,

                    allowances,
                    overtime,
                    bonus,

                    calculation.total_deduction,

                    tax_deduction,

                    calculation.net_salary,

                    house_allowance,
                    transport_allowance,
                    other_allowance,

                    calculation.gross_salary,

                    tax_deduction,
                    loan_deduction,

                    automaticLateDeduction,

                    automaticUnpaidLeaveDeduction,

                    advance_deduction,

                    other_deduction,

                    calculation.total_deduction,

                    notes,
                ]
            );


        /*
        |--------------------------------------------------------------------------
        | COMMIT
        |--------------------------------------------------------------------------
        */

        await connection.commit();


        /*
        |--------------------------------------------------------------------------
        | SUCCESS RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Payroll created successfully",

            payrollId:
                result.insertId,

            employee: {
                id: employee.id,
                employee_code:
                    employee.employee_code,
                name:
                    `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
            },

            calculation: {

                basic_salary,

                total_allowances:
                    calculation.total_allowances,

                gross_salary:
                    calculation.gross_salary,

                late_count:
                    lateCount,

                late_deduction:
                    automaticLateDeduction,

                unpaid_leave_days:
                    unpaidDays,

                unpaid_leave_deduction:
                    automaticUnpaidLeaveDeduction,

                total_deduction:
                    calculation.total_deduction,

                net_salary:
                    calculation.net_salary,
            },
        });

    } catch (error) {

        /*
        |--------------------------------------------------------------------------
        | ROLLBACK
        |--------------------------------------------------------------------------
        */

        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError.message
            );
        }


        console.error(
            "Create payroll error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create payroll",

            error:
                error.message,
        });

    } finally {

        connection.release();
    }
};


/*
|--------------------------------------------------------------------------
| UPDATE PAYROLL
|--------------------------------------------------------------------------
*/

const updatePayroll = async (req, res) => {

    try {

        const { id } =
            req.params;

        const body =
            req.body || {};

        const {

            house_allowance = 0,
            transport_allowance = 0,
            other_allowance = 0,

            allowances = 0,
            overtime = 0,
            bonus = 0,

            tax_deduction = 0,
            loan_deduction = 0,
            late_deduction = 0,
            unpaid_leave_deduction = 0,
            advance_deduction = 0,
            other_deduction = 0,

            notes = null,

        } = body;


        /*
        |--------------------------------------------------------------------------
        | GET PAYROLL
        |--------------------------------------------------------------------------
        */

        const [rows] =
            await pool.execute(
                `
                SELECT
                    basic_salary

                FROM payroll

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Payroll record not found",
            });
        }


        const basic_salary =
            Number(
                rows[0].basic_salary
            ) || 0;


        /*
        |--------------------------------------------------------------------------
        | CALCULATE
        |--------------------------------------------------------------------------
        */

        const calculation =
            calculatePayroll({

                basic_salary,

                house_allowance,
                transport_allowance,
                other_allowance,

                allowances,
                overtime,
                bonus,

                tax_deduction,
                loan_deduction,
                late_deduction,
                unpaid_leave_deduction,
                advance_deduction,
                other_deduction,
            });


        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        await pool.execute(
            `
            UPDATE payroll

            SET

                allowances = ?,
                overtime = ?,
                bonus = ?,

                deductions = ?,
                tax = ?,

                net_salary = ?,

                house_allowance = ?,
                transport_allowance = ?,
                other_allowance = ?,

                gross_salary = ?,

                tax_deduction = ?,
                loan_deduction = ?,
                late_deduction = ?,
                unpaid_leave_deduction = ?,
                advance_deduction = ?,
                other_deduction = ?,

                total_deduction = ?,

                notes = ?

            WHERE id = ?
            `,
            [

                allowances,
                overtime,
                bonus,

                calculation.total_deduction,

                tax_deduction,

                calculation.net_salary,

                house_allowance,
                transport_allowance,
                other_allowance,

                calculation.gross_salary,

                tax_deduction,
                loan_deduction,
                late_deduction,
                unpaid_leave_deduction,
                advance_deduction,
                other_deduction,

                calculation.total_deduction,

                notes,

                id,
            ]
        );


        return res.status(200).json({

            success: true,

            message:
                "Payroll updated successfully",

            calculation,
        });

    } catch (error) {

        console.error(
            "Update payroll error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update payroll",

            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| PROCESS PAYROLL
|--------------------------------------------------------------------------
*/

const processPayroll = async (req, res) => {

    try {

        const { id } =
            req.params;


        const [result] =
            await pool.execute(
                `
                UPDATE payroll

                SET
                    payment_status =
                        'Processed'

                WHERE id = ?

                AND payment_status =
                    'Pending'
                `,
                [id]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payroll cannot be processed. It may already be processed or paid.",
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Payroll processed successfully",
        });

    } catch (error) {

        console.error(
            "Process payroll error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to process payroll",

            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| MARK PAYROLL AS PAID
|--------------------------------------------------------------------------
*/

const payPayroll = async (req, res) => {

    try {

        const { id } =
            req.params;

        const body =
            req.body || {};

        const {
            payment_method = "Cash",
            payment_date = null,
        } = body;


        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        const [result] =
            await pool.execute(
                `
                UPDATE payroll

                SET

                    payment_status =
                        'Paid',

                    payment_method = ?,

                    payment_date =
                        COALESCE(
                            ?,
                            CURDATE()
                        )

                WHERE id = ?

                AND payment_status
                    IN (
                        'Processed',
                        'Pending'
                    )
                `,
                [
                    payment_method,
                    payment_date,
                    id,
                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payroll cannot be marked as paid",
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Payroll marked as paid",
        });

    } catch (error) {

        console.error(
            "Pay payroll error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to mark payroll as paid",

            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| DELETE PAYROLL
|--------------------------------------------------------------------------
*/

const deletePayroll = async (req, res) => {

    try {

        const { id } =
            req.params;


        const [result] =
            await pool.execute(
                `
                DELETE FROM payroll

                WHERE id = ?
                `,
                [id]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Payroll record not found",
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Payroll deleted successfully",
        });

    } catch (error) {

        console.error(
            "Delete payroll error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete payroll",

            error:
                error.message,
        });
    }
};


/*
|--------------------------------------------------------------------------
| EXPORT CONTROLLERS
|--------------------------------------------------------------------------
*/

module.exports = {

    getPayroll,

    getPayrollById,

    createPayroll,

    updatePayroll,

    processPayroll,

    payPayroll,

    deletePayroll,
};