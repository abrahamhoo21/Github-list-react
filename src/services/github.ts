import { TRENDING_REPOS_URL } from "../config/apiUrls";
import type { Repo } from './../types/repo';


function getLast10DaysDate(days: number = 10): string {
    const date = new Date();
    date.setDate(date.getDate() - days); // Subtract 10 days from current date
    return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
}

const last10DaysDate = getLast10DaysDate();

// Function to fetch top repos from GitHub API
export async function fetchTopRepos(page: number = 1, perPage: number = 15): Promise<Repo[]> {
    // Construct the URL with dynamic query parameters
    const url = `${TRENDING_REPOS_URL}?q=created:>${last10DaysDate}&sort=stars&order=desc&page=${page}&per_page${perPage}`;
    console.log("Constructed URL:", url);

    const headers = {
        Accept: "application/vnd.github+json",  //  GitHub's preferred API version
    };

    try {
        // Make the API request
        const response = await fetch(url, { headers });
        console.log("API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`Github API error: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        return data.items as Repo[];

    } catch (error) {
        console.error("Error fetching repos:", error);
        throw error;
    }
}