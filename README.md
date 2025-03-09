# strateegia MCP Server

This is a Model Context Protocol (MCP) server that integrates with the strateegia API, allowing AI assistants like Claude or Cursor to access and interact with your strateegia projects.

## Features

- List all accessible strateegia projects
- Access detailed information about labs and projects

## Prerequisites

- Node.js (v16 or higher)
- A valid strateegia API key

## For Development

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Set your strateegia API key as an environment variable:

```bash
export STRATEEGIA_API_KEY=your_api_key_here
```

4. Start the server:

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
        "STRATEEGIA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Connecting with Cursor

1. Make sure you have [Cursor](https://cursor.ai/download) installed.
2. Open Cursor and go to the settings page.
3. Add a new MCP server with the following configuration:

```json
env STRATEEGIA_API_KEY=your_api_key_here node path/to/strateegia-mcp-server/dist/index.js
```

4. Restart Cursor

## Available Tools

The server exposes the following MCP tools:

- `list-projects`: Lists all accessible projects and labs from your strateegia account

## Contributing
Contributions are welcome! Feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Issues and Support
If you encounter any issues or need support, please file an issue on the [GitHub repository](https://github.com/filipecalegario/strateegia-mcp-server/issues).