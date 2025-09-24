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

## Available Tools

### generate-codebase-analysis
Analyzes codebase and generates three foundational analysis documents: product.md, tech.md, and structure.md in .spec/steering/ directory. These documents provide comprehensive analysis of the product features, technology stack, and project structure.

### generate-plan
Creates comprehensive plans from user requirements, combining requirements analysis with technical design.

### generate-tasks
Breaks down plan.md into discrete, implementable tasks with requirement traceability, dependencies, and comprehensive acceptance criteria following task structure. Each task links back to specific requirements and includes detailed implementation guidance. Uses current directory if project_path not specified.

### task-orchestrator
Analyzes tasks.md to identify dependencies, parallelization opportunities, and coordinate task execution. Returns a structured execution plan for deploying task executors efficiently.

### task-executor
Executes a specific task from tasks.md by providing detailed implementation guidance, requirements, acceptance criteria, and code patterns. This tool focuses on implementing one task thoroughly.

### verify-implementation
READ-ONLY verification tool that checks completed task implementation against acceptance criteria, runs EXISTING project tests, and reports quality status. This tool ONLY verifies and reports - it does NOT create or modify any files, tests, or code.

## Workflow

The SpecMCP workflow guides you through complex development tasks like framework migrations, feature implementation, or refactoring. Follow these steps:

### 1. Analyze Codebase (One-time Setup)
Analyze the existing codebase to create steering documents that guide all future operations.

**Prompt:** `Use SpecMCP to analyze the codebase`

This creates three steering documents in `.spec/steering/`:
- `product.md` - Product overview and business context
- `tech.md` - Technology stack and development guidelines
- `structure.md` - Project organization and patterns

*Note: You can recreate these documents anytime with `force_regenerate=true`*

### 2. Search Documentation
Search documentation for relevant information about frameworks, APIs, or migration guides using e.g. Context7 MCP.

**Prompt:** `Search docs with Context7 MCPfor [topic/framework/library]`

### 3. Generate Plan
Create a comprehensive plan based on your requirements and the current codebase context.

**Prompt:** `Create a plan with SpecMCP to [describe your objective]`

This generates `.spec/specs/plan.md` with requirements, design, and traceability.

### 4. Generate Tasks
Break down the plan into actionable, testable tasks with dependencies.

**Prompt:** `Generate tasks from the plan using SpecMCP`

This creates `.spec/specs/tasks.md` with detailed implementation tasks.

### 5. Implement Tasks
Execute tasks systematically using the task orchestrator, which handles dependencies and parallelization.

**Prompt:** `Implement tasks from tasks.md using SpecMCP task orchestrator`

The orchestrator will:
- Identify ready tasks based on dependencies
- Execute tasks through task-executor
- Verify completion with task-checker
- Report progress and next available tasks

### Example: Framework Migration
```
1. "Use SpecMCP to analyze the codebase"
2. "Search SpecMCP docs for Application Framework v10 migration guide"
3. "Create a plan with SpecMCP to migrate from Application Framework 9.6.0 to 10.0.0"
4. "Generate tasks from the plan using SpecMCP"
5. "Implement tasks from tasks.md using SpecMCP task orchestrator"
```

## API Documentation

See [API Documentation](docs/api.md) for detailed tool specifications and examples.

## License

MIT
