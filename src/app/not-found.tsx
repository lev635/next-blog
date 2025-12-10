import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-4 text-lg font-bold">404 NotFound</p>
      <Link href="/" className=" text-blue-500 hover:underline">
        ホームに戻る
      </Link>
    </div>
  );
}
