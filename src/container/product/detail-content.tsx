import React, { ReactNode } from "react";

const DetailContent = ({
  description,
  content,
}: {
  description?: string;
  content: ReactNode;
}) => {
  return (
    <div className="px-8 py-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] col-span-full rounded-lg">
      <ul
        className="flex text-base text-[#333] font-semibold tracking-[0]
                    border-b border-border-color"
      >
        <li className={`product-detail-tags mr-6`}>{description}</li>
      </ul>
      <div className="py-3">{content}</div>
    </div>
  );
};

export default DetailContent;
