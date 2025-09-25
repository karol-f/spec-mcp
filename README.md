# Spec MCP Server

A Model Context Protocol server designed to streamline development workflows through AI-assisted analysis, planning, and verification.

## Features

- **Tech Steering**: Automated codebase analysis and documentation
- **Plan Generation**: Comprehensive requirement and design documentation
- **Task Breakdown**: Detailed task generation with dependencies
- **Implementation Verification**: Automated code review and compliance checking

## Installation

1. Configure your AI client (Claude Desktop, Cursor, etc.)
2. Add the server to your MCP configuration
3. Start using the tools through your AI interface

### Configuration Examples

#### Visual Studio Code

Add to your VS Code MCP configuration file:
- Regular VS Code: `~/Library/Application Support/Code/User/mcp.json`
- VS Code Insiders: `~/Library/Application Support/Code - Insiders/User/mcp.json`

```json
{
  "servers": {
    "spec": {
      "command": "npx",
      "args": [
        "-y",
        "spec-mcp@latest"
      ]
    }
  }
}
```

#### Zed

1. Open Zed > Settings > Open Settings (it will open `~/. config/zed/settings.json`)
2. Add a context_servers section to your configuration:

```json
{
  "context_servers": {
    "spec": {
      "source": "custom",
      "command": "npx",
      "args": ["-y", "spec-mcp@latest"],
      "env": {}
    }
  }
}
```

#### Claude Code (CLI)

For Claude Code CLI, use the following command:

```bash
claude mcp add spec-mcp --scope user -- npx -y spec-mcp@latest
```

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spec": {
      "command": "npx",
      "args": [
        "-y",
        "spec-mcp@latest"
      ]
    }
  }
}
```

## Workflow

The Spec MCP workflow guides you through complex development tasks like framework migrations, feature implementation, or refactoring. Follow these steps:

### 1. Analyze Codebase (One-time Setup)
Analyze the existing codebase to create steering documents that guide all future operations.

**Prompt:** `Use Spec MCP to analyze the codebase`

This creates three steering documents in `.spec/steering/`:
- `product.md` - Product overview and business context
- `tech.md` - Technology stack and development guidelines
- `structure.md` - Project organization and patterns

*Note: You can recreate these documents anytime with `force_regenerate=true`*

### 2. Search Documentation
Search documentation for relevant information about frameworks, APIs, or migration guides using e.g. Context7 MCP.

**Prompt:** `Search docs with Context7 MCP for [topic/framework/library]`

### 3. Generate Tasks
Ask the Spec MCP server to generate a clear, evidence‑driven task list from your goal.

Example prompt:
- “Generate an implementation task breakdown for: <your goal>”

Output:
- `.spec/specs/tasks.md` (includes overview, requirements with EARS, implementable tasks, dependencies, and tests)

### 4. Implement Tasks
Execute tasks systematically using the task orchestrator, which handles dependencies and parallelization.

**Prompt:** `Implement tasks from tasks.md using Spec MCP task orchestrator`

The orchestrator will:
- Identify ready tasks based on dependencies
- Execute tasks through task-executor
- Verify completion with task-checker
- Report progress and next available tasks

## Available Tools

### generate-codebase-analysis
Analyzes codebase and generates three foundational analysis documents: product.md, tech.md, and structure.md in .spec/steering/ directory. These documents provide comprehensive analysis of the product features, technology stack, and project structure.

### generate-tasks
Spec MCP: Generate tasks.md (Plan & Task Breakdown)

Generate tasks.md (implementation plan & task breakdown) from your request and codebase. Writes `.spec/specs/tasks.md` with overview, numbered requirements using EARS, implementable tasks (T‑1…), dependencies/phases, and testing guidance. Use for “task breakdown”, “create tasks.md”, “implementation plan”, or “roadmap”. Inputs:
- `user_request` (required)
- `project_path` (optional, defaults to `.`)

### task-orchestrator
Analyzes tasks.md to identify dependencies, parallelization opportunities, and coordinate task execution. Returns a structured execution plan for deploying task executors efficiently.

### task-executor
Executes a specific task from tasks.md by providing detailed implementation guidance, requirements, acceptance criteria, and code patterns. This tool focuses on implementing one task thoroughly.

### task-checker
Checks if a task can be marked as done by verifying all acceptance criteria checkboxes are checked and optionally running build/tests. Returns PASS or FAIL with clear reasons.

## License

MIT
