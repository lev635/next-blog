import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ArticleList from "@/components/ArticleList";

interface Article {
  slug: string;
  title: string;
  date: string;
  lastModified: string;
}

function getRecentArticles(): Article[] {
  const postsDir = path.join(process.cwd(), 'src/posts');
  const files = fs.readdirSync(postsDir);

  const articles = files
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContent = fs.readFileSync(path.join(postsDir, fileName), 'utf-8');
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        lastModified: data.lastModified || '',
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    .slice(0, 3);

  return articles;
}

export default function Home() {
  const recentArticles = getRecentArticles();

  return (
    <article>
      <h1 className="leading-tight border-b text-3xl font-semibold mb-2">About</h1>
      <p><a href="https://github.com/lev635">私</a>の個人ブログです。</p>
      <p>詳しくは<a href="/readme">README</a>にて。</p>
      <h1 className="leading-tight border-b text-3xl font-semibold mb-2 mt-8">新着記事</h1>
      <ArticleList articles={recentArticles} displayButton={false} />
    </article>
  );
}
