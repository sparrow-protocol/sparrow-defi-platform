ALTER TABLE transactions
ADD COLUMN type TEXT NOT NULL DEFAULT 'swap',
ADD COLUMN payment_recipient TEXT,
ADD COLUMN payment_amount TEXT,
ADD COLUMN payment_spl_token TEXT,
ADD COLUMN payment_label TEXT,
ADD COLUMN payment_message TEXT;
