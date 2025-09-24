#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration constants
const server = new McpServer({
  name: "spec-mcp",
  version: "1.1.0"
});

// Codebase Analysis Tool Registration
server.registerTool(
  'generate-codebase-analysis',
  {
    title: 'Generate Codebase Analysis Documents',
    description: 'Analyzes codebase and generates three foundational analysis documents: product.md, tech.md, and structure.md in .spec/steering/ directory. These documents provide comprehensive analysis of the product features, technology stack, and project structure. Checks if files already exist and skips generation unless force_regenerate is true.',
    inputSchema: {
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)"),
      additional_context: z.string().optional().describe("Additional context about the project"),
      force_regenerate: z.boolean().optional().describe("Force regeneration even if files exist (default: false)")
    }
  },
  async ({ project_path = '.', additional_context, force_regenerate = false }) => {
    const prompt = `# ⚠️ IMPORTANT: YOU MUST EXECUTE THE FOLLOWING ACTIONS

This MCP tool provides instructions that YOU (the AI assistant) must execute using your available file system tools.
**DO NOT** just report success - you MUST actually create the files using Write or MultiEdit tools.

# Generate Steering Documents for ${project_path}

## PREREQUISITE: CHECK IF FILES ALREADY EXIST
${!force_regenerate ? `
IMPORTANT: Before generating new files, FIRST check if steering documents already exist:
1. **USE Read tool** to check if file exists: ${project_path}/.spec/steering/product.md
2. **USE Read tool** to check if file exists: ${project_path}/.spec/steering/tech.md
3. **USE Read tool** to check if file exists: ${project_path}/.spec/steering/structure.md

If ALL THREE files already exist:
- STOP HERE and return: "✅ Steering documents already exist at ${project_path}/.spec/steering/. No regeneration needed. Use force_regenerate=true to regenerate."
- Do NOT proceed with generation

If ANY files are missing, proceed with generation below.
` : 'FORCE REGENERATE MODE: Regenerating all steering documents even if they exist.'}

You MUST create THREE separate steering documents that match exact structure and content approach.

## 🔴 CRITICAL: YOU MUST CREATE THE FILES - NOT JUST REPORT SUCCESS
### File Creation Instructions:
1. **USE Bash tool** to create directory: mkdir -p ${project_path}/.spec/steering/
2. **USE Write tool** to create THREE separate files with exact filenames:
   - ${project_path}/.spec/steering/product.md
   - ${project_path}/.spec/steering/tech.md
   - ${project_path}/.spec/steering/structure.md
3. **USE Read tool** to verify each file exists after creation

⚠️ The files MUST be physically created on the filesystem. Do NOT proceed without using the Write tool.

## DOCUMENT SPECIFICATIONS:

### 1. PRODUCT.MD - Product Overview
Create ${project_path}/.spec/steering/product.md with:

# Product Overview

## Purpose
[Analyze the codebase and describe what this product/application does]

## Target Users
- [Primary user type]: [Their needs and use cases]
- [Secondary user type]: [Their needs and use cases]

## Key Features
- [Feature 1]: [Description based on codebase analysis]
- [Feature 2]: [Description based on codebase analysis]
- [Feature 3]: [Description based on codebase analysis]

## Business Objectives
- [Objective 1 derived from codebase context]
- [Objective 2 derived from codebase context]

## Success Metrics
- [Metric 1]: [Target/expectation]
- [Metric 2]: [Target/expectation]

## Product Context
[Additional context about the product's market, competition, or unique value proposition]

---

### 2. TECH.MD - Technology Stack
Create ${project_path}/.spec/steering/tech.md with:

# Technology Stack

## Core Technologies
- **Primary Language**: [Language and version from package.json/requirements/etc]
- **Framework**: [Main framework detected]
- **Runtime**: [Node.js, Python, .NET, etc. with version]
- **Database**: [Database system if detected]

## Development Tools
- **Package Manager**: [npm, yarn, pip, maven, cargo, dotnet, etc.]
- **Build System**: [webpack, vite, gradle, maven, cargo, msbuild, etc.]
- **Testing Framework**: [jest, pytest, junit, nunit, go test, etc.]
- **Linter/Formatter**: [eslint, prettier, black, checkstyle, clippy, etc.]

## Build and Test Commands
[Auto-detect from project configuration files and scripts]

### Essential Commands
- **Install Dependencies**: [e.g., npm install, pip install -r requirements.txt, dotnet restore]
- **Build Project**: [e.g., npm run build, mvn compile, cargo build, dotnet build]
- **Run Tests**: [e.g., npm test, pytest, mvn test, dotnet test, go test ./...]
- **Lint/Format Check**: [e.g., npm run lint, ruff check, gradle checkstyle, cargo clippy]
- **Type Check**: [e.g., tsc --noEmit, mypy, if applicable]
- **Start Development**: [e.g., npm run dev, python app.py, dotnet run]
- **Production Build**: [e.g., npm run build:prod, mvn package, cargo build --release]

### Project-Specific Commands
[Any custom commands specific to this project from package.json, Makefile, etc.]

## Libraries and Dependencies
### Required Libraries
[List key dependencies from package.json/requirements with purpose]
- [Library]: [Version] - [Purpose]

### Preferred Libraries
[Document preferred libraries for common tasks]
- UI Components: [Library preference]
- State Management: [Library preference]
- HTTP Client: [Library preference]

## Development Guidelines
- Variable naming: [Convention detected from codebase]
- Function naming: [Convention detected from codebase]
- File naming: [Convention detected from codebase]
- Code style: [Style detected from config files]

## Performance Requirements
[Any performance considerations detected or inferred]

## Security Requirements
[Any security patterns or requirements detected]

## Technical Constraints
[Any constraints detected from the codebase]

---

### 3. STRUCTURE.MD - Project Structure
Create ${project_path}/.spec/steering/structure.md with:

# Project Structure

## Directory Organization
\`\`\`
[Generate actual directory tree from the project]
\`\`\`

## File Naming Conventions
- Components: [Pattern detected from codebase]
- Services: [Pattern detected from codebase]
- Types: [Pattern detected from codebase]
- Tests: [Pattern detected from codebase]

## Import Patterns
- Relative imports: [Rules detected from codebase]
- Absolute imports: [Rules detected from codebase]
- External dependencies: [Patterns detected]

## Code Organization
- [Organizational principle 1 detected]
- [Organizational principle 2 detected]
- [Index file strategy if detected]

## Architectural Patterns
- [Pattern 1]: [Description of how it's implemented]
- [Pattern 2]: [Description of how it's implemented]

## Testing Structure
- Unit tests: [Location pattern]
- Integration tests: [Location pattern if exists]
- Test naming: [Convention detected]

## Configuration Files
[List and explain key config files: .env, config/, etc.]

${additional_context ? `\n## Additional Context\n${additional_context}` : ''}

---

## 🔴 EXECUTION STEPS - YOU MUST FOLLOW EXACTLY:
1. Analyze the codebase at: ${project_path} using Read, Grep, and Glob tools
   - **IMPORTANT**: Check package.json, pom.xml, build.gradle, Cargo.toml, go.mod, requirements.txt, *.csproj, Makefile, etc.
   - Extract actual build/test/lint commands from these files
   - Look for CI configuration files (.github/workflows, .gitlab-ci.yml, Jenkinsfile, etc.)
2. **USE Bash tool** to create directory: mkdir -p ${project_path}/.spec/steering/
3. **USE Write tool** to create product.md with product overview and business context
4. **USE Write tool** to create tech.md with comprehensive technology stack analysis
   - **CRITICAL**: In the "Build and Test Commands" section, document ACTUAL commands found in the project
   - Do not use placeholder text like "[e.g., npm test]" - use the real commands from package.json scripts or build files
5. **USE Write tool** to create structure.md with detailed project organization
6. **USE Read tool** to verify all three files exist and contain expected content:
   - ${project_path}/.spec/steering/product.md
   - ${project_path}/.spec/steering/tech.md
   - ${project_path}/.spec/steering/structure.md

## SUCCESS CRITERIA:
✅ Three separate markdown files PHYSICALLY CREATED on filesystem (not just reported)
✅ Files verified to exist using Read tool
✅ Each file follows content structure exactly
✅ All content derived from actual codebase analysis
✅ Files ready for use with generate-plan tool

⚠️ FINAL REMINDER: You MUST use Write tool to create the files. Do not just say they were created.

These files should be automatically included in every AI interaction.`;

    return {
      content: [{
        type: "text",
        text: prompt
      }]
    };
  }
);

// Plan Generation Tool Registration
server.registerTool(
  'generate-plan',
  {
    title: 'Generate Plan',
    description: 'Creates a single plan.md that merges Requirements (EARS) and Design (architecture, models, APIs) with traceability, ready for task generation. Uses current directory if project_path not specified.',
    inputSchema: {
      user_request: z.string().describe("The user's feature request or requirement"),
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)"),
      // Optional steering content if the caller wants to inject it directly:
      product_steering: z.string().optional().describe("Content of product.md steering"),
      tech_steering: z.string().optional().describe("Content of tech.md steering"),
      structure_steering: z.string().optional().describe("Content of structure.md steering"),
      existing_codebase_context: z.string().optional().describe("Relevant existing code context"),
      // Evidence-based context from pre-analysis
      analysis_context: z.string().optional().describe("Optional: Code examples and patterns discovered during analysis"),
      evidence_notes: z.string().optional().describe("Optional: Notes about what exists vs what needs creation")
    }
  },
  async ({ user_request, project_path = '.', product_steering, tech_steering, structure_steering, existing_codebase_context, analysis_context, evidence_notes }) => {
    const prompt = `# ⚠️ IMPORTANT: YOU MUST EXECUTE THE FOLLOWING ACTIONS

This MCP tool provides instructions that YOU (the AI assistant) must execute using your available file system tools.
**DO NOT** just report success - you MUST actually create the file using Write or MultiEdit tools.

# Generate Merged Plan (Requirements + Design) for ${project_path}

## SIMPLICITY PRINCIPLES
1. Start with minimal viable tasks
2. Avoid over-engineering test requirements
3. Only include necessary sections per task
4. Focus on implementation, not process
5. Prefer iterative improvements over perfection

## PREREQUISITE FILES TO READ
Before generating the plan, FIRST check for and read these steering documents if they exist:
1) **USE Read tool** to load: ${project_path}/.spec/steering/product.md
2) **USE Read tool** to load: ${project_path}/.spec/steering/tech.md
3) **USE Read tool** to load: ${project_path}/.spec/steering/structure.md

If these files exist, incorporate their content into the plan generation below.
If they don't exist AND no steering content parameters were provided:
- Consider if you need to generate them first using the generate-codebase-analysis tool
- OR use the optional steering content parameters provided
- OR proceed without them if not critical for this specific plan

## 🔴 CRITICAL: YOU MUST CREATE THE FILE - NOT JUST REPORT SUCCESS
### File Creation Instructions:
1) **USE Bash tool** to create directory: mkdir -p ${project_path}/.spec/specs/
2) **Generate the complete plan.md content** based on the template below
3) **USE Write tool** to save the generated content to: ${project_path}/.spec/specs/plan.md
4) **USE Read tool** to verify the file exists after creation

⚠️ The file MUST be physically created on the filesystem. Do NOT proceed without using the Write tool.

## Inputs
### User Request
${user_request}

${product_steering ? `### Product Steering (Context)\n${product_steering}\n` : ''}
${tech_steering ? `### Tech Steering (Context)\n${tech_steering}\n` : ''}
${structure_steering ? `### Structure Steering (Context)\n${structure_steering}\n` : ''}
${existing_codebase_context ? `### Existing Codebase Context\n${existing_codebase_context}\n` : ''}
${analysis_context ? `### Analysis Context (Examples and Patterns)\n${analysis_context}\n` : ''}
${evidence_notes ? `### Evidence Notes\n${evidence_notes}\n` : ''}

---

## Guardrails
- Use file paths, names, APIs, and data types only when confirmed in references.
- Quote evidence verbatim for code examples; tag each snippet as [EXAMPLE] with source: path[:line].

## Reference Materials (MANDATORY)
- Read all steering documents if present: .spec/steering/product.md, tech.md, structure.md
- Treat all read content as normative sources for evidence

## Evidence Tracking Instructions
Tag all technical details with:
- [EXISTS] = Already in codebase (include file path)
- [EXAMPLE] = From external source (cite source)
- [NEEDED] = Must be created or decided

Rules:
1. Only include runnable code if [EXISTS] or [EXAMPLE]
2. Mark proposals and new designs as [NEEDED]
3. Each requirement should reference evidence tags where applicable
4. Include provided analysis_context examples in Section 2.7

# plan.md

## 0. Overview
- Purpose: Summarize the feature and intended outcomes in 2–3 sentences.
- Scope: What's in and what's out for this iteration.
- Assumptions: Any constraints or assumptions that influence design.

## 1. Requirements
Provide numbered requirements with user stories and EARS acceptance criteria for each.
- Formatting: “As a [role], I want [goal] so that [benefit]”.
- Use EARS for every acceptance criterion: WHEN [condition] THEN THE SYSTEM SHALL [expected behavior].

### 1.1 Requirement R-1: <Extract specific issue from your context> or <Title>
- User Story: As a <specific role from context>, I want <specific change from context>, so that <...>.
- Files Affected: <List every file:line mentioned in context for this requirement>
- Acceptance Criteria (EARS)
  1) WHEN <specific condition using actual names from context> THEN THE SYSTEM SHALL <specific behavior>
  2) WHEN <specific condition> AND <specific state> THEN THE SYSTEM SHALL <specific action>
- Evidence Tags: Mark all technical details as [EXISTS], [EXAMPLE], or [NEEDED]

FORBIDDEN: Placeholders like [...], generic names, or any bracketed text for humans to fill
REQUIRED: Every <bracket> must be replaced with actual values from context or marked [NEEDED] with rationale

### 1.2 Requirement R-2: <Extract specific issue from your context>
- User Story: As a <specific role from context>, I want <specific change referencing actual files>, so that <measurable benefit>.
- Files Affected: <List every file:line mentioned in context for this requirement>
- Acceptance Criteria (EARS)
  1) WHEN <specific condition using actual names from context> THEN THE SYSTEM SHALL <specific behavior>
- Evidence Tags: Mark all technical details as [EXISTS], [EXAMPLE], or [NEEDED]

[Add more requirements R-3, R-4… as needed]

#### 1.n Edge Cases and Errors
- [Edge case or error] → Expected behavior.

#### 1.x Global Non-Functional Requirements
- Performance targets, security, accessibility, scalability, compatibility, observability.

## 2. Design
Explain how the solution satisfies each requirement, with explicit links to R-IDs.

### 2.1 Architecture
- Components and boundaries, responsibilities, and data flow.
- Key decisions/trade-offs and rationale.

#### Sequence Diagram
\`\`\`mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant API
  participant DB
  User->>Frontend: [Action]
  Frontend->>API: [Request]
  API->>DB: [Query]
  DB-->>API: [Result]
  API-->>Frontend: [Response]
  Frontend-->>User: [Result]
\`\`\`

### 2.2 Data Models
- Define entities and important fields, include TypeScript interfaces or schemas.
\`\`\`typescript
interface ExampleEntity {
  id: string
  /* fields */
  createdAt: string
  updatedAt: string
}
\`\`\`

### 2.3 API Design
- Endpoints or GraphQL schema with request/response shapes.
- AuthZ/AuthN flows, versioning, and rate limits.

### 2.4 Integration Points
- External services, webhooks, queues, and error strategies.

### 2.5 Security, Performance, Accessibility
- Threat model highlights, validation/sanitization.
- Caching/indexing and latency budgets.
- A11y: keyboard navigation, focus management, ARIA.

### 2.6 Testing Strategy
- Unit: modules/components and cases.
- Integration: API/database flows.
- E2E: primary user journeys tied to R-IDs.

### 2.7 Implementation Evidence

#### What Exists [EXISTS]
For EVERY file mentioned in your context, list here:
<filepath>:<lines> - <description from context> - <action needed>

Requirements:
- Entries with real file paths (or as many as context provides)
- Include key functions/classes/modules and their locations
- Each entry must trace to context source

#### Reference Examples [EXAMPLE]
Copy EVERY code example from your context VERBATIM:
\`\`\`<language>
[exact code from context]
\`\`\`
source: <path[:line]>

Requirements:
- Verbatim code blocks (or as many as context provides)
- Each must cite source: <path[:line]>

#### What's Needed [NEEDED]
Every missing artifact or unknown from context:
<Specific action> - <Files affected or "location TBD"> - <Rationale from context>

Requirements:
- Every recommendation from context must appear here
- If location unknown, specify "location TBD" with discovery step

## 3. Traceability Matrix
Map each requirement to design elements to support task generation.
- R-1 → Components: […], APIs: […], Data models: […].
- R-2 → Components: […], APIs: […], Data models: […].
[Add rows per R-ID]

## 4. Definition of Done
- All EARS acceptance criteria met and testable.
- Tests passing (unit/integration/E2E), performance/security gates met.
- Documentation updated, feature flags and rollout plan specified.

## 5. Plan Review Required

⚠️ **STOP HERE - HUMAN REVIEW REQUIRED**
- This plan must be carefully reviewed by a human before proceeding
- DO NOT automatically generate tasks from this plan
- User must explicitly request task generation after reviewing and approving the plan
- Review should verify requirements completeness, design decisions, and scope

---

## 🔴 EXECUTION STEPS - YOU MUST FOLLOW EXACTLY:
1) FIRST: **USE Read tool** to read the steering documents from disk (paths listed in PREREQUISITE FILES section above)
2) Analyze steering docs (from disk and/or parameters) and codebase context provided
3) EXTRACT from context and ORGANIZE into plan format:
   - Statements trace to referenced content
   - Files in context must appear in plan
   - Use direct quotes and exact names from context
   - If context lacks detail for a section, include [NEEDED] with rationale
   - Never fabricate examples, endpoints, file paths, or conventions
   - When specifics unknown, emit [NEEDED] with discovery step (e.g., "read X/Y config to determine API routes")
4) **USE Bash tool** to create directory: mkdir -p ${project_path}/.spec/specs/
5) **USE Write tool** to save the complete generated content to: ${project_path}/.spec/specs/plan.md
6) **USE Read tool** to verify the file exists at: ${project_path}/.spec/specs/plan.md
7) **STOP HERE** - Display message: "✅ Plan generated and verified at ${project_path}/.spec/specs/plan.md
⚠️ Please review the plan carefully before requesting task generation.
📋 To generate tasks after review, explicitly ask: 'Generate tasks from the plan'"

## SUCCESS CRITERIA
- One file: .spec/specs/plan.md PHYSICALLY CREATED on filesystem (not just reported)
- File verified to exist using Read tool
- Requirements are clear, testable, and numbered (R-1, R-2…)
- Design explicitly maps back to R-IDs and includes at least one diagram and concrete schemas
- Plan is complete and awaiting human review before any task generation

## ⚠️ IMPORTANT: DO NOT PROCEED TO TASK GENERATION
- This tool ONLY generates the plan document
- Task generation requires explicit user request AFTER plan review
- DO NOT automatically invoke generate-tasks tool
- User must review and approve the plan first

⚠️ FINAL REMINDER: You MUST use Write tool to create the file. Do not just say it was created.
`;

    return {
      content: [{ type: "text", text: prompt }]
    };
  }
);


// Task Generation Tool Registration
server.registerTool(
  'generate-tasks',
  {
    title: 'Generate Tasks',
    description: 'Reads plan.md from .spec/specs/plan.md and breaks it down into discrete, implementable tasks with requirement traceability, dependencies, and comprehensive acceptance criteria. The plan.md file must exist before running this tool - if not found, it will report an error instructing to generate a plan first.',
    inputSchema: {
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)")
    }
  },
  async ({ project_path = '.' }) => {

    const prompt = `# ⚠️ IMPORTANT: YOU MUST EXECUTE THE FOLLOWING ACTIONS

This MCP tool provides instructions that YOU (the AI assistant) must execute using your available file system tools.
**DO NOT** just report success - you MUST actually create the files using Write or MultiEdit tools.

# Generate Task Breakdown for ${project_path}

## SIMPLICITY PRINCIPLES
1. Start with minimal viable tasks
2. Avoid over-engineering test requirements
3. Only include necessary sections per task
4. Focus on implementation, not process
5. Prefer iterative improvements over perfection

## PREREQUISITE: READ THE PLAN FROM DISK
**MANDATORY FIRST STEP - Read the existing plan document:**
1) **USE Read tool** to load: ${project_path}/.spec/specs/plan.md
   - If this file doesn't exist, STOP and report: "❌ Error: plan.md not found at ${project_path}/.spec/specs/plan.md. Please generate a plan first using the generate-plan tool."
   - DO NOT proceed without successfully reading this file
   - PAY SPECIAL ATTENTION to Section 2.7 "Implementation Evidence" for [EXISTS], [EXAMPLE], and [NEEDED] tags

Also check for and read steering documents if needed for context:
2) ${project_path}/.spec/steering/product.md (if exists)
3) ${project_path}/.spec/steering/tech.md (if exists)
4) ${project_path}/.spec/steering/structure.md (if exists)

## 🔴 CRITICAL: YOU MUST CREATE THE FILE - NOT JUST REPORT SUCCESS
### File Creation Instructions:
1. **Create directory using Bash tool**: mkdir -p ${project_path}/.spec/specs/
2. **Generate the complete tasks.md content** based on the plan you read from disk
3. **USE THE WRITE TOOL** to save the generated content to: ${project_path}/.spec/specs/tasks.md
4. **VERIFY the file exists** using Read tool after creation

⚠️ The file MUST be physically created on the filesystem. Do NOT proceed without using the Write tool.

---

# tasks.md

## Task Status Legend
- ⚪ Not Started
- 🟡 In Progress
- ✅ Done

## Task List

### Task T-1: [Clear Action-Oriented Title]
**Status**: ⚪ Not Started
**Evidence**: [EXISTS/EXAMPLE/NEEDED] - Source reference from Section 2.7
**Requirement Traceability**: Links to R-1, R-2 from plan.md
**Priority**: High/Medium/Low

#### Description
[Detailed explanation of what needs to be implemented, referencing specific requirements from plan.md]

#### Acceptance Criteria (EARS Format)
- [ ] WHEN [specific condition] THEN THE SYSTEM SHALL [expected behavior]
- [ ] WHEN [error condition] THEN THE SYSTEM SHALL [error handling behavior]
- [ ] WHEN [edge case] THEN THE SYSTEM SHALL [edge case handling]
- [ ] Performance requirement: [specific measurable criteria]
- [ ] Security requirement: [specific security validation]

#### Implementation Details
**Files to Create:**
- \`src/components/ComponentName.tsx\` - [Purpose and main functionality]
- \`src/types/TypeDefinitions.ts\` - [Interface definitions from design]
- \`src/services/ServiceName.ts\` - [Business logic implementation]

**Files to Modify:**
- \`src/app/routes.tsx\` - [Add new routes/navigation]
- \`src/utils/api.ts\` - [Add new API endpoints]
- \`package.json\` - [Add dependencies if needed]

**Code Patterns and Examples:**
[Include actual code examples from Section 2.7 that are marked [EXISTS] or [EXAMPLE]]
\`\`\`
// If [EXISTS]: Include actual code from the codebase
// If [EXAMPLE]: Include verified example from documentation
// If [NEEDED]: Include interface/structure only, no implementation
\`\`\`

**Database Changes:**
\`\`\`sql
-- Schema changes from design document
CREATE TABLE example_table (
  id UUID PRIMARY KEY,
  -- Fields from data models
);
\`\`\`

#### Dependencies
- **Blocked By**: [T-X, T-Y] - Must complete these tasks first
- **Blocks**: [T-Z] - These tasks depend on this completion
- **External Dependencies**: [API keys, third-party services, etc.]

#### Testing Requirements
**Unit Tests:** \`tests/unit/ComponentName.test.tsx\`
- [ ] Test happy path scenario
- [ ] Test error handling for [specific error case]
- [ ] Test edge case: [specific edge case from requirements]
- [ ] Test validation logic
- [ ] Mock external dependencies

**Integration Tests:** \`tests/integration/FeatureName.test.tsx\`
- [ ] Test API endpoint integration
- [ ] Test database interactions
- [ ] Test authentication/authorization
- [ ] Test cross-component communication

**E2E Tests:** \`tests/e2e/UserJourney.spec.tsx\`
- [ ] Test complete user workflow from R-[X]
- [ ] Test error recovery scenarios
- [ ] Test responsive design on mobile/desktop

#### Implementation Notes
- **Security**: Input validation, sanitization, authorization checks
- **Performance**: Caching strategy, query optimization, loading states
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Mobile**: Touch interactions, responsive breakpoints, gesture handling
- **Error Handling**: User-friendly error messages, fallback UI, retry logic
- **Logging**: Debug info, error tracking, user action tracking
- **Monitoring**: Performance metrics, error rates, user engagement

#### Manual Testing Checklist
1. [ ] Verify requirement R-[X] acceptance criteria met
2. [ ] Test on different screen sizes (mobile, tablet, desktop)
3. [ ] Test with keyboard navigation only
4. [ ] Test error scenarios and recovery
5. [ ] Verify loading states and transitions
6. [ ] Test with slow network conditions
7. [ ] Verify accessibility with screen reader

---

### Task T-2: [Next Task Title]
**Status**: ⚪ Not Started
**Evidence**: [EXISTS/EXAMPLE/NEEDED] - Source reference from Section 2.7
**Requirement Traceability**: Links to R-[X] from plan.md
[Continue with same structure...]

### Research/Design Tasks (for [NEEDED] items with questions)
For items marked [NEEDED] that require clarification:
- Create research tasks to investigate options
- Create design tasks to document decisions
- Implementation tasks should wait until research/design is complete

---

## Task Phases and Dependencies

### Phase 1: Foundation (Prerequisites)
- **T-1**: [Setup and Core Types]
- **T-2**: [Database Schema and Migrations]
- **T-3**: [Basic API Structure]

### Phase 2: Core Features
- **T-4**: [Main Feature Implementation] (depends on T-1, T-2)
- **T-5**: [Business Logic Layer] (depends on T-2, T-3)
- **T-6**: [User Interface Components] (depends on T-1, T-4)

### Phase 3: Integration and Enhancement
- **T-7**: [API Integration] (depends on T-4, T-5)
- **T-8**: [Error Handling and Edge Cases] (depends on T-6, T-7)
- **T-9**: [Performance Optimization] (depends on T-7)

### Phase 4: Quality and Launch
- **T-10**: [Comprehensive Testing] (depends on T-8, T-9)
- **T-11**: [Documentation and Deployment] (depends on T-10)
- **T-12**: [Monitoring and Observability] (depends on T-11)

## Dependency Visualization
\`\`\`mermaid
graph TD
    T1[T-1: Setup] --> T4[T-4: Core Feature]
    T2[T-2: Database] --> T4
    T2 --> T5[T-5: Business Logic]
    T3[T-3: API Structure] --> T5
    T4 --> T6[T-6: UI Components]
    T4 --> T7[T-7: Integration]
    T5 --> T7
    T6 --> T8[T-8: Error Handling]
    T7 --> T8
    T7 --> T9[T-9: Performance]
    T8 --> T10[T-10: Testing]
    T9 --> T10
    T10 --> T11[T-11: Documentation]
    T11 --> T12[T-12: Monitoring]
\`\`\`

## Parallel Work Opportunities
- **T-1** and **T-3** can be worked on simultaneously
- **T-4** and **T-5** can be developed in parallel after Phase 1
- **T-8** and **T-9** can be tackled by different team members

## Risk Assessment
### High Risk Tasks
- **T-[X]**: [Complex external integration] - *Mitigation: Early API testing, fallback strategy*
- **T-[Y]**: [Performance-critical component] - *Mitigation: Benchmarking, incremental optimization*

### Critical Path
T-1 → T-2 → T-4 → T-7 → T-8 → T-10 → T-11

## Task Execution Guidelines
1. **One Task at a Time**: Complete each task fully before moving to the next
2. **Status Updates**: Update task status (⚪ → 🟡 → ✅) as you progress
3. **Requirement Validation**: Verify each acceptance criterion before marking done
4. **Code Review**: All tasks require review before completion
5. **Testing**: Unit and integration tests must pass before task completion
6. **Documentation**: Update relevant docs as part of each task

## Next Steps
1. Review this task breakdown against the original plan.md
2. Validate task dependencies and adjust if needed
3. Begin with Phase 1 foundation tasks
5. Use verify-implementation tool after each task completion

---

## 🔴 EXECUTION STEPS - YOU MUST FOLLOW EXACTLY:
1. **MANDATORY FIRST STEP**: **USE Read tool** to load: ${project_path}/.spec/specs/plan.md
   - If this file doesn't exist, STOP and report error: "❌ Error: plan.md not found at ${project_path}/.spec/specs/plan.md. Please generate a plan first using the generate-plan tool."
2. Read and analyze the complete plan document from disk
3. Extract all requirements (R-1, R-2, etc.) for traceability
4. Extract Section 2.7 "Implementation Evidence" to identify [EXISTS], [EXAMPLE], and [NEEDED] items
5. Break down into tasks based on evidence type:
   - [EXISTS] or [EXAMPLE] → Create implementation task with actual code
   - [NEEDED] with clear specs → Create implementation task
   - [NEEDED] with questions → Create research/design task first
6. Include relevant code examples from Section 2.7 in each task
7. Create comprehensive task list with implementation details
8. **USE Bash tool** to create directory: mkdir -p ${project_path}/.spec/specs/
9. **USE Write tool** to save the complete generated content to: ${project_path}/.spec/specs/tasks.md
10. **USE Read tool** to verify the file was created at: ${project_path}/.spec/specs/tasks.md
11. Ensure each task links back to specific requirements and evidence tags
12. Include detailed testing requirements and manual checklists

## SUCCESS CRITERIA:
✅ Tasks.md file PHYSICALLY CREATED on filesystem (not just reported)
✅ File verified to exist using Read tool
✅ Each task has EARS-format acceptance criteria
✅ Clear requirement traceability (T-X links to R-Y)
✅ Detailed implementation guidance with code examples
✅ Comprehensive testing requirements for each task
✅ Dependency graph and risk assessment included
✅ Ready for sequential task execution and verification

⚠️ FINAL REMINDER: You MUST use Write tool to create the file. Do not just say it was created.`;

    return {
      content: [{
        type: "text",
        text: prompt
      }]
    };
  }
);

// Task Orchestrator Tool Registration
server.registerTool(
  'task-orchestrator',
  {
    title: 'Task Orchestrator',
    description: 'Use this to **implement/execute existing tasks** from tasks.md that have already been defined. This tool assumes tasks already exist and focuses on coordinating their implementation. DO NOT use this for generating new plans or tasks - only for executing tasks that have already been created.',
    inputSchema: {
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)")
    }
  },
  async ({ project_path = '.' }) => {
    const prompt = `# Task Orchestration Analysis for ${project_path}

## PREREQUISITE CHECK
1. **USE Read tool** to check if ${project_path}/.spec/specs/tasks.md exists
2. If it doesn't exist, STOP and return: "❌ No tasks.md found. This tool is for implementing existing tasks only. Use generate-tasks tool first."
3. If tasks.md exists, proceed with orchestration below

## CRITICAL: This tool IMPLEMENTS existing tasks
- DO NOT generate new steering documents, plans, or task lists
- ONLY coordinate execution of tasks already defined in tasks.md
- Focus on dependencies and parallelization of existing tasks

## SIMPLICITY PRINCIPLES
1. Start with minimal viable tasks
2. Avoid over-engineering test requirements
3. Only include necessary sections per task
4. Focus on implementation, not process
5. Prefer iterative improvements over perfection

## CRITICAL: THIS IS A COORDINATION TOOL
This tool analyzes the task queue and creates an execution strategy. It does NOT execute tasks directly.

## PHASE 1: TASK QUEUE ANALYSIS
1. Read the tasks file: ${project_path}/.spec/specs/tasks.md
2. Parse all tasks and their current status:
   - ⚪ Not Started - Available for execution
   - 🟡 In Progress - Currently being worked on
   - ✅ Done - Completed tasks

## PHASE 2: DEPENDENCY GRAPH CONSTRUCTION
Analyze the "Task Phases and Dependencies" section to understand:
- Which tasks block others
- Which tasks can run in parallel
- Critical path identification
- Phase groupings

## PHASE 3: EXECUTION STRATEGY

### Identify Executable Tasks
Find all tasks that meet these criteria:
- Status: ⚪ Not Started
- All dependencies (if any) are ✅ Done
- Not blocked by 🟡 In Progress tasks

### Parallelization Analysis
Group tasks that can be executed simultaneously:
- Independent tasks with no shared dependencies
- Tasks in the same phase that don't conflict

### Execution Order Analysis
Determine optimal sequential order based on:
- Dependency requirements
- Priority levels
- Phase progression

## PHASE 4: EXECUTOR DEPLOYMENT PLAN

For each executable task or task group, prepare deployment instructions:

### Tasks That Can Run Simultaneously:
**Group 1**: Independent tasks
- Task T-X: [Brief description]
  - Dependencies satisfied: [List completed dependencies]
  - Priority: [High/Medium/Low]
- Task T-Y: [Brief description]
  - Dependencies satisfied: [List]
  - Priority: [Level]

### Recommended Execution Order:
1. **Immediate Execution** (no dependencies):
   - T-X: [Task title] - Ready to start
   - T-Y: [Task title] - Ready to start

2. **Next Wave** (will be unblocked after current tasks):
   - T-Z: [Task title] - Waiting for T-X
   - T-W: [Task title] - Waiting for T-Y

3. **Future Tasks** (multiple dependencies):
   - [List tasks that need multiple completions]

## PHASE 5: EXECUTION INSTRUCTIONS

### Deployment Options

**Option 1: Deploy Multiple Executors** (for independent tasks)
\`\`\`
1. Deploy task-executor for Task T-X with focus on [specific requirement]
2. Deploy task-executor for Task T-Y with focus on [specific requirement]
3. Monitor progress and reassess after completion
\`\`\`

**Option 2: Sequential Execution** (for dependent tasks)
\`\`\`
1. Execute Task T-X first (foundational)
2. Upon completion, verify and proceed to T-Y
3. Continue with dependency order
\`\`\`

### Progress Monitoring Strategy
- Check task status updates regularly
- When a task reports completion, run task-checker to verify
- Deploy new executors for newly unblocked tasks
- Handle any blockers or failures

### Task Verification Process
When a task is marked as 🟡 In Progress with all checkboxes checked:
1. Run task-checker tool to verify completion
2. If PASS: Update status to ✅ Done
3. If FAIL: Keep as 🟡 In Progress and fix issues

## PHASE 6: RISK ASSESSMENT

### Potential Bottlenecks:
- Tasks with many dependents that could block progress
- High-complexity tasks that might take longer
- External dependencies that could cause delays

### Mitigation Strategies:
- Prioritize bottleneck tasks
- Prepare fallback plans for risky tasks
- Consider partial implementations for large tasks

## OUTPUT SUMMARY

**Tasks Ready for Execution**: [Count and list]
**Tasks Blocked**: [Count and list with blockers]
**Tasks Completed**: [Count]
**Parallelizable Tasks**: [List of tasks that can run simultaneously]
**Critical Path**: [Sequence of tasks that determine minimum completion time]

## NEXT STEPS
1. Review the execution plan above
2. Deploy task-executor tool for each ready task
3. Use task-checker tool to verify task completion
4. Re-run orchestrator when tasks complete to identify newly available work

Note: This orchestrator provides strategic coordination. Actual implementation happens through the task-executor tool, and verification through the task-checker tool.

## ⚠️ CRITICAL: YOU MUST NOW USE SPEC MCP TOOLS ⚠️

**IMPORTANT**: The instructions above are analysis only. You MUST now ACTUALLY CALL the Spec MCP tools to implement tasks!

### 🔴 REQUIRED ACTIONS - USE THESE SPEC MCP TOOLS NOW:

Based on the analysis above, you MUST immediately:

1. **For EACH ready task identified above**, CALL the Spec MCP \`task-executor\` tool:
   \`\`\`
   USE Spec MCP tool: task-executor
   Parameters:
   - task_id: "[Task ID from above, e.g., T-1]"
   - project_path: "${project_path}"
   \`\`\`

2. **After implementing each task**, CALL the Spec MCP \`task-checker\` tool:
   \`\`\`
   USE Spec MCP tool: task-checker
   Parameters:
   - task_id: "[Same Task ID]"
   - project_path: "${project_path}"
   \`\`\`

### ⚠️ DO NOT JUST READ THESE INSTRUCTIONS ⚠️
**You MUST actually CALL/INVOKE/USE the Spec MCP tools mentioned above!**

These are NOT suggestions - they are REQUIRED tool calls you must make NOW.

**Clarification**:
- These are Spec MCP tools (external MCP server tools)
- NOT internal VSCode TODO tools
- Task status is tracked in tasks.md file
- You MUST invoke these tools through the Spec MCP interface

**Example of what you should do next:**
"I will now call the Spec MCP task-executor tool for task T-1..."
[Then ACTUALLY call the tool]`;

    return {
      content: [{
        type: "text",
        text: prompt
      }]
    };
  }
);

// Task Executor Tool Registration
server.registerTool(
  'task-executor',
  {
    title: 'Task Executor',
    description: 'Executes a specific task from tasks.md by providing detailed implementation guidance, requirements, acceptance criteria, and code patterns. This tool focuses on implementing one task thoroughly.',
    inputSchema: {
      task_id: z.string().describe("Task ID to execute (e.g., T-1, T-2)"),
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)"),
      update_status: z.boolean().optional().describe("Whether to include instructions for updating task status (default: true)")
    }
  },
  async ({ task_id, project_path = '.', update_status = true }) => {
    const prompt = `# Task Execution Guide for ${task_id}

## SIMPLICITY PRINCIPLES
1. Start with minimal viable tasks
2. Avoid over-engineering test requirements
3. Only include necessary sections per task
4. Focus on implementation, not process
5. Prefer iterative improvements over perfection

## ⚠️ CRITICAL: TASK COMPLETION RULES
**DO NOT MARK TASK AS DONE UNLESS:**
1. ALL acceptance criteria checkboxes are marked \`[x]\` (not \`[ ]\`)
2. You have verified each checkbox is actually checked in tasks.md
3. Run task-checker tool FIRST to confirm all criteria are met
4. If ANY checkbox remains \`[ ]\`, keep status as "🟡 In Progress"
5. Count and report: "Checked X of Y acceptance criteria"

## PHASE 1: TASK RETRIEVAL
1. Read the tasks file: ${project_path}/.spec/specs/tasks.md
2. Locate Task ${task_id} and extract:
   - Current status (should be ⚪ Not Started or 🟡 In Progress)
   - Requirements and traceability links
   - Acceptance criteria (EARS format)
   - Implementation details
   - Dependencies
   - Testing requirements

## PHASE 2: PRE-EXECUTION CHECKS

### Dependency Verification
Check that all tasks listed in "Blocked By" are marked as ✅ Done.
If any dependencies are not complete, STOP and report the blockage.

### Context Gathering
1. Read the plan document: ${project_path}/.spec/specs/plan.md
   - Understand the requirements (R-X) that this task implements
   - Review the design decisions related to this task

2. Read steering documents if they exist:
   - ${project_path}/.spec/steering/tech.md for technology standards
   - ${project_path}/.spec/steering/structure.md for file organization

${update_status ? `
## PHASE 3: STATUS UPDATE - MARK AS IN PROGRESS
Update the task status from ⚪ to 🟡:
\`\`\`
Edit ${project_path}/.spec/specs/tasks.md
Change: **Status**: ⚪ Not Started
To: **Status**: 🟡 In Progress
\`\`\`
` : ''}

## PHASE 4: IMPLEMENTATION PLAN

### Files to Create
From the "Files to Create" section of the task:
1. For each new file listed:
   - Create the file at the specified path
   - Implement according to the code patterns provided
   - Follow the project's coding conventions

### Files to Modify
From the "Files to Modify" section:
1. For each existing file:
   - Read the current content first
   - Make the specified modifications
   - Preserve existing functionality
   - Follow existing code patterns

### Code Implementation
Using the "Code Patterns and Examples" section:
1. Implement the interfaces/types exactly as specified
2. Follow the function signatures provided
3. Add proper error handling
4. Include necessary imports
5. Maintain consistency with existing code

## PHASE 5: ACCEPTANCE CRITERIA IMPLEMENTATION

For each acceptance criterion in EARS format:
- WHEN [condition] THEN THE SYSTEM SHALL [behavior]

Ensure your implementation:
1. Handles the specified condition
2. Produces the expected behavior
3. Includes error cases mentioned
4. Meets performance requirements
5. Satisfies security requirements

### Implementation Checklist:
□ All required files created
□ All required files modified
□ Each acceptance criterion has corresponding code
□ Error handling implemented
□ Edge cases covered
□ Security considerations addressed
□ Performance requirements met

## PHASE 6: TESTING IMPLEMENTATION

### Unit Tests
From "Unit Tests" section:
1. Create test file at specified location
2. Implement tests for:
   - Happy path scenarios
   - Error handling
   - Edge cases
   - Validation logic
   - Mocked dependencies

### Integration Tests
If specified:
1. Test API endpoints
2. Test database interactions
3. Test authentication/authorization
4. Test component communication

### Manual Testing
Follow the "Manual Testing Checklist":
1. Verify each requirement is met
2. Test on different screen sizes (if UI)
3. Test keyboard navigation (if UI)
4. Test error scenarios
5. Verify loading states
6. Test with slow network
7. Check accessibility

## PHASE 7: CODE QUALITY CHECKS

Run these commands to ensure quality:
\`\`\`bash
# TypeScript compilation
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build

# Run tests
npm test
\`\`\`

Fix any issues before proceeding.

## PHASE 8: IMPLEMENTATION NOTES

### Key Considerations:
- **Security**: Implement input validation, sanitization, authorization
- **Performance**: Add caching, optimize queries, implement loading states
- **Accessibility**: Include ARIA labels, keyboard navigation, screen reader support
- **Mobile**: Handle touch interactions, responsive breakpoints, gestures
- **Error Handling**: User-friendly messages, fallback UI, retry logic
- **Logging**: Add debug info, error tracking, user action tracking

### Best Practices:
1. Follow existing code patterns in the project
2. Use existing utilities and helper functions
3. Maintain consistent naming conventions
4. Add TypeScript types (avoid 'any')
5. Keep functions small and focused
6. Write self-documenting code

${update_status ? `
## PHASE 9: TASK COMPLETION
Once implementation is complete and tested:

**⚠️ CRITICAL VERIFICATION BEFORE MARKING DONE:**
1. First, verify ALL checkboxes are checked:
   - Count total acceptance criteria
   - Ensure EVERY single one shows \`- [x]\` (not \`- [ ]\`)
   - If ANY remain unchecked, DO NOT mark as Done

2. Update task status to Done ONLY if ALL checkboxes are \`[x]\`:
\`\`\`
Edit ${project_path}/.spec/specs/tasks.md
Change: **Status**: 🟡 In Progress
To: **Status**: ✅ Done
\`\`\`

3. Check all acceptance criteria checkboxes:
\`\`\`
Change: - [ ] [Criterion]
To: - [x] [Criterion]
\`\`\`

**RULE: Status can be "Done" ONLY when 100% of checkboxes show \`[x]\`**
` : ''}

## PHASE 10: POST-EXECUTION

### Verify Completion:
1. **ALL acceptance criteria checkboxes marked \`[x]\` (MANDATORY)**
2. All acceptance criteria met
3. All tests passing
4. No compilation errors
5. No linting errors (or only acceptable warnings)
6. Build succeeds
7. Manual testing complete

**⚠️ If any checkbox is \`[ ]\`, task is NOT complete regardless of other factors**

### Document Any Issues:
If you encountered any problems or made significant decisions:
1. Note them in the task's Implementation Notes section
2. Update documentation if needed
3. Create follow-up tasks if necessary

### Next Steps:
1. Run task-checker tool to confirm task is complete
2. Check for newly unblocked tasks
3. Run task-orchestrator to identify next tasks

## EXECUTION SUMMARY

**Task**: ${task_id}
**Objective**: [Extract from task description]
**Key Requirements**: [List from acceptance criteria]
**Implementation Approach**: [Your planned approach]
**Testing Strategy**: [How you'll verify correctness]
**Risk Factors**: [Any concerns or blockers]

Remember: Focus on completing this ONE task thoroughly before moving to the next. Quality over quantity.

## ⚠️ IMPORTANT: THIS IS A SPEC MCP TOOL INSTRUCTION ⚠️

**YOU ARE NOW READING INSTRUCTIONS FROM THE SPEC MCP \`task-executor\` TOOL**

This tool has provided you with implementation guidance for Task ${task_id}.

**What you MUST do now:**
1. **IMPLEMENT** the task following the phases above
2. **UPDATE** the task status in ${project_path}/.spec/specs/tasks.md file (NOT internal TODO list)
3. **CHECK** acceptance criteria boxes as you complete them
4. **VERIFY** with Spec MCP \`task-checker\` tool when done

**Clarification:**
- Task status is tracked in the tasks.md FILE (not VSCode's internal TODO system)
- Update status by EDITING the tasks.md file directly
- After implementation, CALL the Spec MCP \`task-checker\` tool to verify

**DO NOT** just read these instructions - **ACTUALLY IMPLEMENT** the task now!`;

    return {
      content: [{
        type: "text",
        text: prompt
      }]
    };
  }
);

server.registerTool(
  'task-checker',
  {
    title: 'Check if Task is Complete',
    description: 'Checks if a task can be marked as done by verifying all acceptance criteria checkboxes are checked and running automated tests. Returns PASS or FAIL with clear reasons.',
    inputSchema: {
      task_id: z.string().describe("Task ID to check (e.g., T-1, T-2)"),
      project_path: z.string().optional().describe("Path to project (defaults to current directory)"),
      run_tests: z.boolean().optional().describe("Run tests and build (default: true)")
    }
  },
  async ({ task_id, project_path = '.', run_tests = true }) => {
    const prompt = `# Check Task ${task_id} Completion Status

## READ-ONLY VERIFICATION
This tool ONLY checks if a task is complete. It does NOT modify any files.

## PHASE 1: CHECK ACCEPTANCE CRITERIA
1. Read ${project_path}/.spec/specs/tasks.md
2. Find Task ${task_id} and count checkboxes:
   - Count total checkboxes: both \`- [ ]\` and \`- [x]\`
   - Count checked boxes: only \`- [x]\`
   - Report: "Checkboxes: X/Y checked"

**CRITICAL RULE**: Task can ONLY be marked Done when ALL checkboxes are \`[x]\`

## PHASE 2: RUN AUTOMATED TESTS${run_tests ? `

### Step 1: Check Steering Documentation
**FIRST**, check if ${project_path}/.spec/steering/tech.md exists:
- Look for "Build and Test Commands" section
- Use documented commands if available
- This is the PRIMARY source of truth for test commands

### Step 2: Auto-Detect Project Type and Commands
If no steering docs, detect project type from config files and use appropriate commands.

### Step 3: Check Project Documentation
Also check project documentation markdown files (README.md, CONTRIBUTING.md, DEVELOPMENT.md, docs/, etc.) for documented build and test commands

### Step 4: Run Detected Commands
Execute the appropriate commands and report results:
- ✅ PASS (exit code 0)
- ❌ FAIL (exit code non-zero)
- ⚠️ Command not found (skip)` : ' (skipped)'}

## PHASE 3: GENERATE REPORT

### Checkbox Status
- Total checkboxes: [count]
- Checked: [count]
- Unchecked: [count]
- Result: [PASS if all checked / FAIL if any unchecked]

### Test Results${run_tests ? `
- Build: [PASS/FAIL/SKIPPED]
- Tests: [PASS/FAIL/SKIPPED]
- Lint: [PASS/FAIL/SKIPPED]` : ' (not run)'}

### FINAL DECISION
**TASK STATUS: [PASS or FAIL]**

If PASS:
- ✅ All checkboxes are checked
- ✅ Tests pass (if run)
- Task ${task_id} can be marked as Done

If FAIL:
- ❌ Reason: [List specific failures]
- Next step: Fix the issues above before marking as Done

### Tasks That Can Proceed
If this task passes, these dependent tasks become available:
[List task IDs that depend on ${task_id}]

## ⚠️ IMPORTANT: THIS IS A SPEC MCP TOOL RESULT ⚠️

**YOU HAVE JUST RUN THE SPEC MCP \`task-checker\` TOOL**

This tool has verified whether Task ${task_id} is complete.

**Based on the results above:**

1. **If PASS (all checkboxes checked):**
   - UPDATE the task status to ✅ Done in ${project_path}/.spec/specs/tasks.md
   - CALL Spec MCP \`task-orchestrator\` tool to identify next tasks
   - CALL Spec MCP \`task-executor\` tool for the next available task

2. **If FAIL (some checkboxes unchecked):**
   - DO NOT mark the task as Done
   - Continue implementing the missing requirements
   - Check the unchecked boxes as you complete them
   - Run this checker again when ready

**Remember:**
- Task status is in the tasks.md FILE (not internal TODO)
- Use Edit tool to update the tasks.md file directly
- These are Spec MCP tools, not VSCode internal tools`;

    return {
      content: [{
        type: "text",
        text: prompt
      }]
    };
  }
);

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info("Spec MCP server started");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
