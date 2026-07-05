-- Seed data for roles, permissions, users, organizations, teams, subscriptions, billing, files, chat, and notifications
-- Password hash corresponds to 'Password123!' (using standard bcrypt/passlib format)

-- 1. Insert Roles
INSERT INTO roles (name, description) VALUES
('Admin', 'Administrator with full system privileges'),
('Manager', 'Manager with restricted management privileges'),
('User', 'Standard user with profile access and personal dashboard');

-- 2. Insert Permissions
INSERT INTO permissions (name, description) VALUES
('users:create', 'Permission to create new user accounts'),
('users:read', 'Permission to view user lists and details'),
('users:update', 'Permission to update user details and roles'),
('users:delete', 'Permission to delete user accounts'),
('profile:read', 'Permission to view own profile'),
('profile:update', 'Permission to update own profile'),
('logs:view', 'Permission to view application audit logs'),
('audit_trail:view', 'Permission to view low-level database audit logs'),
('org:billing', 'Permission to manage billing and subscriptions'),
('org:members', 'Permission to invite and manage organization members'),
('files:upload', 'Permission to upload secure files'),
('files:download', 'Permission to download files'),
('chat:use', 'Permission to use the AI chat assistant');

-- 3. Map Permissions to Roles (role_permissions)
-- Admin permissions (all)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Admin';

-- Manager permissions (read logs, read/update users, manage members)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Manager' AND p.name IN ('users:read', 'users:update', 'profile:read', 'profile:update', 'logs:view', 'org:members', 'files:upload', 'files:download', 'chat:use');

-- User permissions (own profile, file upload/download, AI chat)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'User' AND p.name IN ('profile:read', 'profile:update', 'files:upload', 'files:download', 'chat:use');

-- 4. Seed Mock Users and Profiles
WITH new_users AS (
    INSERT INTO users (email, password_hash, role_id, is_active) VALUES
    ('admin@local.com', '$2b$12$7woG.X8EWLB4DW.R7BGa2.ryN3q.kv.5flm5Y13aIB55mEKzKef/u', (SELECT id FROM roles WHERE name = 'Admin'), TRUE),
    ('manager@local.com', '$2b$12$7woG.X8EWLB4DW.R7BGa2.ryN3q.kv.5flm5Y13aIB55mEKzKef/u', (SELECT id FROM roles WHERE name = 'Manager'), TRUE),
    ('jane@local.com', '$2b$12$7woG.X8EWLB4DW.R7BGa2.ryN3q.kv.5flm5Y13aIB55mEKzKef/u', (SELECT id FROM roles WHERE name = 'User'), TRUE),
    ('john@local.com', '$2b$12$7woG.X8EWLB4DW.R7BGa2.ryN3q.kv.5flm5Y13aIB55mEKzKef/u', (SELECT id FROM roles WHERE name = 'User'), TRUE)
    RETURNING id, email
)
INSERT INTO profiles (user_id, first_name, last_name, phone, avatar_url, bio, date_of_birth)
VALUES
((SELECT id FROM new_users WHERE email = 'admin@local.com'), 'System', 'Administrator', '+15550100', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 'Root administrator account.', '1980-01-01'),
((SELECT id FROM new_users WHERE email = 'manager@local.com'), 'Sarah', 'Manager', '+15550155', 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah', 'System Manager responsible for standard operations.', '1985-05-15'),
((SELECT id FROM new_users WHERE email = 'jane@local.com'), 'Jane', 'Doe', '+15550101', 'https://api.dicebear.com/7.x/bottts/svg?seed=jane', 'Full-stack software developer.', '1990-07-20'),
((SELECT id FROM new_users WHERE email = 'john@local.com'), 'John', 'Doe', '+15550102', 'https://api.dicebear.com/7.x/bottts/svg?seed=john', 'Content writer and designer.', '1992-11-12');

-- 5. Seed Organizations & Teams
INSERT INTO organizations (id, name, slug) VALUES
('aa000000-0000-0000-0000-000000000001', 'Acme Corporation', 'acme-corp'),
('aa000000-0000-0000-0000-000000000002', 'Stark Industries', 'stark-ind');

INSERT INTO teams (id, organization_id, name) VALUES
('bb000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', 'Engineering Team'),
('bb000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000001', 'Security Assurance'),
('bb000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000002', 'R&D Division');

-- 6. Map Memberships
-- Standard users/managers mapped to Orgs
INSERT INTO memberships (organization_id, user_id, role_id)
SELECT 'aa000000-0000-0000-0000-000000000001', id, role_id FROM users WHERE email IN ('manager@local.com', 'jane@local.com');

INSERT INTO memberships (organization_id, user_id, role_id)
SELECT 'aa000000-0000-0000-0000-000000000002', id, role_id FROM users WHERE email = 'john@local.com';

-- 7. Seed Email Verifications (Pre-verifying our seed accounts)
INSERT INTO email_verifications (user_id, verification_token_hash, expires_at, is_verified)
SELECT id, md5(email), NOW() + INTERVAL '1 day', TRUE FROM users;

-- 8. Seed Subscriptions, Payments & Invoices
INSERT INTO subscriptions (id, organization_id, plan_name, status, current_period_start, current_period_end) VALUES
('cc000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', 'Enterprise Tier', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days'),
('cc000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000002', 'Pro Tier', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days');

INSERT INTO payments (id, subscription_id, amount, currency, status, payment_method, transaction_id) VALUES
('dd000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000001', 999.00, 'USD', 'succeeded', 'credit_card', 'tx_acme_001'),
('dd000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000002', 199.00, 'USD', 'succeeded', 'bank_transfer', 'tx_stark_001');

INSERT INTO invoices (organization_id, subscription_id, payment_id, invoice_number, amount, status, due_date) VALUES
('aa000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000001', 'dd000000-0000-0000-0000-000000000001', 'INV-ACME-2026-001', 999.00, 'paid', NOW() + INTERVAL '25 days'),
('aa000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000002', 'dd000000-0000-0000-0000-000000000002', 'INV-STARK-2026-001', 199.00, 'paid', NOW() + INTERVAL '20 days');

-- 9. Notifications
INSERT INTO notifications (user_id, title, message, is_read)
SELECT id, 'Welcome to the Platform', 'Thanks for joining our enterprise secure SaaS application.', FALSE FROM users;

-- 10. AI Chat Session and Messages
INSERT INTO chat_sessions (id, user_id, title) VALUES
('ee000000-0000-0000-0000-000000000001', (SELECT id FROM users WHERE email = 'jane@local.com'), 'Security Code Review Session');

INSERT INTO chat_messages (session_id, sender, content) VALUES
('ee000000-0000-0000-0000-000000000001', 'user', 'Can you review this SQL query for vulnerabilities?'),
('ee000000-0000-0000-0000-000000000001', 'assistant', 'Certainly. Please paste the SQL query here. Remember to avoid concatenating inputs directly to prevent SQL injection.');
