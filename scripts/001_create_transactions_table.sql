CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_public_key VARCHAR(64) NOT NULL,
    signature VARCHAR(128),
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    input_mint VARCHAR(64),
    output_mint VARCHAR(64),
    input_amount NUMERIC,
    output_amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_public_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_user_public_key ON transactions (user_public_key);

-- Create an index on signature for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_signature ON transactions (signature) WHERE signature IS NOT NULL;

-- Add a function to update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to use the function before each update
CREATE OR REPLACE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
