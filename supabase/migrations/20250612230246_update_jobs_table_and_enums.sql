
CREATE TYPE office_policy_types AS ENUM ('unknown', 'remote', 'hybrid', 'in_office');

alter table if exists jobs
    add office_policy office_policy_types;
