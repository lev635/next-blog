import Link from 'next/link';

export interface Props {
  url: string;
  title: string;
  date: string;
  lastModified: string;
}

export default function ArticleCard({ url, title, date, lastModified }: Props) {
  return (
    <div className="flex flex-col border-2 border-[#333333] rounded-md p-4">
      <div>
        <Link
          href={url}
          className="font-semibold text-2xl text-[#333333] hover:text-blue-600 no-underline"
        >
          {title}
        </Link>
      </div>
      <div className="flex flex-col mt-3 text-sm text-gray-600">
        <span>投稿日: {date}</span>
        <span>最終更新: {lastModified}</span>
      </div>
    </div>
  );
}