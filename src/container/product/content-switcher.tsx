import React, { useState } from "react";
import Review from "./review";

const ContentSwitcher = ({ description }: any) => {
  const [activeItem, setActiveItem] = useState(0);

  const handleItemClick = (index: React.SetStateAction<number>) => {
    setActiveItem(index);
  };

  return (
    <div className="px-8 pt-8 shadow-[0_0_20px_rgba(0,0,0,0.1)] col-span-full">
      <ul
        className="flex text-base text-[#333] font-semibold tracking-[0]
                    border-b border-border-color"
      >
        <li
          className={`product-detail-tags mr-6 ${
            activeItem === 0 ? "product-detail-tags-active" : ""
          }`}
          onClick={() => handleItemClick(0)}
        >
          Mô tả
        </li>
        <li
          className={`product-detail-tags ${
            activeItem === 1 ? "product-detail-tags-active" : ""
          }`}
          onClick={() => handleItemClick(1)}
        >
          Bình luận
        </li>
      </ul>
      <div className="py-5">
        {activeItem === 0 && (
          <p className="text-[#999] text-base">{description}</p>
        )}
        {activeItem === 1 && <Review></Review>}
      </div>
    </div>
  );
};

export default ContentSwitcher;
