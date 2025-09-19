export interface Repo {
    id: number;
    name: string; 
    full_name: string;
    html_url: string; // link to repo page
    description: string | null;
    stargazers_count: number;
    language: string | null;
    created_at: string;
    owner: {
        login: string; // username
        avatar_url: string;
        html_url: string; // link to owner profile
    };
}