# Discount Service

## About
The "Discount Service" is a service that helps businesses to have complicated discount codes and to provide it to their user-end.
"Discount Service" can generate unlimited discount codes for our business customers.

## Usage
### Requirements

- Docker: I use v20.10.7
- Docker Compose: Compose file is written in version 3.5, so any version supporting that would be fine.

### Pre run

- Check if ports 27017 and 3000 are free on your system.
- The project doesn't need any env setup, but the configs are hard coded, preferably don't touch them.

### Start

- Navigate to the folder of project in your terminal.
- Run `docker-compose up` or `docker-compose up -d` to detach it from your terminal session.
- Open your postman and import the collection and envs in `./postman` directory.
- Go on, try the endpoints.

## Mechanism
### descriptions
The service has two base endpoints,
one for the business and another for
the customer (customers of each
business should use a seperated endpoint,
probably like "/<business-id>/customer/ *"
but right now it's just "/customer/ *").

### Business endpoints
The business has two endpoints with base of "/business".

- First one is "/generate" which creates discount code[s];
and the other one is "/list" which will inform the business
of its active discount codes.

### Customer (user) endpoints
The customer has two endpoints with base of "/customer".
- First one is "/calculate" which calculates the final amount
based on the provided code and invoice amount;
and the other one is "/activate" which will
trigger the usage of that code (right now it just
returns the final amount, but it should be activating
the code on the invoice which does not exist right now).

## API Documents
`api_base_url = {host}/api/discount`

### Business
1. Generate code

- Endpoint: `{api_base_url}/business/generate`
- Headers: `x-merchant-access: merchant-xx-token` (it's static right now)
- Method: `POST`
- Body:
```{
    "count": 5, // Count of discount codes to generate
    "expiryDate": "", // The date till which the codes are valid (empty or null means the codes will not expire over time).
    "staticName": null, // If filled, count will be 1 and code will be equal to staticName.
    "ownerUser": null, // If supposed to be for a unique user. (I didn't get the time to make it get a list of users and generate one or some codes for each).
    "perUserUsageLimit": 1, // Limits the usage count per user.
    "totalUsageLimit": 0, // Limits the total usage count; when reached, the code will expire.
    "calculationPolicy": { // This part contains the data for calculations.
        "calculationType": "percentage", // Supports ["percentage", "fixed_amount"]
        "activationMargin": 10000, // If this is filled, the code won't effect invoices under this amount. default: 0
        "calculationDiscountHighMargin": 50000, // The total discount amount on a single invoice allowed
        "amount": 50 // The amount which is between 0 and 100 if the calculationType is percentage and is the fixed_amount in case of fixed_amount type.
    }
}
```

- Response body: A list of code-schema (Find it bellow at schemas section).

2. List (active) codes

- Endpoint: `{api_base_url}/business/list`
- Headers: `x-merchant-access: merchant-xx-token` (it's static right now)
- Method: `GET`
- Body: Empty
- Response body: A list of code-schema

### Customer
1. Calculate discount amount

- Endpoint: `{api_base_url}/customer/calculate`
- Headers: `x-user-access: user-zz-token` (it's static right now)
- Method: `POST`
- Body: 
```
{
    "code": "<the-code>",
    "amount": <invoice-amount>
}
```
- Response body: calc-schema

2. Activate discount code

- Endpoint: `{api_base_url}/customer/avtivate`
- Headers: `x-user-access: user-zz-token` (it's static right now)
- Method: `POST`
- Body: 
```
{
    "code": "<the-code>",
    "amount": <invoice-amount>
}
```
- Response body: calc-schema


- note: This one is different from calculate. It'll trigger the counters.

## Schemas
### Discount Code (code-schema):
```
{
  "code": "code",
  "usageCounter": 0,
  "activationCounterMap": []
}
```

### Calculated Invoice (calc-schema)
```
{
  "amount": new-amount,
  "discount": discount-amount
}
```
