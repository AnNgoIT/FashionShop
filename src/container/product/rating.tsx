import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";
import { user_img2 } from "@/assests/users";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
});
const Like = () => {
  const [likeValue, setLikeValue] = useState<number>(0);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  function handleReply() {
    setIsReplying(!isReplying);
  }

  function handleComment() {
    handleReply();
  }

  return (
    <>
      <Box
        sx={{
          "& > legend": {
            mt: 2,
          },
          display: "flex",
          alignItems: "center",
        }}
      >
        <StyledRating
          name="customized-color"
          defaultValue={0}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onChange={(event, newValue) => {
            setLikeValue(newValue ? newValue : 0);
          }}
          max={1}
        />
        <Box sx={{ px: 1, width: "0.5rem" }}>{likeValue}</Box>
        <Button
          sx={{ padding: 0, textTransform: "capitalize" }}
          onClick={handleReply}
        >
          Reply
        </Button>
      </Box>
      {isReplying && (
        <form action="/comments" method="post" className="flex mt-4">
          <div className="w-fit mr-1">
            <Image
              className="rounded-full w-8 h-8"
              src={user_img2}
              alt="profileImage"
            ></Image>
          </div>
          <div className="flex-1 relative group">
            <input
              className="peer round-md py-[10px] transition-all duration-200 
                px-[20px] w-full border-b border-border-color
                outline-none focus:border-b-[#000] focus:border-b"
              type="text"
              placeholder="Viết phản hồi"
            ></input>
            <div className="float-right">
              <button
                onClick={handleReply}
                className="bg-primary-color mt-4 mr-4
        text-center text-white py-[5px] px-8 rounded-3xl transition-all duration-200 hover:bg-text-color"
                type="reset"
              >
                Hủy
              </button>
              <button
                onClick={handleComment}
                className="bg-primary-color mt-4
        text-center text-white py-[5px] px-[30px] rounded-3xl transition-all duration-200 hover:bg-text-color"
                type="submit"
              >
                Gửi
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Like;
