-- This is a single-line comment

/*
    This is a
    multi-line comment
*/

DECLARE
    -- Variable declaration
    v_employee_name VARCHAR2(50);
    v_salary        NUMBER(10,2) := 5500.50;
    v_bonus         CONSTANT NUMBER(5,2) := 500.00;
    v_department_id NUMBER(4);

    -- Cursor declaration
    CURSOR c_employees IS
        SELECT employee_id, first_name, last_name
        FROM employees
        WHERE department_id = v_department_id;
        
BEGIN
    -- Assigning values
    v_employee_name := 'John Doe';
    v_department_id := 30;
    
    -- Conditional statement
    IF v_salary > 5000 THEN
        v_salary := v_salary + v_bonus;
    ELSE
        v_salary := v_salary + (v_bonus / 2);
    END IF;
    
    -- Loop through the cursor
    FOR r_employee IN c_employees LOOP
        DBMS_OUTPUT.PUT_LINE('Employee: ' || r_employee.first_name || ' ' || r_employee.last_name);
    END LOOP;

    -- Function call
    v_salary := ROUND(v_salary, 2);

    -- Output the results
    DBMS_OUTPUT.PUT_LINE('Final Salary: ' || v_salary);

EXCEPTION
    -- Exception handling
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END;
