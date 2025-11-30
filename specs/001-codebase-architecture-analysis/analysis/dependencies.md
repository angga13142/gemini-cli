# Dependencies Catalog

**Created**: 2025-11-30  
**Purpose**: Categorize all dependencies into UI-related (removable) and
logic-related (essential) categories

## Categorization Criteria

- **UI Dependencies**: Only imported in UI/presentation files, used for
  rendering/formatting/display
- **Logic Dependencies**: Used in backend/core logic, required for API
  communication or data processing
- **Shared Dependencies**: Used in both UI and logic, or serves
  configuration/validation purposes used by both layers

## UI Dependencies (🔴 - Removable)

| Package Name                     | Version | Usage Locations | Essential | Rationale | Can Remove |
| -------------------------------- | ------- | --------------- | --------- | --------- | ---------- |
| _[To be filled during analysis]_ |         |                 | ❌        |           | ✅         |

## Logic Dependencies (🟢 - Essential)

| Package Name                     | Version | Usage Locations | Essential | Rationale | Can Remove |
| -------------------------------- | ------- | --------------- | --------- | --------- | ---------- |
| _[To be filled during analysis]_ |         |                 | ✅        |           | ❌         |

## Shared Dependencies (🟡 - Analyze)

| Package Name                     | Version | Usage Locations | Essential | Rationale | Can Remove |
| -------------------------------- | ------- | --------------- | --------- | --------- | ---------- |
| _[To be filled during analysis]_ |         |                 | ⚠️        |           | ⚠️         |

## Dependency Analysis Summary

- **Total Dependencies**: _[To be calculated]_
- **UI Dependencies**: _[To be counted]_
- **Logic Dependencies**: _[To be counted]_
- **Shared Dependencies**: _[To be counted]_

## Notes

- UI dependencies can be removed when replacing frontend
- Logic dependencies MUST be preserved
- Shared dependencies need analysis to determine if they can be split or must be
  kept
