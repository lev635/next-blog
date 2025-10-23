'use client';

import { useState } from "react";
import ArticleCard from "./ArticleCard";

export interface Article {
  slug: string;
  title: string;
  date: string;
  lastModified: string;
}

export interface Props {
  articles: Article[];
  displayButton?: boolean;
}

type SortOrder = 'asc' | 'desc';
type SortType = 'pub' | 'last';

export default function ArticleList({ articles, displayButton = true }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [sortType, setSortType] = useState<SortType>('pub');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const filteredArticles = searchKeyword
    ? articles.filter((article) => article.title.includes(searchKeyword))
    : articles;

  const sortedArticles = [...filteredArticles]
    .sort((a, b) => {
      const aDate = sortType === 'pub'
        ? new Date(a.date).getTime()
        : new Date(a.lastModified).getTime();
      const bDate = sortType === 'pub'
        ? new Date(b.date).getTime()
        : new Date(b.lastModified).getTime();
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  return (
    <>
      {displayButton && (
        <div className="flex flex-col gap-2 mb-4 justify-between sm:flex-row">
          <div className="flex gap-2 items-center">
            <button
              className={`px-3 py-2 rounded text-sm border border-[#333333] ${sortType === 'pub' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => setSortType('pub')}
            >
              投稿日
            </button>
            <button
              className={`px-3 py-2 rounded text-sm border border-[#333333] ${sortType === 'last' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => setSortType('last')}
            >
              最終更新
            </button>
            <button
              className="px-2 py-2 rounded text-sm border border-[#333333] bg-white hover:bg-gray-100"
              onClick={() => setSortOrder((v) => (v === 'desc' ? 'asc' : 'desc'))}
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="検索..."
              className="px-3 py-2 border border-[#333333] rounded w-48"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') setSearchKeyword(searchText);
              }}
            />
            <button
              className="px-3 py-2 rounded text-sm border border-[#333333] bg-white hover:bg-gray-100"
              onClick={() => setSearchKeyword(searchText)}
            >
              検索
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {sortedArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            url={`/posts/${article.slug}`}
            title={article.title}
            date={article.date}
            lastModified={article.lastModified}
          />
        ))}
      </div>
    </>
  );
}
