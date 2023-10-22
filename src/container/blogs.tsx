import { blog_img1, blog_img2, blog_img3 } from "@/assests/images";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { imageLoader } from "@/features/img-loading";
const Blogs = () => {
  return (
    <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Recent Blogs</span>
        </div>
      </div>
      <div className="col-span-full grid grid-cols-12 gap-7 place-content-center">
        <div className="lg:relative col-span-full lg:col-span-6 max-lg:grid max-lg:grid-flow-col max-lg:grid-cols-12">
          <div className="col-span-full sm:col-span-6 md:col-span-4">
            <Link href="/blog">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="w-full"
                width={300}
                // height={0}s
                alt="latestBlog"
                src={blog_img1}
              ></Image>
            </Link>
          </div>

          <div className="lg:absolute bottom-0 left-0 right-0 col-span-full sm:col-span-6 md:col-span-8 bg-primary-color text-white p-4">
            <h5>
              Admin (
              {`${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()} `}
              )
            </h5>
            <h3 className="truncate text-2xl uppercase">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium, velit totam. Facere, veritatis eius!
            </h3>
            <p className="py-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
              minus?
            </p>
            <Link className="hover:opacity-60" href="/blog">
              Read More
            </Link>
          </div>
        </div>
        <div className="col-span-full lg:col-span-6 grid grid-cols-2 gap-7 h-fit">
          <div className="col-span-full grid sm:grid-flow-col grid-cols-1 sm:grid-cols-12">
            <div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-6">
              <Link href="/blog">
                <Image
                  loader={imageLoader}
                  placeholder="blur"
                  className="w-full h-full"
                  width={100}
                  alt="latestBlog"
                  src={blog_img2}
                ></Image>
              </Link>
            </div>
            <div className="col-span-full sm:col-span-6 md:col-span-8 lg:col-span-6 bg-secondary-color text-white">
              <div className="p-4">
                <h5>
                  Admin (
                  {`${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()} `}
                  )
                </h5>
                <h3 className="truncate text-2xl uppercase">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laudantium, velit totam. Facere, veritatis eius!
                </h3>
                <p className="py-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
                  minus?
                </p>
                <Link className="hover:opacity-60" href="/blog">
                  Read More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-full grid sm:grid-flow-col grid-cols-1 sm:grid-cols-12">
            <div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-6">
              <Link href="/blog">
                <Image
                  loader={imageLoader}
                  placeholder="blur"
                  className="w-full h-full"
                  width={100}
                  alt="latestBlog"
                  src={blog_img3}
                ></Image>
              </Link>
            </div>
            <div className="col-span-full sm:col-span-6 md:col-span-8 lg:col-span-6 bg-secondary-color text-white">
              <div className="p-4">
                <h5>
                  Admin (
                  {`${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()} `}
                  )
                </h5>
                <h3 className="truncate text-2xl uppercase">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laudantium, velit totam. Facere, veritatis eius!
                </h3>
                <p className="py-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
                  minus?
                </p>
                <Link className="hover:opacity-60" href="/blog">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
