CREATE TABLE IF NOT EXISTS price_plan (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(20) NOT NULL,
    sms_price FLOAT NOT NULL,
    call_price FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    user_plan INTEGER NOT NULL,
    FOREIGN KEY (user_plan) REFERENCES price_plan(id)
);