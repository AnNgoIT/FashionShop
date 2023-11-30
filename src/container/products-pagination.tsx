import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ProductDetail } from "@/features/product";

const Pagination = ({
  totalPages,
  pageIndex,
  setIndex,
}: {
  totalPages: number;
  pageIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  productList: ProductDetail[];
}) => {
  const handlePageChange = (pageNumber: any) => {
    setIndex(pageNumber);
    // Thực hiện các xử lý cần thiết khi chuyển trang
    // Ví dụ: fetch dữ liệu mới từ API với trang pageNumber
  };
  const getPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 5; // Số lượng trang hiển thị

    if (totalPages <= visiblePageCount) {
      // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng số lượng trang hiển thị
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Xác định trang hiển thị đầu tiên và trang hiển thị cuối cùng
      let startPage = pageIndex + 1;
      let endPage = pageIndex + visiblePageCount - 1;

      if (startPage + visiblePageCount > totalPages) {
        startPage = totalPages - visiblePageCount + 1;
        endPage = totalPages;
      }

      // Hiển thị danh sách trang
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Thêm dấu "..." nếu có trang trước trang đầu tiên
      if (startPage > 1) {
        pageNumbers.unshift("...");
      }

      // Thêm dấu "..." nếu có trang sau trang cuối cùng
      if (endPage < totalPages) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  return (
    <div className={`flex text-center items-center justify-center`}>
      {pageIndex > 1 && (
        <button
          className={`mx-0.5 text-center text-[14px] text-[#333] bg-[#dcdcdc] w-[35px] h-[35px] leading-[35px]`}
          onClick={() => handlePageChange(pageIndex - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
        </button>
      )}
      {getPageNumbers().map((pageNumber, index) => (
        <Fragment key={index}>
          {pageNumber === "..." ? (
            <span className="mx-0.5">...</span>
          ) : (
            <button
              className={`mx-0.5 text-center text-[14px] text-[#333] bg-[#dcdcdc] w-[35px] h-[35px] leading-[35px] ${
                pageNumber === pageIndex ? "paginating-active" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )}
        </Fragment>
      ))}

      {pageIndex < totalPages && (
        <button
          className={`mx-0.5 text-center text-[14px] text-[#333] bg-[#dcdcdc] w-[35px] h-[35px] leading-[35px]`}
          onClick={() => handlePageChange(pageIndex + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
        </button>
      )}
    </div>
  );
};

export default Pagination;
