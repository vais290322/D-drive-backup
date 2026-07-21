const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Profile = require('./models/Profile');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Loan = require('./models/Loan');
const EmiSchedule = require('./models/EmiSchedule');
const EmiPayment = require('./models/EmiPayment');
const { Counter } = require('./models/Counter');

// CRM Models
const Company = require('./models/crm/Company');
const Contact = require('./models/crm/Contact');
const Deal = require('./models/crm/Deal');
const Task = require('./models/crm/Task');
const Activity = require('./models/crm/Activity');

// Banking Models
const BankCustomer = require('./models/banking/BankCustomer');
const BankAccount = require('./models/banking/BankAccount');
const BankTransaction = require('./models/banking/BankTransaction');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld')
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    });

async function clearDatabase() {
    console.log('\n📋 Clearing existing data...');
    await Profile.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Loan.deleteMany({});
    await EmiSchedule.deleteMany({});
    await EmiPayment.deleteMany({});
    await Counter.deleteMany({});
    await Company.deleteMany({});
    await Contact.deleteMany({});
    await Deal.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});
    await BankCustomer.deleteMany({});
    await BankAccount.deleteMany({});
    await BankTransaction.deleteMany({});
    console.log('✓ Database cleared\n');
}

async function seedUsers() {
    console.log('👥 Seeding Users...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const users = await Profile.insertMany([
        {
            email: 'admin@mitelectroworld.com',
            password: hashedPassword,
            full_name: 'System Administrator',
            phone: '9876543210',
            role: 'super_admin',
            status: 'approved',
            approved_at: new Date()
        },
        {
            email: 'manager@mitelectroworld.com',
            password: hashedPassword,
            full_name: 'Loan Manager',
            phone: '9876543211',
            role: 'loan_manager',
            status: 'approved',
            approved_at: new Date()
        },
        {
            email: 'agent@mitelectroworld.com',
            password: hashedPassword,
            full_name: 'Collection Agent',
            phone: '9876543212',
            role: 'collection_agent',
            status: 'approved',
            approved_at: new Date()
        }
    ]);

    console.log(`✓ Created ${users.length} users`);
    return users;
}

async function seedCustomers(adminId) {
    console.log('👤 Seeding Customers...');

    const customers = await Customer.insertMany([
        {
            customer_code: 'CUST001',
            full_name: 'Rajesh Kumar',
            father_name: 'Ramesh Kumar',
            date_of_birth: new Date('1990-05-15'),
            gender: 'male',
            marital_status: 'married',
            email: 'rajesh.kumar@email.com',
            mobile_primary: '9876501234',
            permanent_address: '123 MG Road',
            city: 'Bangalore',
            district: 'Bangalore Urban',
            state: 'Karnataka',
            pin_code: '560001',
            aadhaar_number: '1234-5678-9012',
            pan_number: 'ABCDE1234F',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'HDFC Bank',
            account_number: '50100123456789',
            ifsc_code: 'HDFC0001234',
            created_by: adminId
        },
        {
            customer_code: 'CUST002',
            full_name: 'Priya Sharma',
            father_name: 'Suresh Sharma',
            date_of_birth: new Date('1995-08-22'),
            gender: 'female',
            marital_status: 'single',
            email: 'priya.sharma@email.com',
            mobile_primary: '9876502345',
            permanent_address: '456 Park Street',
            city: 'Mumbai',
            district: 'Mumbai City',
            state: 'Maharashtra',
            pin_code: '400001',
            aadhaar_number: '2345-6789-0123',
            pan_number: 'BCDEF2345G',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'ICICI Bank',
            account_number: '50200234567890',
            ifsc_code: 'ICIC0002345',
            created_by: adminId
        },
        {
            customer_code: 'CUST003',
            full_name: 'Amit Patel',
            father_name: 'Jayesh Patel',
            date_of_birth: new Date('1988-12-10'),
            gender: 'male',
            marital_status: 'married',
            spouse_name: 'Ritu Patel',
            email: 'amit.patel@email.com',
            mobile_primary: '9876503456',
            permanent_address: '789 Ring Road',
            city: 'Ahmedabad',
            district: 'Ahmedabad',
            state: 'Gujarat',
            pin_code: '380001',
            aadhaar_number: '3456-7890-1234',
            pan_number: 'CDEFG3456H',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'SBI',
            account_number: '50300345678901',
            ifsc_code: 'SBIN0003456',
            created_by: adminId
        },
        {
            customer_code: 'CUST004',
            full_name: 'Sneha Reddy',
            father_name: 'Venkat Reddy',
            date_of_birth: new Date('1992-03-18'),
            gender: 'female',
            marital_status: 'married',
            spouse_name: 'Kiran Reddy',
            email: 'sneha.reddy@email.com',
            mobile_primary: '9876504567',
            permanent_address: '321 Banjara Hills',
            city: 'Hyderabad',
            district: 'Hyderabad',
            state: 'Telangana',
            pin_code: '500034',
            aadhaar_number: '4567-8901-2345',
            pan_number: 'DEFGH4567I',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'Axis Bank',
            account_number: '50400456789012',
            ifsc_code: 'UTIB0004567',
            created_by: adminId
        },
        {
            customer_code: 'CUST005',
            full_name: 'Vikram Singh',
            father_name: 'Rajendra Singh',
            date_of_birth: new Date('1985-07-25'),
            gender: 'male',
            marital_status: 'married',
            email: 'vikram.singh@email.com',
            mobile_primary: '9876505678',
            permanent_address: '654 Civil Lines',
            city: 'Delhi',
            district: 'North Delhi',
            state: 'Delhi',
            pin_code: '110001',
            aadhaar_number: '5678-9012-3456',
            pan_number: 'EFGHI5678J',
            kyc_status: 'pending',
            bank_name: 'Kotak Mahindra Bank',
            account_number: '50500567890123',
            ifsc_code: 'KKBK0005678',
            created_by: adminId
        },
        {
            customer_code: 'CUST006',
            full_name: 'Anita Desai',
            father_name: 'Mohan Desai',
            date_of_birth: new Date('1993-11-08'),
            gender: 'female',
            marital_status: 'single',
            email: 'anita.desai@email.com',
            mobile_primary: '9876506789',
            permanent_address: '987 FC Road',
            city: 'Pune',
            district: 'Pune',
            state: 'Maharashtra',
            pin_code: '411016',
            aadhaar_number: '6789-0123-4567',
            pan_number: 'FGHIJ6789K',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'Yes Bank',
            account_number: '50600678901234',
            ifsc_code: 'YESB0006789',
            created_by: adminId
        },
        {
            customer_code: 'CUST007',
            full_name: 'Manoj Gupta',
            father_name: 'Hari Gupta',
            date_of_birth: new Date('1991-02-14'),
            gender: 'male',
            marital_status: 'married',
            email: 'manoj.gupta@email.com',
            mobile_primary: '9876507890',
            permanent_address: '147 Park Lane',
            city: 'Kolkata',
            district: 'Kolkata',
            state: 'West Bengal',
            pin_code: '700001',
            aadhaar_number: '7890-1234-5678',
            pan_number: 'GHIJK7890L',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'IndusInd Bank',
            account_number: '50700789012345',
            ifsc_code: 'INDB0007890',
            created_by: adminId
        },
        {
            customer_code: 'CUST008',
            full_name: 'Kavita Nair',
            father_name: 'Krishnan Nair',
            date_of_birth: new Date('1994-06-30'),
            gender: 'female',
            marital_status: 'single',
            email: 'kavita.nair@email.com',
            mobile_primary: '9876508901',
            permanent_address: '258 Marine Drive',
            city: 'Kochi',
            district: 'Ernakulam',
            state: 'Kerala',
            pin_code: '682001',
            aadhaar_number: '8901-2345-6789',
            pan_number: 'HIJKL8901M',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'Federal Bank',
            account_number: '50800890123456',
            ifsc_code: 'FDRL0008901',
            created_by: adminId
        },
        {
            customer_code: 'CUST009',
            full_name: 'Suresh Yadav',
            father_name: 'Mahesh Yadav',
            date_of_birth: new Date('1987-09-12'),
            gender: 'male',
            marital_status: 'married',
            email: 'suresh.yadav@email.com',
            mobile_primary: '9876509012',
            permanent_address: '369 Station Road',
            city: 'Jaipur',
            district: 'Jaipur',
            state: 'Rajasthan',
            pin_code: '302001',
            aadhaar_number: '9012-3456-7890',
            pan_number: 'IJKLM9012N',
            kyc_status: 'verified',
            kyc_verified_by: adminId,
            kyc_verified_at: new Date(),
            bank_name: 'Bank of Baroda',
            account_number: '50900901234567',
            ifsc_code: 'BARB0009012',
            created_by: adminId
        },
        {
            customer_code: 'CUST010',
            full_name: 'Deepa Menon',
            father_name: 'Unni Menon',
            date_of_birth: new Date('1996-01-20'),
            gender: 'female',
            marital_status: 'single',
            email: 'deepa.menon@email.com',
            mobile_primary: '9876510123',
            permanent_address: '741 Beach Road',
            city: 'Chennai',
            district: 'Chennai',
            state: 'Tamil Nadu',
            pin_code: '600001',
            aadhaar_number: '0123-4567-8901',
            pan_number: 'JKLMN0123O',
            kyc_status: 'pending',
            bank_name: 'Canara Bank',
            account_number: '51001012345678',
            ifsc_code: 'CNRB0010123',
            created_by: adminId
        }
    ]);

    console.log(`✓ Created ${customers.length} customers`);
    return customers;
}

async function seedProducts(adminId) {
    console.log('📱 Seeding Products...');

    const products = await Product.insertMany([
        // Mobiles
        {
            product_code: 'PROD001',
            category: 'mobile',
            brand: 'Samsung',
            model: 'Galaxy S23',
            serial_number: 'SN123456789',
            imei_1: '123456789012345',
            color: 'Phantom Black',
            ram_rom: '8GB/256GB',
            purchase_price: 75000,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD002',
            category: 'mobile',
            brand: 'Apple',
            model: 'iPhone 14',
            serial_number: 'SN234567890',
            imei_1: '234567890123456',
            color: 'Midnight Blue',
            ram_rom: '6GB/128GB',
            purchase_price: 79900,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD003',
            category: 'mobile',
            brand: 'OnePlus',
            model: '11R',
            serial_number: 'SN345678901',
            imei_1: '345678901234567',
            color: 'Galactic Silver',
            ram_rom: '8GB/128GB',
            purchase_price: 39999,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD004',
            category: 'mobile',
            brand: 'Xiaomi',
            model: 'Redmi Note 12 Pro',
            serial_number: 'SN456789012',
            imei_1: '456789012345678',
            color: 'Glacier Blue',
            ram_rom: '8GB/128GB',
            purchase_price: 25999,
            status: 'available',
            created_by: adminId
        },
        {
            product_code: 'PROD005',
            category: 'mobile',
            brand: 'Vivo',
            model: 'V27 Pro',
            serial_number: 'SN567890123',
            imei_1: '567890123456789',
            color: 'Magic Blue',
            ram_rom: '8GB/128GB',
            purchase_price: 37999,
            status: 'available',
            created_by: adminId
        },
        // Laptops
        {
            product_code: 'PROD006',
            category: 'laptop',
            brand: 'Dell',
            model: 'Inspiron 15',
            serial_number: 'SN678901234',
            color: 'Silver',
            ram_rom: '16GB/512GB SSD',
            purchase_price: 65000,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD007',
            category: 'laptop',
            brand: 'HP',
            model: 'Pavilion Gaming',
            serial_number: 'SN789012345',
            color: 'Shadow Black',
            ram_rom: '16GB/1TB SSD',
            purchase_price: 75000,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD008',
            category: 'laptop',
            brand: 'Apple',
            model: 'MacBook Air M2',
            serial_number: 'SN890123456',
            color: 'Space Gray',
            ram_rom: '8GB/256GB SSD',
            purchase_price: 114900,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD009',
            category: 'laptop',
            brand: 'Lenovo',
            model: 'IdeaPad Slim 5',
            serial_number: 'SN901234567',
            color: 'Graphite Grey',
            ram_rom: '16GB/512GB SSD',
            purchase_price: 58000,
            status: 'available',
            created_by: adminId
        },
        {
            product_code: 'PROD010',
            category: 'laptop',
            brand: 'Asus',
            model: 'VivoBook 15',
            serial_number: 'SN012345678',
            color: 'Transparent Silver',
            ram_rom: '8GB/512GB SSD',
            purchase_price: 45000,
            status: 'available',
            created_by: adminId
        },
        // TVs
        {
            product_code: 'PROD011',
            category: 'tv',
            brand: 'Samsung',
            model: '55" Crystal 4K UHD',
            serial_number: 'SN123450001',
            color: 'Titan Gray',
            purchase_price: 52000,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD012',
            category: 'tv',
            brand: 'LG',
            model: '43" Full HD Smart',
            serial_number: 'SN123450002',
            color: 'Black',
            purchase_price: 32000,
            status: 'available',
            created_by: adminId
        },
        {
            product_code: 'PROD013',
            category: 'tv',
            brand: 'Sony',
            model: '50" BRAVIA 4K',
            serial_number: 'SN123450003',
            color: 'Black',
            purchase_price: 68000,
            status: 'available',
            created_by: adminId
        },
        // Vehicles
        {
            product_code: 'PROD014',
            category: 'vehicle',
            brand: 'Honda',
            model: 'Activa 6G',
            serial_number: 'VH123456789',
            color: 'Pearl White',
            purchase_price: 72000,
            status: 'assigned',
            created_by: adminId
        },
        {
            product_code: 'PROD015',
            category: 'vehicle',
            brand: 'Hero',
            model: 'Splendor Plus',
            serial_number: 'VH234567890',
            color: 'Black Red',
            purchase_price: 65000,
            status: 'available',
            created_by: adminId
        }
    ]);

    console.log(`✓ Created ${products.length} products`);
    return products;
}

async function seedLoans(customers, products, adminId) {
    console.log('💰 Seeding Loans and EMI Schedules...');

    const loans = [];
    const loanData = [
        {
            customer: customers[0],
            product: products[0], // Samsung Galaxy
            loan_type: 'monthly',
            principal_amount: 70000,
            tenure_months: 12,
            interest_rate: 18,
            start_months_ago: 3
        },
        {
            customer: customers[1],
            product: products[1], // iPhone 14
            loan_type: 'monthly',
            principal_amount: 75000,
            tenure_months: 18,
            interest_rate: 16,
            start_months_ago: 6
        },
        {
            customer: customers[2],
            product: products[2], // OnePlus
            loan_type: 'weekly',
            principal_amount: 38000,
            tenure_months: 6,
            interest_rate: 20,
            start_months_ago: 2
        },
        {
            customer: customers[3],
            product: products[5], // Dell Laptop
            loan_type: 'monthly',
            principal_amount: 62000,
            tenure_months: 24,
            interest_rate: 15,
            start_months_ago: 8
        },
        {
            customer: customers[4],
            product: products[6], // HP Laptop
            loan_type: 'monthly',
            principal_amount: 72000,
            tenure_months: 24,
            interest_rate: 15,
            start_months_ago: 4
        },
        {
            customer: customers[5],
            product: products[7], // MacBook
            loan_type: 'monthly',
            principal_amount: 110000,
            tenure_months: 24,
            interest_rate: 14,
            start_months_ago: 10
        },
        {
            customer: customers[6],
            product: products[10], // Samsung TV
            loan_type: 'monthly',
            principal_amount: 50000,
            tenure_months: 12,
            interest_rate: 18,
            start_months_ago: 5
        },
        {
            customer: customers[7],
            product: products[13], // Honda Activa
            loan_type: 'daily',
            principal_amount: 68000,
            tenure_months: 12,
            interest_rate: 22,
            start_months_ago: 1
        }
    ];

    for (let i = 0; i < loanData.length; i++) {
        const data = loanData[i];
        const loanCode = `LOAN${String(i + 1).padStart(3, '0')}`;

        // Calculate loan details
        const processingFee = data.principal_amount * 0.02;
        const insuranceFee = data.principal_amount * 0.01;

        // Flat interest calculation
        const totalInterest = (data.principal_amount * data.interest_rate * (data.tenure_months / 12)) / 100;
        const totalPayable = data.principal_amount + totalInterest;
        const installmentAmount = totalPayable / data.tenure_months;

        // Calculate start date
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - data.start_months_ago);

        const firstEmiDate = new Date(startDate);
        firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);

        const loan = await Loan.create({
            loan_code: loanCode,
            customer_id: data.customer._id,
            product_id: data.product._id,
            loan_type: data.loan_type,
            principal_amount: data.principal_amount,
            processing_fee: processingFee,
            insurance_fee: insuranceFee,
            tenure_months: data.tenure_months,
            interest_type: 'flat',
            interest_rate: data.interest_rate,
            total_interest: totalInterest,
            total_payable: totalPayable,
            installment_amount: installmentAmount,
            start_date: startDate,
            first_emi_date: firstEmiDate,
            emi_day_of_month: firstEmiDate.getDate(),
            status: 'active',
            guarantor_name: 'Reference Person',
            guarantor_mobile: '9999999999',
            created_by: adminId
        });

        loans.push(loan);

        // Create EMI Schedule
        let openingBalance = data.principal_amount;
        const principalPerEmi = data.principal_amount / data.tenure_months;
        const interestPerEmi = totalInterest / data.tenure_months;

        for (let emiNum = 1; emiNum <= data.tenure_months; emiNum++) {
            const dueDate = new Date(firstEmiDate);
            dueDate.setMonth(dueDate.getMonth() + (emiNum - 1));

            const closingBalance = openingBalance - principalPerEmi;
            const isPast = dueDate < new Date();
            const paidCount = Math.floor(data.start_months_ago * 0.8); // 80% of elapsed months paid
            const isPaid = emiNum <= paidCount;

            await EmiSchedule.create({
                loan_id: loan._id,
                emi_number: emiNum,
                due_date: dueDate,
                principal_component: principalPerEmi,
                interest_component: interestPerEmi,
                emi_amount: installmentAmount,
                opening_balance: openingBalance,
                closing_balance: closingBalance > 0 ? closingBalance : 0,
                status: isPaid ? 'paid' : (isPast ? 'overdue' : 'pending'),
                paid_amount: isPaid ? installmentAmount : 0,
                paid_date: isPaid ? dueDate : null
            });

            // Create payment record for paid EMIs
            if (isPaid) {
                await EmiPayment.create({
                    loan_id: loan._id,
                    payment_date: dueDate,
                    amount_paid: installmentAmount,
                    payment_mode: ['cash', 'upi', 'bank_transfer'][Math.floor(Math.random() * 3)],
                    transaction_reference: `TXN${Date.now()}${emiNum}`,
                    collected_by: adminId,
                    remarks: 'Regular EMI payment'
                });
            }

            openingBalance = closingBalance;
        }
    }

    console.log(`✓ Created ${loans.length} loans with EMI schedules`);
    return loans;
}

async function seedCRMData(adminId) {
    console.log('🏢 Seeding CRM Data...');

    // Companies
    const companies = await Company.insertMany([
        {
            name: 'TechCorp Solutions',
            industry: 'Information Technology',
            website: 'www.techcorp.com',
            phone: '022-12345678',
            email: 'contact@techcorp.com',
            address: '123 Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            postal_code: '560001',
            employee_count: 500,
            annual_revenue: 50000000
        },
        {
            name: 'GreenEnergy Pvt Ltd',
            industry: 'Renewable Energy',
            website: 'www.greenenergy.com',
            phone: '011-23456789',
            email: 'info@greenenergy.com',
            address: '456 Solar Avenue',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            postal_code: '110001',
            employee_count: 200,
            annual_revenue: 25000000
        },
        {
            name: 'HealthFirst Medical',
            industry: 'Healthcare',
            website: 'www.healthfirst.com',
            phone: '040-34567890',
            email: 'care@healthfirst.com',
            address: '789 Medical Road',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India',
            postal_code: '500001',
            employee_count: 300,
            annual_revenue: 35000000
        },
        {
            name: 'AutoDrive Motors',
            industry: 'Automotive',
            website: 'www.autodrive.com',
            phone: '033-45678901',
            email: 'sales@autodrive.com',
            address: '321 Motor Lane',
            city: 'Kolkata',
            state: 'West Bengal',
            country: 'India',
            postal_code: '700001',
            employee_count: 400,
            annual_revenue: 60000000
        },
        {
            name: 'EduTech Learning',
            industry: 'Education',
            website: 'www.edutech.com',
            phone: '020-56789012',
            email: 'hello@edutech.com',
            address: '654 Education Street',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            postal_code: '411001',
            employee_count: 150,
            annual_revenue: 15000000
        }
    ]);

    // Contacts
    const contacts = await Contact.insertMany([
        {
            company_id: companies[0]._id,
            first_name: 'Rahul',
            last_name: 'Mehta',
            email: 'rahul.mehta@techcorp.com',
            phone: '022-12345678',
            mobile: '9876541234',
            title: 'CEO',
            department: 'Executive',
            lead_source: 'Referral',
            lead_status: 'qualified'
        },
        {
            company_id: companies[0]._id,
            first_name: 'Neha',
            last_name: 'Shah',
            email: 'neha.shah@techcorp.com',
            phone: '022-12345679',
            mobile: '9876541235',
            title: 'CTO',
            department: 'Technology',
            lead_source: 'Website',
            lead_status: 'new'
        },
        {
            company_id: companies[1]._id,
            first_name: 'Sandeep',
            last_name: 'Verma',
            email: 'sandeep.verma@greenenergy.com',
            phone: '011-23456789',
            mobile: '9876541236',
            title: 'Managing Director',
            department: 'Executive',
            lead_source: 'LinkedIn',
            lead_status: 'qualified'
        },
        {
            company_id: companies[2]._id,
            first_name: 'Pooja',
            last_name: 'Iyer',
            email: 'pooja.iyer@healthfirst.com',
            phone: '040-34567890',
            mobile: '9876541237',
            title: 'Director',
            department: 'Operations',
            lead_source: 'Conference',
            lead_status: 'qualified'
        },
        {
            company_id: companies[3]._id,
            first_name: 'Karthik',
            last_name: 'Krishnan',
            email: 'karthik.k@autodrive.com',
            phone: '033-45678901',
            mobile: '9876541238',
            title: 'VP Sales',
            department: 'Sales',
            lead_source: 'Cold Call',
            lead_status: 'new'
        },
        {
            company_id: companies[4]._id,
            first_name: 'Meera',
            last_name: 'Joshi',
            email: 'meera.joshi@edutech.com',
            phone: '020-56789012',
            mobile: '9876541239',
            title: 'Founder',
            department: 'Executive',
            lead_source: 'Social Media',
            lead_status: 'qualified'
        }
    ]);

    // Deals
    const deals = await Deal.insertMany([
        {
            company_id: companies[0]._id,
            contact_id: contacts[0]._id,
            title: 'Enterprise Software License',
            description: 'Annual software license for 500 users',
            value: 2500000,
            stage: 'negotiation',
            probability: 75,
            expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            priority: 'high'
        },
        {
            company_id: companies[1]._id,
            contact_id: contacts[2]._id,
            title: 'Solar Panel Installation',
            description: 'Complete solar setup for office building',
            value: 5000000,
            stage: 'qualified',
            probability: 60,
            expected_close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            priority: 'high'
        },
        {
            company_id: companies[2]._id,
            contact_id: contacts[3]._id,
            title: 'Medical Equipment Supply',
            description: 'Bulk order of medical equipment',
            value: 3500000,
            stage: 'prospecting',
            probability: 30,
            expected_close_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            priority: 'medium'
        },
        {
            company_id: companies[3]._id,
            contact_id: contacts[4]._id,
            title: 'Fleet Management System',
            description: 'GPS tracking and management for 100 vehicles',
            value: 1800000,
            stage: 'won',
            probability: 100,
            actual_close_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            priority: 'high'
        },
        {
            company_id: companies[4]._id,
            contact_id: contacts[5]._id,
            title: 'Learning Management Platform',
            description: 'E-learning platform for 10000 students',
            value: 1200000,
            stage: 'negotiation',
            probability: 80,
            expected_close_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            priority: 'high'
        }
    ]);

    // Tasks
    await Task.insertMany([
        {
            title: 'Follow up with TechCorp CEO',
            description: 'Discuss contract terms',
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            priority: 'high',
            status: 'pending',
            related_to_type: 'Deal',
            related_to_id: deals[0]._id
        },
        {
            title: 'Prepare proposal for GreenEnergy',
            description: 'Custom solar solution proposal',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            priority: 'high',
            status: 'pending',
            related_to_type: 'Deal',
            related_to_id: deals[1]._id
        },
        {
            title: 'Schedule demo for HealthFirst',
            description: 'Product demonstration meeting',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: 'medium',
            status: 'pending',
            related_to_type: 'Deal',
            related_to_id: deals[2]._id
        },
        {
            title: 'Send thank you note to AutoDrive',
            description: 'Thank you for the business',
            due_date: new Date(),
            priority: 'low',
            status: 'completed',
            completed_at: new Date(),
            related_to_type: 'Deal',
            related_to_id: deals[3]._id
        },
        {
            title: 'Contract review with EduTech',
            description: 'Legal team review needed',
            due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            priority: 'high',
            status: 'pending',
            related_to_type: 'Deal',
            related_to_id: deals[4]._id
        }
    ]);

    // Activities
    await Activity.insertMany([
        {
            activity_type: 'call',
            subject: 'Initial discussion with CEO',
            description: 'Discussed requirements and pricing',
            related_to_type: 'Contact',
            contact_id: contacts[0]._id,
            activity_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            duration_minutes: 45,
            outcome: 'positive'
        },
        {
            activity_type: 'email',
            subject: 'Sent proposal document',
            description: 'Detailed proposal for solar installation',
            related_to_type: 'Deal',
            deal_id: deals[1]._id,
            activity_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            outcome: 'pending'
        },
        {
            activity_type: 'meeting',
            subject: 'Product demo session',
            description: 'Demonstrated key features',
            related_to_type: 'Contact',
            contact_id: contacts[3]._id,
            activity_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            duration_minutes: 90,
            outcome: 'positive'
        },
        {
            activity_type: 'call',
            subject: 'Contract finalization',
            description: 'Discussed final terms',
            related_to_type: 'Deal',
            deal_id: deals[3]._id,
            activity_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            duration_minutes: 30,
            outcome: 'positive'
        },
        {
            activity_type: 'meeting',
            subject: 'Technical discussion',
            description: 'Integration requirements discussion',
            related_to_type: 'Deal',
            deal_id: deals[4]._id,
            activity_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            duration_minutes: 60,
            outcome: 'positive'
        }
    ]);

    console.log(`✓ Created CRM data: ${companies.length} companies, ${contacts.length} contacts, ${deals.length} deals`);
}

async function seedBankingData(adminId) {
    console.log('🏦 Seeding Banking Data...');

    // Bank Customers
    const bankCustomers = await BankCustomer.insertMany([
        {
            full_name: 'Arjun Prasad',
            phone: '9988771234',
            email: 'arjun.prasad@email.com',
            address: '123 Lake View',
            father_name: 'Mohan Prasad',
            date_of_birth: new Date('1985-03-15'),
            gender: 'male',
            marital_status: 'married',
            nationality: 'Indian',
            occupation: 'Business Owner',
            annual_income: 1200000,
            pan_number: 'ABCDE1111A',
            aadhaar_number: '1111-2222-3333',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001'
        },
        {
            full_name: 'Lakshmi Subramanian',
            phone: '9988772345',
            email: 'lakshmi.s@email.com',
            address: '456 Temple Street',
            father_name: 'Subramanian',
            date_of_birth: new Date('1990-07-22'),
            gender: 'female',
            marital_status: 'single',
            nationality: 'Indian',
            occupation: 'Software Engineer',
            annual_income: 1500000,
            pan_number: 'BCDEF2222B',
            aadhaar_number: '2222-3333-4444',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600001'
        },
        {
            full_name: 'Mohammed Irfan',
            phone: '9988773456',
            email: 'irfan.m@email.com',
            address: '789 Commercial Road',
            father_name: 'Abdul Rahman',
            date_of_birth: new Date('1988-11-10'),
            gender: 'male',
            marital_status: 'married',
            nationality: 'Indian',
            occupation: 'Businessman',
            annual_income: 2000000,
            pan_number: 'CDEFG3333C',
            aadhaar_number: '3333-4444-5555',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001'
        },
        {
            full_name: 'Divya Krishnamurthy',
            phone: '9988774567',
            email: 'divya.k@email.com',
            address: '321 Gardens Colony',
            father_name: 'Krishnamurthy',
            date_of_birth: new Date('1992-05-18'),
            gender: 'female',
            marital_status: 'single',
            nationality: 'Indian',
            occupation: 'Doctor',
            annual_income: 1800000,
            pan_number: 'DEFGH4444D',
            aadhaar_number: '4444-5555-6666',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        {
            full_name: 'Ravi Shankar',
            phone: '9988775678',
            email: 'ravi.shankar@email.com',
            address: '654 Market Area',
            father_name: 'Shankar Rao',
            date_of_birth: new Date('1983-09-25'),
            gender: 'male',
            marital_status: 'married',
            nationality: 'Indian',
            occupation: 'Trader',
            annual_income: 900000,
            pan_number: 'EFGHI5555E',
            aadhaar_number: '5555-6666-7777',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001'
        },
        {
            full_name: 'Priyanka Agarwal',
            phone: '9988776789',
            email: 'priyanka.a@email.com',
            address: '987 Rose Garden',
            father_name: 'Rajesh Agarwal',
            date_of_birth: new Date('1995-01-30'),
            gender: 'female',
            marital_status: 'single',
            nationality: 'Indian',
            occupation: 'Teacher',
            annual_income: 600000,
            pan_number: 'FGHIJ6666F',
            aadhaar_number: '6666-7777-8888',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001'
        }
    ]);

    // Bank Accounts
    const bankAccounts = await BankAccount.insertMany([
        {
            customer_id: bankCustomers[0]._id,
            account_number: 'SA100001',
            account_type: 'Savings',
            balance: 250000,
            status: 'active',
            opening_date: new Date('2020-01-15')
        },
        {
            customer_id: bankCustomers[0]._id,
            account_number: 'CA100002',
            account_type: 'Current',
            balance: 500000,
            status: 'active',
            opening_date: new Date('2021-03-20')
        },
        {
            customer_id: bankCustomers[1]._id,
            account_number: 'SA200001',
            account_type: 'Savings',
            balance: 180000,
            status: 'active',
            opening_date: new Date('2019-06-10')
        },
        {
            customer_id: bankCustomers[2]._id,
            account_number: 'CA300001',
            account_type: 'Current',
            balance: 750000,
            status: 'active',
            opening_date: new Date('2018-11-05')
        },
        {
            customer_id: bankCustomers[2]._id,
            account_number: 'SA300002',
            account_type: 'Savings',
            balance: 320000,
            status: 'active',
            opening_date: new Date('2020-08-15')
        },
        {
            customer_id: bankCustomers[3]._id,
            account_number: 'SA400001',
            account_type: 'Savings',
            balance: 420000,
            status: 'active',
            opening_date: new Date('2021-02-28')
        },
        {
            customer_id: bankCustomers[4]._id,
            account_number: 'CA500001',
            account_type: 'Current',
            balance: 280000,
            status: 'active',
            opening_date: new Date('2019-12-10')
        },
        {
            customer_id: bankCustomers[4]._id,
            account_number: 'SA500002',
            account_type: 'Savings',
            balance: 95000,
            status: 'active',
            opening_date: new Date('2022-05-20')
        },
        {
            customer_id: bankCustomers[5]._id,
            account_number: 'SA600001',
            account_type: 'Savings',
            balance: 65000,
            status: 'active',
            opening_date: new Date('2021-09-15')
        }
    ]);

    // Bank Transactions
    const transactions = [];
    const transactionTypes = ['deposit', 'withdrawal'];

    for (let i = 0; i < 30; i++) {
        const accountIndex = Math.floor(Math.random() * bankAccounts.length);
        const account = bankAccounts[accountIndex];
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;
        const daysAgo = Math.floor(Math.random() * 60);
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() - daysAgo);

        transactions.push({
            account_id: account._id,
            transaction_type: type,
            amount: amount,
            balance_after: account.balance,
            transaction_date: transactionDate,
            reference_note: `${type === 'deposit' ? 'Cash Deposit' : 'ATM Withdrawal'} - REF${Date.now()}${i}`,
            created_by: adminId
        });
    }

    await BankTransaction.insertMany(transactions);

    console.log(`✓ Created banking data: ${bankCustomers.length} customers, ${bankAccounts.length} accounts, ${transactions.length} transactions`);
}

async function seedDatabase() {
    try {
        console.log('\n🌱 Starting Database Seeding Process\n');
        console.log('═'.repeat(50));

        await clearDatabase();

        const users = await seedUsers();
        const adminId = users[0]._id;

        const customers = await seedCustomers(adminId);
        const products = await seedProducts(adminId);
        await seedLoans(customers, products, adminId);
        await seedCRMData(adminId);
        await seedBankingData(adminId);

        console.log('\n' + '═'.repeat(50));
        console.log('\n✅ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   • Users: 3 (admin@mitelectroworld.com / Admin@123)');
        console.log('   • Customers: 10');
        console.log('   • Products: 15');
        console.log('   • Active Loans: 8');
        console.log('   • CRM Companies: 5');
        console.log('   • CRM Contacts: 6');
        console.log('   • CRM Deals: 5');
        console.log('   • Bank Customers: 6');
        console.log('   • Bank Accounts: 9');
        console.log('   • Bank Transactions: 30\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeder
seedDatabase();
