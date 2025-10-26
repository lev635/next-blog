import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSpotifyEmbed from '@/utils/rehypeSpotifyEmbed';
import rehypeYoutubeEmbed from '@/utils/rehypeYoutubeEmbed';

interface Params {
  slug: string;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src/pages');
  const files = fs.readdirSync(postsDir);

  return files
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

function getPostBySlug(slug: string) {
  const postsDir = path.join(process.cwd(), 'src/pages');
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return <></>
  }

  return (
    <article>
      <h1 className="text-4xl font-bold mb-4 text-center border-b-0">{post.frontmatter.title || post.slug}</h1>
      {post.frontmatter.date && (
        <p className="text-gray-600 mb-1 text-center">公開日: {post.frontmatter.date}</p>
      )}
      {post.frontmatter.lastModified && (
        <p className="text-gray-600 mb-1 text-center">最終更新: {post.frontmatter.lastModified}</p>
      )}
      <div className="prose markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSpotifyEmbed, rehypeYoutubeEmbed, rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
