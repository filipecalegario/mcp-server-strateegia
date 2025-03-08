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

// Base URL for Strateegia API
const API_AUTH_BASE = "https://api.strateegia.digital/users/v1/auth/api";
const API_BASE_URL = "https://api.strateegia.digital";

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
    console.log(token);
    return token.access_token;
}

// Helper function to make authenticated API requests
async function fetchStrateegiaAPI(endpoint: string): Promise<any> {
    const accessToken = await getAccessToken();
    console.log(accessToken);
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

// const response = await fetchStrateegiaAPI("/projects/v1/project");
// console.log(response[0].lab.name);

const labs: StrateegiaItemResponse[] = await fetchStrateegiaAPI(
    "/projects/v1/project"
);

if (labs.length === 0) {
    console.log("No projects found");
}

const projectsSummary = labs
    .map((item) => {
        return `Lab: ${item.lab.name} (ID: ${item.lab.id})\nProjects:\n${item.projects.map((project) => {
        return `- ${project.title} (ID: ${project.id})`;
    })
    .join("\n")}`;
})
.join("\n\n");

const fullResponse = `Found ${labs.length} projects:\n\n${projectsSummary}`;

console.log(fullResponse);