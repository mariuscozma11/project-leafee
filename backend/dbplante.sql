CREATE TABLE plante (
    plante_id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    imagine BYTEA,
    umiditate_sol JSONB,
    umiditate_aer JSONB,
    luminozitate JSONB,
    temperatura JSONB
);