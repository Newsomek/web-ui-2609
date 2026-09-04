# PracticeSpend — Security, Privacy, and Data Boundaries

## Prototype philosophy

Avoid HIPAA scope by product design, not by pretending business data is harmless.

PracticeSpend is intended for purchasing and business documents only.

## Prohibited data

The application should display a clear warning:

> Do not upload patient records, patient names, medical records, photographs, pathology, clinical documents, or other protected health information. PracticeSpend is for business purchasing documents only.

## Local-first trust message

For the prototype:

> Your uploaded purchasing information is processed locally in this browser and is not transmitted to a PracticeSpend server.

This statement must remain technically true.

## Business sensitivity

Invoices may still contain sensitive commercial information, including:

- negotiated prices;
- supplier relationships;
- purchasing volume;
- business addresses;
- account numbers;
- payment terms;
- internal locations/cost centers.

Therefore the prototype should:

- avoid sending imported data to analytics/telemetry services;
- avoid third-party scripts that receive invoice content;
- make local persistence explicit and optional;
- provide `Clear Practice Data`;
- provide export before deletion;
- avoid storing imported invoice content in source control;
- never put real practice data into demo fixtures.

## External PDF conversion warning

If the user chooses to use ChatGPT or another external AI/document service to convert a PDF invoice, that is a separate disclosure to that external provider.

PracticeSpend should tell users to:

- verify the document contains no patient information;
- use a provider they are comfortable sharing business invoices with;
- review the converted CSV/XLSX for accuracy before importing.

## Commercial-version minimum controls

If PracticeSpend becomes hosted SaaS, introduce before storing customer data centrally:

- authentication;
- MFA option;
- tenant/organization isolation;
- server-side authorization;
- private object storage;
- encryption in transit and at rest;
- secure secrets management;
- audit logging for sensitive actions;
- backups and tested restoration;
- vulnerability/dependency scanning;
- access revocation;
- incident response process;
- data retention/deletion policy;
- customer export;
- privacy policy and terms.

## Scope rule

Do not add clinical workflows merely because the customer is a healthcare practice. The product should remain outside patient-care data unless the business deliberately chooses to undertake a different compliance posture in the future.
