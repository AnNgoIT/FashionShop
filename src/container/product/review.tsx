import React from "react";
import Image from "next/image";
import { user_img2 } from "@/assests/users";
import Like from "./rating";

const Review = () => {
  const userCommentList = [
    {
      commentId: 1,
      userId: 1,
      userName: "Nguyễn Thắng",
      datePosted: "14/05/2023",
      userComment: "Sản phẩm này rất tốt, tôi rất hài lòng về nó!",
    },
    {
      commentId: 2,
      userId: 2,
      userName: "Minh Nam",
      datePosted: "12/06/2021",
      userComment:
        "Sản phẩm này có chất lượng cao, tôi đã mua nó để tặng bạn bè!",
    },
    {
      commentId: 3,
      userId: 3,
      userName: "Trần Tâm",
      datePosted: "10/03/2022",
      userComment:
        "Khi tôi nhận sản phẩm thì nó đã bị rách, tôi cần cửa hàng phản hồi giúp tôi!",
    },
  ];
  return (
    <article>
      <h3 className="text-[22px] leading-[30px] font-semibold mb-5">
        03 bình luận
      </h3>
      <form action="/comments" method="post" className="flex">
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
              className="bg-primary-color text-[16px] mt-4 mr-4
            text-center text-white py-[5px] px-[30px] rounded-3xl transition-all duration-200 hover:bg-text-color"
              type="reset"
            >
              Hủy
            </button>
            <button
              className="bg-primary-color text-[16px] mt-4
            text-center text-white py-[5px] px-[30px] rounded-3xl transition-all duration-200 hover:bg-text-color"
              type="submit"
            >
              Gửi
            </button>
          </div>
        </div>
      </form>
      <ul>
        {userCommentList &&
          userCommentList.map((user) => {
            return (
              <li
                key={user.commentId}
                className="flex items-start py-4 px-[10px]"
              >
                <div className=" w-fit mr-[16px]">
                  <Image
                    className="rounded-full w-[50px] h-[50px]"
                    src={user_img2}
                    alt="profileImage"
                  ></Image>
                </div>
                <article className="flex-1 w-fit">
                  <h4 className="py-1">
                    <span className="font-semibold mr-1 text-[16px]">
                      {user.userName}
                    </span>
                    ({user.datePosted})
                  </h4>
                  <p className="text-[16px] text-text-color font-medium">
                    {user.userComment}
                  </p>
                  <Like></Like>
                </article>
              </li>
            );
          })}
      </ul>
    </article>
  );
};

export default Review;
