-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('INCOME','EXPENSE')),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    date DATE NOT NULL,
    description TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BUDGETS TABLE
CREATE TABLE budgets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    limit_amount DECIMAL(12,2),
    month INT,
    year INT,
    alert_sent BOOLEAN DEFAULT FALSE
);

-- INDEXES (Performance Optimization)
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user ON budgets(user_id);
