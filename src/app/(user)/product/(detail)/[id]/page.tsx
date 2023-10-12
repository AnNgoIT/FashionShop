import React from "react";
import Button from "@/components/button";

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  return <div>Hello DetailPage</div>;
};

export default ProductDetailPage;

export const generateStaticParams = async () => {
  // const post = await getData("https://jsonplaceholder.typicode.com/posts");
  // return post.map((post: Post) => {
  //   id: post.id?.toString();
  // });
};
