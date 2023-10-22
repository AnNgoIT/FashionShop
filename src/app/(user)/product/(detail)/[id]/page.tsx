import React from "react";

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  return <div>Hello product with id {params.id}</div>;
};

export default ProductDetailPage;

// export const generateStaticParams = async () => {
//   // const post = await getData("https://jsonplaceholder.typicode.com/posts");
//   // return post.map((post: Post) => {
//   //   id: post.id?.toString();
//   // });
// };
