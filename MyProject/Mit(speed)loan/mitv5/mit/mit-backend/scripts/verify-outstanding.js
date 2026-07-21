
const fetch = global.fetch;

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
        console.log("   Logged in.");

        console.log("1. Fetching All Loans...");
        const loans = await api('GET', '/loans');

        console.log(`   Fetched ${loans.length} loans.`);

        if (loans.length > 0) {
            console.log("   Verifying Outstanding Amount on up to 3 loans:");
            loans.slice(0, 3).forEach(loan => {
                console.log(`   - Loan ID: ${loan.loan_id}`);
                console.log(`     Principal: ${loan.principal_amount}`);
                console.log(`     Total Payable: ${loan.total_payable}`);
                console.log(`     Outstanding Amount: ${loan.outstanding_amount}`);

                if (loan.outstanding_amount === undefined) {
                    console.error("     ERROR: outstanding_amount is undefined!");
                } else {
                    console.log("     OK: Field exists.");
                }
            });
        } else {
            console.log("   No loans to verify.");
        }

    } catch (e) {
        console.error("FAILED:", e);
        process.exit(1);
    }
}

run();
