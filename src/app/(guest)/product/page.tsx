// import MainProduct from "@/container/product/main-product";
import { HTTP_PORT } from "@/app/page";
import { MainProductLoading } from "@/components/loading";
import dynamic from "next/dynamic";

const MainProduct = dynamic(() => import("@/container/product/main-product"), {
  ssr: false,
  loading: () => <MainProductLoading />,
});

export const prefetchAllProducts = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/products`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      // cache: "force-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      next: { revalidate: 100 },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json();
  } catch (error) {}
};

export const findProductsByProductName = async (productName: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products?productName=${productName}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "force-cache",
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    );
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json();
  } catch (error) {}
};

export const fetchAllCategories = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/categories`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      // cache: "force-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      next: { revalidate: 10 },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json();
  } catch (error: any) {}
};

export const fetchAllBrands = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/brands`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // next: { revalidate: 100 },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json();
  } catch (error: any) {}
};

const ProductPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const [productRes, cateRes, brandRes] = await Promise.all([
    findProductsByProductName(query),
    fetchAllCategories(),
    fetchAllBrands(),
  ]);

  const products = productRes?.success ? productRes.result.content : [];
  const categories = cateRes?.success ? cateRes.result.content : [];
  const brands = brandRes?.success ? brandRes.result.content : [];

  // Sử dụng dữ liệu products, categories, brands ở đây

  return (
    <MainProduct categories={categories} brands={brands} products={products} />
  );
};

export default ProductPage;
