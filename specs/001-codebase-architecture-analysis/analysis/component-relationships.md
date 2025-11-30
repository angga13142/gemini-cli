# Component Relationships Map

**Created**: 2025-11-30  
**Purpose**: Document relationships and dependencies between all identified
components

## Relationship Types

- **depends-on**: Component requires another component to function
- **uses**: Component calls or imports another component
- **imports**: Component imports another component's exports
- **calls**: Component invokes another component's functions/methods

## Backend-to-Backend Dependencies

| From Component                   | To Component | Relationship Type | Critical | Notes |
| -------------------------------- | ------------ | ----------------- | -------- | ----- |
| _[To be filled during analysis]_ |              |                   |          |       |

## Frontend-to-Backend Dependencies

| From Component                   | To Component | Relationship Type | Critical | Notes |
| -------------------------------- | ------------ | ----------------- | -------- | ----- |
| _[To be filled during analysis]_ |              |                   |          |       |

## Frontend-to-Frontend Dependencies

| From Component                   | To Component | Relationship Type | Critical | Notes |
| -------------------------------- | ------------ | ----------------- | -------- | ----- |
| _[To be filled during analysis]_ |              |                   |          |       |

## Shared Component Relationships

| Component                        | Used By | Relationship Type | Can Split? | Notes |
| -------------------------------- | ------- | ----------------- | ---------- | ----- |
| _[To be filled during analysis]_ |         |                   |            |       |

## Dependency Graph

_[To be created as visual/text representation]_

## Critical Relationships

Components marked as "Critical" indicate relationships that MUST be preserved
during refactoring. Breaking these relationships would cause system failure.

## Notes

- All relationships documented here are discovered during code tracing
- Critical relationships are highlighted for refactoring planning
- Shared components need special attention to determine if they can be split
