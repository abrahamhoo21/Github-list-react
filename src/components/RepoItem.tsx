import React from 'react';
import type { Repo } from '../types/repo';
import styles from './RepoItem.module.scss';
import { Star } from "lucide-react";

interface RepoItemProps {
    repo: Repo;  // Define the prop type
}

function formatStars(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k.toFixed(k >= 10 ? 0 : 1)}k`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const RepoItem: React.FC<RepoItemProps> = ({ repo }) => {
  return (
    <article className={styles.card}>
      {/* LEFT: avatar + username */}
      <div className={styles.left}>
        <img className={styles.avatar} src={repo.owner.avatar_url} alt={repo.owner.login} />
        <div className={styles.username} title={repo.owner.login}>
          @{repo.owner.login}
        </div>
      </div>
      
      {/* MIDDLE: main content */}
      <div className={styles.center}>
        <h3 className={styles.name}>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name} 
          </a>
        </h3>

        <div className={styles.fullname}>{repo.full_name}</div>

        {repo.description && (
          <p className={styles.desc}>{repo.description}</p>
        )}

        <div className={styles.date}>Created on {formatDate(repo.created_at)}</div>
      </div>

      {/* RIGHT: stats */}
      <div className={styles.right}>
        <div className={styles.stars}>
          <Star className={styles.starIcon} />
          {formatStars(repo.stargazers_count)}
        </div>
        {repo.language && <span className={styles.language}>{repo.language}</span>}
      </div>

    </article>
  );
};

export default RepoItem;