import { useState, useEffect, useCallback } from "react";
import { fetchTopRepos } from "../services/github";
import RepoItem from "./RepoItem";
import type { Repo } from "../types/repo";
import styles from './RepoList.module.scss';

const RepoList = () => {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1); // Page number for pagination

    // Fetch repos when the page changes
    useEffect(() => {
        const getRepos = async () => {
            setLoading(true);
            setError(null);  // Clear any previous error

            try {
                const data = await fetchTopRepos(page);
                console.log("Fetched data:", data);
                console.log("Number of repos fetched:", data.length);
                // Filter out duplicates based on the repo's ID
                setRepos((prevRepos) => {
                    const uniqueRepos = data.filter(
                    (newRepo) => !prevRepos.some((repo) => repo.id === newRepo.id)
                );
                console.log("Unique repos to add:", uniqueRepos);
                return [...prevRepos, ...uniqueRepos];
      });
            } catch (err) {
                setError(
                    "Failed to fetch repos: " +
                    (err instanceof Error ? err.message : String(err))
                );
            } finally {
                setLoading(false);
            }
        };

        getRepos();
    }, [page]); // Re-run when the page number changes

    // Function to handle scroll event and load more data when bottom is reached
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight && !loading // Check if we're at the bottom and not already loading
        ) {
            setPage((prev) => prev + 1); 
            console.log("Page", page)
        }
    }, [loading, page]);  // Memoize handleScroll function with loading and page as dependencies

     // Add scroll event listener when component mounts
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);  // Clean up on unmount
        };
    }, [handleScroll]);  // Re-run when loading state changes

    if (loading && repos.length === 0) {
        return <div>Loading...</div> //load without refresh the hold page
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    if (repos.length === 0) {
        return <div>No repositories found.</div>;
    }

    return (
        <section className={styles.list}>
            {/* Use map here to render RepoItem for each repository */}
            {repos.map((repo, index) => (
                <RepoItem key={`${repo.id}-${index}`} repo={repo} />
            ))}

            {loading && <div className={styles.spinner}>Loading...</div>} 
            
        </section>
    );
};

export default RepoList;
  
  

