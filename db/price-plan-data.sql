-- Note price plan data is pre populated using a SQL script, no screen is needed to create or update price plans. 
-- Just create a SQL script that inserts price plan data into the database.

INSERT INTO price_plan (plan_name, sms_price, call_price) 
VALUES ('sms100', '0.20', '2.35'), 
('call100', '0.45', '1.75'), 
('text-me', '0.17', '1.54');