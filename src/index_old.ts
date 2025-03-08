// import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";

// // Define types for Strateegia API responses
// interface StrateegiaProject {
//     id: string;
//     title: string;
//     description: string;
//     lab_id: string;
//     lab_title: string;
//     owner_id: string;
//     owner_name: string;
//     created_at: string;
//     updated_at: string;
//     agreement?: string;
//     is_public: boolean;
//     active: boolean;
//     finished?: boolean;
//     content: {
//         purpose?: string;
//         context?: string;
//         opportunity?: string;
//         visual_references?: string;
//     };
// }

// // Create MCP server
// const server = new Server(
//     {
//         name: "strateegia-api",
//         version: "1.0.0",
//     },
//     new StdioServerTransport()
// );

// // Base URL for Strateegia API
// const API_BASE_URL = "https://api.strateegia.digital";

// // Retrieve access token from environment variables
// function getAccessToken(): string {
//     const token = process.env.STRATEEGIA_ACCESS_TOKEN;
//     if (!token) {
//         throw new Error(
//             "STRATEEGIA_ACCESS_TOKEN environment variable is not set"
//         );
//     }
//     return token;
// }

// // Helper function to make authenticated API requests
// async function fetchStrateegiaAPI(endpoint: string): Promise<any> {
//     const accessToken = getAccessToken();
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//     });

//     if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//             `API request failed: ${response.status} ${response.statusText} - ${errorText}`
//         );
//     }

//     return response.json();
// }

// // Format project data into readable text
// function formatProject(project: StrateegiaProject): string {
//     return `
// Project: ${project.title}
// ID: ${project.id}
// Description: ${project.description || "No description"}
// Lab: ${project.lab_title}
// Owner: ${project.owner_name}
// Created: ${new Date(project.created_at).toLocaleString()}
// Updated: ${new Date(project.updated_at).toLocaleString()}
// Status: ${project.active ? "Active" : "Inactive"}${
//         project.finished ? " (Finished)" : ""
//     }
// Public: ${project.is_public ? "Yes" : "No"}

// Purpose: ${project.content.purpose || "Not specified"}
// Context: ${project.content.context || "Not specified"}
// Opportunity: ${project.content.opportunity || "Not specified"}
// `;
// }

// // Tool: List Projects
// server.tool(
//     "list-projects",
//     "List all accessible projects from Strateegia",
//     {},
//     async () => {
//         try {
//             console.error("Fetching projects from Strateegia API...");
//             const projects: StrateegiaProject[] = await fetchStrateegiaAPI(
//                 "/projects/v1/project"
//             );

//             if (projects.length === 0) {
//                 return {
//                     content: [
//                         {
//                             type: "text",
//                             text: "No projects found. Make sure your access token has the correct permissions.",
//                         },
//                     ],
//                 };
//             }

//             const projectsSummary = projects
//                 .map((project) => {
//                     return `- ${project.title} (ID: ${project.id})`;
//                 })
//                 .join("\n");

//             const fullResponse = `Found ${projects.length} projects:\n\n${projectsSummary}`;

//             return {
//                 content: [
//                     {
//                         type: "text",
//                         text: fullResponse,
//                     },
//                 ],
//             };
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//             return {
//                 isError: true,
//                 content: [
//                     {
//                         type: "text",
//                         text: `Error fetching projects: ${
//                             error instanceof Error
//                                 ? error.message
//                                 : "Unknown error"
//                         }`,
//                     },
//                 ],
//             };
//         }
//     }
// );

// // Tool: Get Project Details
// server.tool(
//     "get-project-details",
//     "Get detailed information about a specific project",
//     {
//         projectId: z
//             .string()
//             .describe("The ID of the project to get details for"),
//     },
//     async ({ projectId }: { projectId: string }) => {
//         try {
//             console.error(`Fetching details for project ${projectId}...`);
//             const projects: StrateegiaProject[] = await fetchStrateegiaAPI(
//                 "/projects/v1/project"
//             );
//             const project = projects.find((p) => p.id === projectId);

//             if (!project) {
//                 return {
//                     isError: true,
//                     content: [
//                         {
//                             type: "text",
//                             text: `Project with ID '${projectId}' not found.`,
//                         },
//                     ],
//                 };
//             }

//             return {
//                 content: [
//                     {
//                         type: "text",
//                         text: formatProject(project),
//                     },
//                 ],
//             };
//         } catch (error) {
//             console.error("Error fetching project details:", error);
//             return {
//                 isError: true,
//                 content: [
//                     {
//                         type: "text",
//                         text: `Error fetching project details: ${
//                             error instanceof Error
//                                 ? error.message
//                                 : "Unknown error"
//                         }`,
//                     },
//                 ],
//             };
//         }
//     }
// );

// // Resource: projects-list
// server.resource("projects-list", "strateegia://projects", async (uri: URL) => {
//     try {
//         const projects: StrateegiaProject[] = await fetchStrateegiaAPI(
//             "/projects/v1/project"
//         );

//         const projectsList = projects
//             .map((project) => {
//                 return `${project.title} (ID: ${project.id})
//                     Lab: ${project.lab_title}
//                     Owner: ${project.owner_name}
//                     Status: ${project.active ? "Active" : "Inactive"}${
//                     project.finished ? " (Finished)" : ""
//                 }
//                 ---`;
//             })
//             .join("\n\n");

//         const content = `# Strateegia Projects\n\n${projectsList}`;

//         return {
//             contents: [
//                 {
//                     uri: uri.href,
//                     text: content,
//                     mimeType: "text/markdown",
//                 },
//             ],
//         };
//     } catch (error) {
//         console.error("Error fetching projects for resource:", error);
//         return {
//             contents: [
//                 {
//                     uri: uri.href,
//                     text: `Error fetching projects: ${
//                         error instanceof Error ? error.message : "Unknown error"
//                     }`,
//                     mimeType: "text/plain",
//                 },
//             ],
//         };
//     }
// });

// // Start the server
// async function main() {
//     console.error("Starting Strateegia MCP server...");

//     // Check for access token
//     try {
//         getAccessToken();
//     } catch (error) {
//         console.error(
//             "Error:",
//             error instanceof Error ? error.message : "Unknown error"
//         );
//         process.exit(1);
//     }

//     const transport = new StdioServerTransport();
//     await server.connect(transport);
//     console.error("Strateegia MCP server running");
// }

// main().catch((error) => {
//     console.error("Fatal error:", error);
//     process.exit(1);
// });
