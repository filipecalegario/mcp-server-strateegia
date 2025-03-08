# Strateegia MCP Server

This is a Model Context Protocol (MCP) server that integrates with the Strateegia API, allowing AI assistants like Claude to access and interact with your Strateegia projects.

## Features

- List all accessible Strateegia projects
- Get detailed information about specific projects
- Access project data as MCP resources

## Prerequisites

- Node.js (v16 or higher)
- A valid Strateegia API access token

## Installation

1. Create the project structure:

```bash
mkdir -p strateegia-mcp-server/src
cd strateegia-mcp-server
```

2. Create the files as described in this repository:
   - `src/index.ts` (from the strateegia-server.ts content)
   - `package.json`
   - `tsconfig.json`
   - `.env.example`
   - `.gitignore`
   - `README.md`

3. Install dependencies:

```bash
npm install
```

4. Build the project:

```bash
npm run build
```

## Usage

1. Set your Strateegia access token as an environment variable:

```bash
export STRATEEGIA_ACCESS_TOKEN=your_access_token_here
```

2. Start the server:

```bash
npm start
```

### Connecting with Claude for Desktop

1. Make sure you have [Claude for Desktop](https://claude.ai/download) installed.

2. Create or edit your Claude for Desktop configuration file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Add the following configuration:

```json
{
  "mcpServers": {
    "strateegia": {
      "command": "node",
      "args": ["path/to/strateegia-mcp-server/dist/index.js"],
      "env": {
        "STRATEEGIA_ACCESS_TOKEN": "your_access_token_here"
      }
    }
  }
}
```

4. Restart Claude for Desktop.

## Available Tools

The server exposes the following MCP tools:

- `list-projects`: Lists all accessible projects from your Strateegia account
- `get-project-details`: Gets detailed information about a specific project (requires project ID)

## Available Resources

- `strateegia://projects`: Lists all accessible projects

## License

MIT