import NavigateButton from "@/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-[100vh] flex flex-col gap-y-3 items-center justify-center
     bg-gradient-to-l from-[#c2ced5] to-[#639df1] text-white"
    >
      <h2 className="text-[6rem] text-bold uppercase">404</h2>
      <p className="text-lg ">Không tìm thấy trang</p>
      <Link href="/">
        <button
          className="px-6 py-3 text-white hover:bg-text-color hover:cursor-pointer transition-colors
         rounded-4xl bg-primary-color"
        >
          <span>Trở lại trang chủ</span>
        </button>
      </Link>
    </div>
  );
}
