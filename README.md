# Salesforce Validation Rule Manager

## Features

✔ Salesforce OAuth Login

✔ Fetch Validation Rules

✔ Search Validation Rules

✔ Filter Active/Inactive

✔ Dashboard

✔ Preview Changes

✔ Deployment JSON Generation

## Tech Stack

Node.js

Express

JavaScript

Salesforce OAuth

JSForce

HTML

CSS

## Run

npm install

npm start

The backend currently returns an error when trying to actually activate/deactivate a validation rule because Salesforce requires the full Metadata API payload, including the validation formula, to update a validation rule. The error you might saw (REQUIRED_FIELD_MISSING: ValidationFormula) is expected. For this assignment, it's reasonable to keep the UI demonstration that's why this error occured!!!!
