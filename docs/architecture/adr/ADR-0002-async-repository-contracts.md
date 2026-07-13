# ADR-0002: Async Repository Contracts

- Status: Accepted
- Date: 2026-07-13

## Context

The project is moving from local in-memory adapters to PostgreSQL-backed repositories.
Node PostgreSQL access is asynchronous by nature and should not be hidden behind synchronous domain contracts.

Keeping synchronous repository interfaces creates one of these problems:

1. Block real I/O implementations.
2. Force unsafe anti-patterns to fake sync behavior.
3. Duplicate contracts per provider.

## Decision

All domain repository contracts are asynchronous and return Promise-based results.
This applies to academy, organization, and training repository interfaces.

Application services and query use cases are also async and await repository calls.

## Consequences

Positive:

- One contract per domain repository, regardless of provider.
- Local and PostgreSQL adapters can satisfy the same interface.
- Async boundaries are explicit in app pages and use cases.

Trade-offs:

- Call sites must use async/await.
- Client components should not call repositories directly.
  Server-side app services should fetch data and pass DTO/domain objects to client components.

## Transaction Semantics

For PostgreSQL, transaction execution must preserve a single connection for all queries in the transaction scope.
The transaction runner now uses an async context to attach the current client.
Repository queries resolve through a transaction-aware query helper, which uses:

1. Active transaction client when present.
2. Pool queries when no transaction is active.

This prevents accidental multi-connection behavior inside a logical transaction.

## Follow-up

- Implement PostgreSQL EducationContentRepository and remove database-provider fail-fast guard.
- Add write-side repository methods and transaction integration tests for commit/rollback behavior.
