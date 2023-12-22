"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { logo } from "@/assests/images";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import FacebookIcon from "@mui/icons-material/Facebook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Divider from "@mui/material/Divider";
const Footer = () => {
  return (
    <footer className="font-sans left-0 right-0">
      <div className=" bg-gradient-to-l md:bg-gradient-to-r transition-colors from-[#0e9de9] to-[#639df1]">
        <div className="grid grid-cols-12 justify-items-center text-white container">
          <div className="col-span-12 md:col-span-4 p-4  grid place-items-center md:place-content-start">
            <div className="">
              <Link href="/" as="/">
                <Image
                  className="w-auto min-w-[80px] min-h-[80px]"
                  alt="Logo of the shop"
                  src={logo.src}
                  width={180}
                  height={100}
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw"
                  priority={true}
                ></Image>
              </Link>
            </div>

            <p className="max-w-[100%] justify-self-center">
              Chào mừng đến với cửa hàng của chúng tôi.Chúc bạn có buổi mua hàng
              thành công
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 p-4 grid items-center">
            <span className="uppercase text-[1.375rem] leading-6">
              THÔNG TIN
            </span>
            <ul className="grid place-items-start py-4">
              <li className="transition-opacity hover:opacity-60 p-1">
                <Link href="#">Về chúng tôi</Link>
              </li>
              <li className="transition-opacity hover:opacity-60 p-1">
                <Link href="#">Trang tin tức</Link>
              </li>
              <li className="transition-opacity hover:opacity-60 p-1">
                <Link href="#">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4 p-4 grid items-center">
            <span className="uppercase text-[1.375rem] leading-6">
              LIÊN LẠC
            </span>
            <ul className="grid place-items-start py-4">
              <li className="p-1">
                <FontAwesomeIcon icon={faLocationDot} />
                <span className="ml-2">3/32A Đường 182 Quận 9</span>
              </li>
              <li className="p-1">
                <FontAwesomeIcon icon={faPhone} />
                <span className="ml-2">0376399721</span>
              </li>
              <li className="p-1">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="ml-2">ngothuaan2002@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Divider sx={{ width: "100%", background: "white" }} />

      <div className="grid justify-center items-center w-full  bg-gradient-to-l md:bg-gradient-to-r transition-colors from-[#0e9de9] to-[#639df1]">
        <p className={`p-[25px] text-white font-normal text-[14px] leading-6`}>
          © Thiết kế bởi{" "}
          <span className={`font-normal text-white`}>
            Nguyễn Ngọc Thắng và Ngô Thừa Ân
          </span>
        </p>
        <div className="grid grid-flow-col gap-1 justify-center items-center max-[767px]:pb-[25px] min-[991px]:pb-[26px] min-[1230px]:pb-[25px] xl:mb-[8px] md:mb-[4px] sm:mb-[8px]">
          <article className="group my-0 mx-[5px] flex justify-center items-center">
            <Link
              href={"/"}
              aria-label="Facebook"
              className="group-hover:bg-white transition-colors bg-[#E0E0E0] group-hover:text-black text-[#999999] rounded-[50%] p-[10px] h-[45px] w-[45px]"
            >
              <FacebookIcon />
            </Link>
          </article>
          <article className="group my-0 mx-[5px]  flex justify-center items-center">
            <Link
              aria-label="Github"
              href={"/"}
              className="group-hover:bg-white transition-colors  bg-[#E0E0E0] group-hover:text-black  text-[#999999] rounded-[50%] p-[10px] h-[45px] w-[45px]"
            >
              <GitHubIcon />
            </Link>
          </article>
          <article className="group my-0 mx-[5px]  flex justify-center items-center">
            <Link
              href={"/"}
              aria-label="Linkedin"
              className="group-hover:bg-white transition-colors  bg-[#E0E0E0] group-hover:text-black  text-[#999999] rounded-[50%] p-[10px] h-[45px] w-[45px]"
            >
              <LinkedInIcon />
            </Link>
          </article>
          <article className="group my-0 mx-[5px]  flex justify-center items-center">
            <Link
              href={"/"}
              aria-label="Youtube"
              className="group-hover:bg-white transition-colors   bg-[#E0E0E0] group-hover:text-black e text-[#999999] rounded-[50%] p-[10px] h-[45px] w-[45px]"
            >
              <YouTubeIcon />
            </Link>
          </article>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
