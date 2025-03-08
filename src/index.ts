import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Define types for Strateegia API responses

interface StrateegiaItemResponse {
    lab: StrateegiaLabs;
    projects: StrateegiaProject[];
}

interface StrateegiaLabs {
    id: string;
    name: string;
    owner_name: string;
}

interface StrateegiaProject {
    id: string;
    title: string;
}

// Define Tools

const LIST_PROJECTS_TOOL: Tool = {
    name: "list-projects",
    description: "List projects from Strateegia API",
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};

// Server implementation
const server = new Server(
    {
        name: "strateegia-mcp-server",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Base URL for Strateegia API
const API_AUTH_BASE = "https://api.strateegia.digital/users/v1/auth/api";
const API_BASE_URL = "https://api.strateegia.digital";

// Retrieve access token from API
async function getAccessToken(): Promise<string> {
    const api_key = process.env.STRATEEGIA_API_KEY;
    if (!api_key) {
        throw new Error("STRATEEGIA_API_KEY environment variable is not set");
    }

    const options = {
        method: "POST",
        headers: {
            "x-api-key": api_key,
        },
    };

    async function fetchAccessToken() {
        const response = await fetch(API_AUTH_BASE, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `API request failed: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return response.json();
    }

    const token = await fetchAccessToken();
    return token.access_token;
}

// Helper function to make authenticated API requests
async function fetchStrateegiaAPI(endpoint: string): Promise<any> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
    }

    return response.json();
}

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [LIST_PROJECTS_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "list-projects") {
        const labs: StrateegiaItemResponse[] = await fetchStrateegiaAPI(
            "/projects/v1/project"
        );

        if (labs.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No labs found. Make sure your access token has the correct permissions.",
                    },
                ],
            };
        }

        let labCount = 0;
        let projectCount = 0;

        const projectsSummary = labs
            .map((item) => {
                labCount++;
                projectCount += item.projects.length;
                return `Lab: ${item.lab.name} (ID: ${
                    item.lab.id
                })\nProjects:\n${item.projects
                    .map((project) => {
                        return `- ${project.title} (ID: ${project.id})`;
                    })
                    .join("\n")}`;
            })
            .join("\n\n");

        const fullResponse = `Found ${labCount} labs and ${projectCount} projects:\n\n${projectsSummary}`;

        return {
            content: [
                {
                    type: "text",
                    text: fullResponse,
                },
            ],
        };
    }
    throw new Error("Tool not found");
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Strateegia MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
