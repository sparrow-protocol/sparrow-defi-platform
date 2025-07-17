-- Add payment-specific fields to the transactions table
ALTER TABLE transactions
ADD COLUMN payment_recipient VARCHAR(64),
ADD COLUMN payment_amount NUMERIC,
ADD COLUMN payment_spl_token VARCHAR(64),
ADD COLUMN payment_label VARCHAR(255),
ADD COLUMN payment_message TEXT;

-- Add a table for Solana Pay payment requests
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC NOT NULL,
    currency VARCHAR(10) NOT NULL, -- e.g., 'SOL', 'SPL', 'USD'
    recipient VARCHAR(64) NOT NULL,
    memo TEXT,
    reference VARCHAR(128), -- Can be used for external order IDs
    label VARCHAR(255),
    message TEXT,
    spl_token VARCHAR(64), -- Mint address if currency is SPL
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'failed', 'processing', 'expired'
    signature VARCHAR(128), -- Transaction signature once completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on reference for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_requests_reference ON payment_requests (reference) WHERE reference IS NOT NULL;

-- Create an index on recipient for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_requests_recipient ON payment_requests (recipient);

-- Add a trigger to update the updated_at column automatically for payment_requests
CREATE OR REPLACE TRIGGER update_payment_requests_updated_at
BEFORE UPDATE ON payment_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add a table for user profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    privy_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255),
    wallet_address VARCHAR(64), -- Primary Solana wallet address
    embedded_wallet_address VARCHAR(64), -- Privy embedded wallet address
    username VARCHAR(255),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb, -- Store user preferences as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on privy_id for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_privy_id ON users (privy_id);

-- Add a trigger to update the updated_at column automatically for users
CREATE OR REPLACE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
