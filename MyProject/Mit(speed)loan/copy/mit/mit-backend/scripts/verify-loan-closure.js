
const fetch = global.fetch; // Use global fetch (Node 18+)

let authToken = null;

async function api(method, path, body) {
    const url = `http://localhost:4000/api${path}`;
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (authToken) {
        opts.headers['Authorization'] = `Bearer ${authToken}`;
    }
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    if (!res.ok) {
        const txt = await res.text();
        console.error(`API Error ${method} ${path}:`, res.status, txt);
        throw new Error(`API Error: ${res.status}`);
    }
    return res.json();
}

async function run() {
    try {
        console.log("0. Logging in...");
        const loginRes = await api('POST', '/auth/login', {
            email: 'admin@mitelectroworld.com',
            password: 'Admin@123'
        });
        authToken = loginRes.token;
        console.log("   Logged in. Token acquired.");

        console.log("1. Creating Customer for Closure Test...");
        const email = `closetest${Date.now()}@example.com`;
        const customerRes = await api('POST', '/customers', {
            full_name: "Closure Test User",
            email: email,
            mobile_primary: "9999900000",
            address: "Test Address"
        });
        const customerId = customerRes._id || customerRes.id;
        console.log("   Customer Created:", customerId);

        console.log("2. Creating Loan...");

        // Calculate defaults (Flat Interest)
        const principal = 10000;
        const rate = 12; // 12% flat
        const months = 12;
        const totalInterest = (principal * rate * (months / 12)) / 100;
        const totalPayable = principal + totalInterest;
        const emi = totalPayable / months;
        const startDate = new Date();
        const firstEmiDate = new Date(startDate);
        firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);

        const loanPayload = {
            customer_id: customerId,
            loan_code: `CLOSE${Date.now()}`,
            loan_type: 'monthly',
            principal_amount: principal,
            interest_rate: rate,
            tenure_months: months,
            interest_type: "flat",
            start_date: startDate.toISOString(),
            // Required calculated fields
            total_interest: totalInterest,
            total_payable: totalPayable,
            installment_amount: emi,
            first_emi_date: firstEmiDate.toISOString(),
            emi_day_of_month: firstEmiDate.getDate(),
            processing_fee: 0,
            insurance_fee: 0,
            status: 'active'
        };

        const loan = await api('POST', '/loans', loanPayload);
        console.log("   Loan Created:", loan._id, "Status:", loan.status);

        console.log("3. Closing Loan (Updating status to completed)...");
        const updatedLoan = await api('PUT', `/loans/${loan._id}`, {
            status: "completed",
            closed_date: new Date().toISOString()
        });
        console.log("   Loan Updated. New Status:", updatedLoan.status);

        if (updatedLoan.status !== "completed") {
            throw new Error(`Failed to close loan. Status is ${updatedLoan.status}`);
        }

        console.log("SUCCESS: Loan Closure Verification Passed!");

    } catch (e) {
        console.error("FAILED:", e);
        process.exit(1);
    }
}

run();
