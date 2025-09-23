import { useState, useEffect, useRef } from "react";
import { fetchTopRepos } from "../services/github";
import RepoItem from "./RepoItem";
import type { Repo } from "../types/repo";
import styles from "./RepoList.module.scss";

const RepoList = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Page number for pagination
  const [hasMore, setHasMore] = useState(true); // stop when API returns empty

  // ref for the bottom "marker" div
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch repos when the page changes
  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      setError(null); // Clear any previous error

      try {
        const data = await fetchTopRepos(page);
        console.log("Fetched data:", data);
        console.log("Number of repos fetched:", data.length);

        // if API returns nothing, we’re at the end
        setHasMore(data.length > 0);

        setRepos((prev) => [
          ...prev,
          ...data.filter((n) => !prev.some((p) => p.id === n.id)),
        ]);
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

  // 4) set up the IntersectionObserver one time
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    // When the marker enters the viewport (200px before it’s actually visible),
    // and we’re not currently loading, ask for the next page.
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect(); // cleanup
  }, [loading, hasMore]);

  if (loading && repos.length === 0) {
    return <div>Loading...</div>; //load without refresh the hold page
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
      {repos.map((repo, i) => (
        <RepoItem key={`${repo.id}-${i}`} repo={repo} />
      ))}

      {loading && <div className={styles.spinner}>Loading...</div>}

      {/* the small marker the browser watches */}
      <div ref={loaderRef} style={{ height: 1 }} />

      {!hasMore && (
        <div style={{ textAlign: "center", color: "#666", padding: "12px" }}>
          No more results
        </div>
      )}
    </section>
  );
};

export default RepoList;
