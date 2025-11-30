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

function getAllArticles(): Article[] {
  const postsDir = path.join(process.cwd(), 'blog-content/posts');
  const files = fs.readdirSync(postsDir);

  const articles = files
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const filePath = path.join(postsDir, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
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

export default function Article() {
  const allArticles = getAllArticles();

  return (
    <article>
      <h1 className="leading-tight border-b text-3xl font-semibold mb-2">記事一覧</h1>
      <ArticleList articles={allArticles} displayButton={true} />
    </article>
  );
}
