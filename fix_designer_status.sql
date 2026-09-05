-- SQL Script to Fix Existing Designer Records
-- This updates all designers with status 'registered' to 'pending'
-- so they appear in the admin designer view

USE micasa;

-- Update existing designers from 'registered' to 'pending'
UPDATE tbl_login 
SET status = 'pending' 
WHERE role = 'designer' AND status = 'registered';

-- Show the updated records
SELECT l.login_id, l.username, l.role, l.status, d.designer_name, d.designer_email
FROM tbl_login l
LEFT JOIN tbl_designer d ON l.login_id = d.login_id
WHERE l.role = 'designer';
