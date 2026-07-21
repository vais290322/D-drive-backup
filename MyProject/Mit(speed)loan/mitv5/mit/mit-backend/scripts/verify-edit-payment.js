
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

        console.log("1. Creating Customer...");
        const email = `testedit${Date.now()}@example.com`;
        const customerRes = await api('POST', '/customers', {
            full_name: "Test Edit User",
            email: email,
            mobile_primary: "9999900000",
            address: "Test Address"
        });
        // Check structure
        const customerId = customerRes._id || (customerRes.customer && customerRes.customer._id) || customerRes.id;
        console.log("   Customer Created:", customerId);
        if (!customerId) {
            console.error("Customer Response:", JSON.stringify(customerRes, null, 2));
            throw new Error("Failed to get Customer ID");
        }

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
            loan_code: `TEST${Date.now()}`,
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
        console.log("   Loan Created:", loan._id);

        console.log("3. Adding Payment (5000)...");
        const payment = await api('POST', '/payments', {
            loan_id: loan._id,
            amount_paid: 5000,
            payment_mode: "cash",
            payment_date: new Date().toISOString()
        });
        console.log("   Payment Created:", payment._id);

        console.log("4. Verifying Ledger (Expect ~5000 paid)...");
        let ledger = await api('GET', `/customers/${customerId}/ledger`);
        // Ledger structure in response: 
        // { customer: ..., loans: [ { loan: ..., summary: { totalPaid: ... } } ] }
        let loanData = ledger.loans.find(l => l.loan._id === loan._id);
        let totalPaid = loanData.summary.totalPaid || 0;
        console.log("   Total Paid:", totalPaid);

        if (Math.abs(totalPaid - 5000) > 1) throw new Error(`Initial Payment Failed. Expected 5000, got ${totalPaid}`);

        console.log("5. EDITING Payment (Change to 8000)...");
        await api('PUT', `/payments/${payment._id}`, {
            amount_paid: 8000,
            payment_mode: "cash",
            payment_date: new Date().toISOString(),
            remarks: "Edited Payment"
        });
        console.log("   Payment Updated.");

        console.log("6. Verifying Ledger (Expect ~8000 paid)...");
        ledger = await api('GET', `/customers/${customerId}/ledger`);
        loanData = ledger.loans.find(l => l.loan._id === loan._id);
        totalPaid = loanData.summary.totalPaid || 0;
        console.log("   Total Paid:", totalPaid);

        if (Math.abs(totalPaid - 8000) > 1) throw new Error(`Edit Payment Failed. Expected 8000, got ${totalPaid}`);

        console.log("SUCCESS: Edit Payment Verification Passed!");

    } catch (e) {
        console.error("FAILED:", e);
        process.exit(1);
    }
}

run();
