import github from "../assets/github-mark.svg"
import vercel from "../assets/vercel-icon-svgrepo-com.svg"

export default function Footer() {
  return (
    <footer className="flex">
      <a href="https://github.com/lev635/blog" target="_blank" aria-label="GitHub">
        <img src={github.src} alt="GitHub" width="32" height="32" />
      </a>
      <a href="https://vercel.com/" target="_blank" aria-label="Vercel">
        <img src={vercel.src} alt="Vercel" width="32" height="32" />
      </a>
    </footer>
  );
}