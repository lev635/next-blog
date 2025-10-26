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

function getArticles(): Article[] {
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
    });

  return articles;
}

export default function ArticlePage() {
  const articles = getArticles();

  return (
    <article className="my-8">
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      <ArticleList articles={articles} />
    </article>
  );
}
