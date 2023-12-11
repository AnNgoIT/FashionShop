import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[600px] flex flex-col gap-y-5 items-center justify-center">
      <h2 className="text-2xl font-semibold ">Không tìm thấy sản phẩm nào</h2>
      <Link href="/product">
        <button
          className="px-6 py-3 text-white hover:bg-text-color hover:cursor-pointer transition-colors
         rounded-4xl bg-primary-color"
        >
          <span>Trở lại trang sản phẩm</span>
        </button>
      </Link>
    </div>
  );
}
