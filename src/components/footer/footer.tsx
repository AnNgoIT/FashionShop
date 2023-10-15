import Link from "next/link";
import React from "react";
import Image from "next/image";
import { logo } from "@/assests/images";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Footer = () => {
  return (
    <footer>
      <div className=" bg-gradient-to-l md:bg-gradient-to-r transition-colors from-sky-500 to-indigo-500">
        <div className="grid grid-cols-12 justify-items-center text-text-color">
          <div className="col-span-12 md:col-span-4 p-4  grid place-items-center md:place-content-start">
            <div className="">
              <Image alt="Logo of the shop" src={logo}></Image>
            </div>

            <p className="max-w-[100%] justify-self-center">
              Welcome to my website. Enjoy your shopping.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 p-4 grid items-center">
            <span className="uppercase text-[1.375rem] leading-6">
              Information
            </span>
            <ul className="grid place-items-start py-4">
              <li className="transition-colors hover:opacity-60 p-1">
                <Link href="/about">About</Link>
              </li>
              <li className="transition-colors hover:opacity-60 p-1">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="transition-colors hover:opacity-60 p-1">
                <Link href="/">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4 p-4 grid items-center">
            <span className="uppercase text-[1.375rem] leading-6">
              Contact Us
            </span>
            <ul className="grid place-items-start py-4">
              <li className="transition-colors p-1">
                <FontAwesomeIcon icon={faLocationDot} />
                <span className="ml-2">Address</span>
              </li>
              <li className="transition-colors p-1">
                <FontAwesomeIcon icon={faPhone} />
                <span className="ml-2">Phone</span>
              </li>
              <li className="transition-colors p-1">
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="ml-2">Email</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
