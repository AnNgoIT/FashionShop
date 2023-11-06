import Link from "next/link";
import React, { useRef, useState } from "react";
import Image from "next/image";
const ProfileForm = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
    console.log({
      username,
      fullname,
      email,
      birthdate,
      gender,
      profileImage,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setProfileImage(imageUrl);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCustomButtonClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <section className="vertical-section">
      <div className="mycontainer block">
        <div
          className={`grid grid-cols-12 max-[991px]:px-[15px] gap-x-[30px] `}
        >
          <h2 className="col-span-full text-[35px] leading-10 tracking-[0] text-text-color uppercase font-semibold mb-[30px] text-center">
            Profile
          </h2>
          <form
            className="col-span-4 col-start-3 max-[767px]:col-span-full 
            max-[991px]:col-span-6 max-[991px]:col-start-2 w-full pb-[30px] md:border-r-[1px]  md:border-[#999] md:pr-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333] mb-2" htmlFor="username">
                Username :
              </label>
              <input
                className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333] mb-2" htmlFor="fullname">
                Fullname :
              </label>
              <input
                className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
                type="text"
                id="fullname"
                value={fullname}
                onChange={(event) => setFullname(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333] mb-2" htmlFor="email">
                Email :
              </label>
              <input
                className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
                type="text"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333] mb-2" htmlFor="phoneNumber">
                Phone Number :
              </label>
              <input
                className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
                type="text"
                id="phoneNumber"
                value={phonenumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="flex items-center text-center text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333]" htmlFor="gender">
                Gender :
              </label>
              <select
                className="ml-2 p-2 outline-none border-[2px] rounded-md border-[#ccc]"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px]">
              <label className="text-[#333]  mb-2">Birthdate :</label>
              <input
                className="bg-white outline-none w-full border border-[#e5e5e5]
               py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
            <Link href={"/profile"}>
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
                type="submit"
              >
                Save
              </button>
            </Link>
          </form>
          <div
            className="col-span-4 max-[767px]:col-span-full 
            max-[991px]:col-span-4 w-full pb-[30px] max-[767px]:row-start-2"
          >
            <div className="flex flex-col text-[14px] leading-[24px] text-[#999] font-medium mb-[29px] items-center justify-center">
              {profileImage ? (
                <Image
                  onClick={() => {
                    handleCustomButtonClick();
                  }}
                  className="rounded-full w-[100px] h-[100px]"
                  width={300}
                  height={300}
                  src={profileImage}
                  alt="Uploaded Image"
                ></Image>
              ) : (
                <div
                  onClick={() => {
                    handleCustomButtonClick();
                  }}
                  className="text-[16px]"
                >
                  No Avatar Selected
                </div>
              )}
              <label className="mt-4 flex">
                <input
                  className="hidden"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                <button
                  onClick={() => {
                    handleCustomButtonClick();
                  }}
                  className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
                  type="submit"
                >
                  Upload Avatar
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;
