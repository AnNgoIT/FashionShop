import React from "react";
import Image from "next/image";
import { user_img2 } from "@/assests/users";
import Like from "./rating";
import { RatingType } from "@/features/types";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";

const Review = ({ rating }: { rating: RatingType[] }) => {
  const ratingList: RatingType[] = typeof rating === "string" ? [] : rating;
  return (
    <article className="max-h-[24rem] overflow-auto">
      <h3 className="px-2 text-lg leading-[30px] font-semibold ">
        {ratingList.length} đánh giá
      </h3>
      {/* <form action="/comments" method="post" className="flex">
        <div className="w-fit mr-1">
          <Image
            className="rounded-full w-[50px] h-[50px]"
            src={user_img2}
            alt="profileImage"
          ></Image>
        </div>
        <div className="flex-1 relative group">
          <input
            className="peer round-md py-2.5 transition-all duration-200 
                    px-5 w-full border-b border-border-color
                    outline-none focus:border-b-[#000] focus:border-b"
            type="text"
            placeholder="Viết phản hồi"
          ></input>
          <div className="peer-focus:block float-right hidden">
            <button
              className="bg-primary-color text-base mt-4 mr-4
            text-center text-white py-[5px] px-[30px] rounded-3xl transition-all duration-200 hover:bg-text-color"
              type="reset"
            >
              Hủy
            </button>
            <button
              className="bg-primary-color text-base mt-4
            text-center text-white py-[5px] px-[30px] rounded-3xl transition-all duration-200 hover:bg-text-color"
              type="submit"
            >
              Gửi
            </button>
          </div>
        </div>
      </form> */}
      <ul>
        {ratingList && ratingList.length > 0 ? (
          ratingList.map((item, index) => {
            return (
              <li
                key={index}
                className={`flex items-start py-4 px-2 ${
                  index < rating.length - 1 && "border-b border-border-color"
                }`}
              >
                <div className=" w-fit mr-[16px]">
                  {item.image && (
                    <Avatar
                      alt="user-avatar"
                      src={item.image || user_img2.src}
                    />
                  )}
                </div>
                <article className="flex-1 w-fit">
                  <div className="py-1 flex flex-col text-sm">
                    <span className="font-semibold mr-1">{item.fulname}</span>
                    <Rating
                      sx={{
                        paddingRight: "0.5rem",
                        // marginBottom: "0.25rem",
                      }}
                      name="read-only-review-start"
                      value={item.star}
                      readOnly
                    />
                    ({dayjs(new Date(item.createdAt!)).format("DD/MM/YYYY")})
                  </div>
                  <p className="text-base text-text-color font-medium">
                    {item.content}
                  </p>
                  {/* <Like></Like> */}
                </article>
              </li>
            );
          })
        ) : (
          <div className="min-h-[4rem] w-full grid place-content-center text-xl font-bold">
            Không có đánh giá nào
          </div>
        )}
      </ul>
    </article>
  );
};

export default Review;
