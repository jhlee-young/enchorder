import { GITHUB_REPOSITORY_URL } from "../constants/appDefaults";
import { GitHubIcon } from "./GitHubIcon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 Enchorder</p>
      <a
        className="icon-link"
        href={GITHUB_REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Open GitHub repository"
      >
        <GitHubIcon />
      </a>
    </footer>
  );
}
