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
✅ Files ready for use with generate-tasks tool

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


// Task Generation Tool Registration
server.registerTool(
  'generate-tasks',
  {
    title: 'Spec MCP: Generate tasks.md (Plan & Task Breakdown)',
    description: 'Generate tasks.md (implementation plan & task breakdown) from your request and codebase. Writes `.spec/specs/tasks.md` with overview, numbered requirements using EARS, implementable tasks (T-1…), dependencies/phases, and testing guidance. Use for “task breakdown”, “create tasks.md”, “implementation plan”, or “roadmap”.',
    inputSchema: {
      user_request: z.string().describe("Feature request or requirement to plan for"),
      project_path: z.string().optional().describe("Path to the project directory (defaults to current directory)")
    }
  },
  async ({ user_request, project_path = '.' }) => {
    const prompt = `# ⚠️ IMPORTANT: YOU MUST EXECUTE THE FOLLOWING ACTIONS

This MCP tool provides instructions that YOU (the AI assistant) must execute using your available file system tools.
**DO NOT** just report success — you MUST actually create the files using Write or MultiEdit tools.

# Generate Plan and Tasks for ${project_path}

## SIMPLICITY PRINCIPLES
1. Start with minimal viable tasks
2. Avoid over-engineering test requirements
3. Only include necessary sections per task
4. Focus on implementation, not process
5. Prefer iterative improvements over perfection

## What This Tool Does
- Reads steering docs if present and analyzes the codebase context
- Extracts requirements from the user request and evidence from code
- Produces ONE file: ${project_path}/.spec/specs/tasks.md containing:
  - Overview and Requirements (with EARS acceptance criteria and R-IDs)
  - Implementation tasks T-1... with traceability, code examples, file references
  - Phases, dependencies, testing requirements, and risk assessment

## 🔴 CRITICAL: CREATE THE FILE — NOT JUST REPORT SUCCESS
1) Create directory: mkdir -p ${project_path}/.spec/specs/
2) Generate tasks.md using the template and guardrails below
3) Save to: ${project_path}/.spec/specs/tasks.md
4) Verify the file exists after creation (Read tool)

# tasks.md

## 0. Overview
- Purpose: Summarize the feature in 1–2 sentences
- Scope: In/out for this iteration
- Assumptions: Constraints that influence design

## 1. Requirements (with EARS)
Define numbered requirements and acceptance criteria directly here.
- Formatting: “As a [role], I want [goal] so that [benefit]”
- Use EARS for acceptance criteria: WHEN [condition] THEN THE SYSTEM SHALL [expected behavior]
- Evidence tags: mark details as [EXISTS], [EXAMPLE], or [NEEDED]

### R-1: <Title from request/context>
- User Story: As a <role>, I want <change>, so that <benefit>.
- Files Affected: <List evidenced paths if available>
- Acceptance Criteria:
  - WHEN <condition with actual names> THEN THE SYSTEM SHALL <behavior>
  - WHEN <error/edge case> THEN THE SYSTEM SHALL <behavior>

### R-2: <Next requirement>
- User Story: ...
- Files Affected: ...
- Acceptance Criteria: ...

#### Edge Cases and Errors
- [Edge case] → Expected behavior

#### Non-Functional Requirements
- Performance, security, accessibility, observability

## 2. Implementation Tasks
Tasks derived from the requirements and code evidence with traceability, evidence, and tests.

## Task Structure Template

### Task T-1: [Task Title]
**Status**: ⚪ Not Started
**Evidence**: [EXISTS/EXAMPLE/NEEDED] — Cite sources
**Requirement Traceability**: Links to R-[X] from the Requirements section

#### Summary
- What this task accomplishes

#### Files to Modify
- a/b/file1.<ext> — Implement X (use appropriate extension per tech.md)

#### Files to Create
- src/new/Feature.<ext> — Per design Section 2.x (use appropriate extension per tech.md)

#### Code Patterns and Examples
\`\`\`
// Copy verbatim examples from Section 2.7 [EXAMPLE]
// Use the appropriate language fence (e.g., \`\`\`java, \`\`\`python) based on tech.md
\`\`\`

#### Acceptance Criteria (EARS)
- [ ] WHEN <condition> THEN THE SYSTEM SHALL <behavior>
- [ ] WHEN <error/edge case> THEN THE SYSTEM SHALL <behavior>

#### Testing
- Unit: location and naming per project conventions (see tech.md/structure.md); cover happy path, errors, edges
- Integration: API/DB or component interaction tests per project conventions
- E2E: user journey tests per project conventions (if applicable)

#### Notes
- Assumptions, follow-ups, clarifications

---

## Task Breakdown (Generated)
- List all tasks T-1, T-2, ... with structure above

## Phases and Dependencies
- Phase 1: Foundation (T-1, T-2, T-3)
- Phase 2: Core (T-4, T-5, T-6)
- Phase 3: Integration (T-7, T-8, T-9)
- Phase 4: Quality/Launch (T-10, T-11, T-12)

## Dependency Graph
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

## Risk Assessment
- High risk: <task> — mitigation
- Critical path: T-1 → T-2 → T-4 → T-7 → T-8 → T-10 → T-11

## Execution Guidelines
1) One task at a time; update status ⚪→🟡→✅
2) Verify all EARS criteria before Done
3) Tests pass; docs updated

## EXECUTION STEPS
1) Read steering docs if present (.spec/steering/*.md) and relevant project files (package.json, README.md, etc.)
2) Extract requirements and evidence from user request and codebase
3) Map [EXISTS]/[EXAMPLE]/[NEEDED] to implementation vs. research tasks
4) mkdir -p ${project_path}/.spec/specs/
5) Write tasks to ${project_path}/.spec/specs/tasks.md
6) Verify the file exists (Read tool)

## SUCCESS CRITERIA
✅ .spec/specs/tasks.md physically created and verified
✅ Requirements section with EARS acceptance criteria
✅ Clear traceability (T-X → R-Y)
✅ Code examples and file references included when available
✅ Testing requirements and dependency graph included
`;

    return {
      content: [{ type: "text", text: prompt }]
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
1. Read steering documents if they exist:
   - ${project_path}/.spec/steering/tech.md for technology standards
   - ${project_path}/.spec/steering/structure.md for file organization
2. Read the tasks document: ${project_path}/.spec/specs/tasks.md
   - Use the Requirements section (R-X) and task details as the source of truth

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

Use the documented commands from .spec/steering/tech.md to ensure quality.
Specifically, look for the "Essential Commands" section (Type Check, Lint/Format, Build, Test).
- If commands are documented: run them and fix issues found.
- If not documented: skip running and add a TODO to update tech.md.

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
4. Follow the project's typing conventions or type-safety practices
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
    description: 'Prompt-only verification: instructs the agent to verify acceptance criteria checkboxes for a task with quoted evidence. Returns a PASS/FAIL decision rule to apply.',
    inputSchema: {
      task_id: z.string().describe("Task ID to check (e.g., T-1, T-2)"),
      project_path: z.string().optional().describe("Path to project (defaults to current directory)")
    }
  },
  async ({ task_id, project_path = '.' }) => {
    const prompt = `# Verify Task ${task_id} Completion (Prompt-Only)

Goal: Decide if Task ${task_id} can be marked Done based on acceptance criteria checkboxes.

What to verify
- All acceptance criteria checkboxes for Task ${task_id} are marked "- [x]".

How to verify (evidence required)
1) Locate the tasks file:
   - Prefer: ${project_path}/.spec/specs/tasks.md
   - Else: any tasks*.md that contains "Task ${task_id}"
2) Find the Task ${task_id} block and its Acceptance Criteria section (or the closest equivalent for that task).
3) Count only lines that exactly start with:
   - Checked: "- [x]"
   - Unchecked: "- [ ]"
4) Quote the exact lines you counted and include path:line references.

Decision rule
- PASS: total > 0 AND unchecked == 0
- FAIL: if any unchecked > 0, or if none found, or if task/section cannot be unambiguously identified (Unverifiable)

Output format
- File: <path>
- Quoted lines: (the lines counted with path:line)
- Counts: Checked X/Y
- Decision: PASS or FAIL
- Reason: short explanation

Notes
- Do not run builds/tests here. When needed, use commands from .spec/steering/tech.md (Essential Commands).
- Do not modify any files.`;

    return { content: [{ type: 'text', text: prompt }] };
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
