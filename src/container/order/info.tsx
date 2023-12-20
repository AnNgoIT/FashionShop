import { UserInfo } from "@/features/types";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { provinces as provincesData } from "@/store/provinces";
import Modal from "@mui/material/Modal";
import { modalStyle } from "@/features/img-loading";
import { UserContext } from "@/store";
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { updateProfile } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { warningMessage } from "@/features/toasting";
import { getData } from "@/hooks/useData";
import Paper from "@mui/material/Paper";

type OrderInfoProps = {
  info?: UserInfo;
  handleOrderInfo: (value: string) => void;
};
const OrderInfo = (props: OrderInfoProps) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const { info, ...rest } = props;
  const result: any[] = provincesData;
  const [address, setAddress] = useState<string | null>(
    info?.address?.split(",")[0]!
  );
  const [addressSuggest, setAddressSuggest] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState<string>("");
  const [provinces, setProvinces] = useState<string>("");
  const [districts, setDistricts] = useState<string>("");
  const [wards, setWards] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState(true);
  const ref = useRef<any>(null);
  const handleBlur = () => {
    // Logic để ẩn thẻ khi focus ra khỏi input
    setIsHidden(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsHidden(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleFocus = () => {
    // Logic khi focus vào input, có thể làm gì đó tại đây nếu cần
    setIsHidden(false);
  };

  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (user && user.address) setAddressList(user.address!.split(","));
  }, [user]);

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const checkAddressExisted = (
    fullAddress: string,
    numberAddress: string,
    province: string,
    district: string,
    ward: string
  ) => {
    // Tách chuỗi địa chỉ thành các thành phần
    const addressComponents = fullAddress.split(" - ");

    // Kiểm tra xem địa chỉ có đúng số lượng thành phần
    if (addressComponents.length !== 4) {
      return false;
    }

    // Kiểm tra từng thành phần với các thông tin tương ứng
    const [address, city, dist, wardInfo] = addressComponents;

    if (address !== numberAddress) {
      return false;
    }

    if (city !== province) {
      return false;
    }

    if (dist !== district) {
      return false;
    }

    if (wardInfo !== ward) {
      return false;
    }
    return true;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlChangeAddressDebounced = useCallback(
    debounce(async function handleGetAddressSuggest(value: string) {
      if (value.trim() !== "") {
        const result = await getData(
          `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&location=21.013715429594125,%20105.79829597455202&input=${value}&more_compound=true`
        );

        setAddressSuggest(result.predictions);
      } else setAddressSuggest([]);
    }, 500),
    []
  );

  const handleModifyAddress = (e: any) => {
    setNewAddress(e.target.value);
    setProvinces("");
    setDistricts("");
    setWards("");
    handlChangeAddressDebounced(e.target.value);
  };

  function resetAddress() {
    setNewAddress("");
    setProvinces("");
    setDistricts("");
    setWards("");
    setAddressSuggest([]);
    setIsAdding(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetAddress();
    setOpen(false);
  };

  const provinceList: string[] =
    result && result.map((item: any) => (item = item.name));

  const districtList: string[] =
    provinces != ""
      ? result
          .find((item: any) => item.name == provinces)
          .districts.map((item: any) => (item = item.name))
      : [];

  const wardList: string[] =
    provinces != "" && districts != ""
      ? result
          .find((item: any) => item.name == provinces)
          .districts.find((item: any) => item.name == districts)
          .wards.map((item: any) => (item = item.name))
      : [];

  const handleChangeAddress = (value: string) => {
    setAddress(value);
    rest.handleOrderInfo(value);
    // setAddress()
  };

  const handleAddress = async (newAddressList: string[]) => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

    const formData = new FormData();
    formData.append("address", newAddressList.join(","));

    const id = toast.loading("Đang tạo mới...");
    const res = await updateProfile(getCookie("accessToken")!, formData);
    if (res.success) {
      toast.update(id, {
        render: `Tạo địa chỉ mới thành công`,
        type: "success",
        autoClose: 1500,
        isLoading: false,
      });
      // router.refresh();
    } else if (res.statusCode == 500) {
      toast.update(id, {
        render: `Lỗi hệ thống`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
      router.refresh();
    } else if (res.statusCode == 401) {
      toast.update(id, {
        render: `Phiên đăng nhập hết hạn, đang tạo phiên mới`,
        type: "warning",
        autoClose: 1500,
        isLoading: false,
      });
      router.refresh();
    } else {
      toast.update(id, {
        render: `${res.message}`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
      router.refresh();
    }
    setUser({ ...user, address: newAddressList.join(",") });
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let check = false;
    addressList.forEach((item) => {
      const result = checkAddressExisted(
        item,
        newAddress?.trim()!,
        provinces,
        districts,
        wards
      );
      if (result == true) {
        check = true;
      }
    });
    if (check) {
      warningMessage("Bạn đã sở hữu địa chỉ này");
      resetAddress();
      // handleClose();
      return;
    }
    const result: string = `${newAddress.trim()!} ${
      provinces.length != 0 ? "- " + provinces : provinces
    } ${districts.length != 0 ? "- " + districts : districts} ${
      wards.length != 0 ? "- " + wards : wards
    }`;
    const newAddressList: string[] = [...addressList, result];
    setAddressList(newAddressList);

    await handleAddress(newAddressList);
    resetAddress();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
  };

  const handleGetDetail = (compound: any) => {
    const newProvince = provinceList.find((item) =>
      item.includes(compound.province)
    );
    const districtList =
      newProvince !== "" &&
      result
        .find((item: any) => item.name == newProvince)
        .districts.map((item: any) => (item = item.name));
    const newDistrict = districtList.find((item: any) =>
      item.includes(compound.district)
    );
    const newWardList: string[] =
      newProvince != "" &&
      newDistrict != "" &&
      result
        .find((item: any) => item.name == newProvince)
        .districts.find((item: any) => item.name == newDistrict)
        .wards.map((item: any) => (item = item.name));
    const newWard = newWardList.find((item: any) =>
      item.includes(compound.commune)
    );
    setProvinces(newProvince || "");
    setDistricts(newDistrict || "");
    setWards(newWard || "");
    setAddressSuggest([]);
  };

  return (
    <div
      className="w-full flex max-md:flex-col max-md:justify-center max-md:gap-y-4 place-content-between
     items-center gap-x-8 text-base text-text-color p-4"
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="order-ifo-title"
        aria-describedby="order-info-description"
      >
        {isAdding ? (
          <Box sx={modalStyle}>
            <h2 className="w-full text-2xl tracking-[0] text-secondary-color uppercase font-semibold text-center pb-4">
              Tạo địa chỉ mới
            </h2>
            <form
              onSubmit={(event) => handleSubmit(event)}
              className="col-span-full grid grid-flow-col grid-cols-12 "
            >
              <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                <FormControl className="col-span-full">
                  <InputLabel className="mb-2" htmlFor="NewAddress">
                    Địa chỉ
                  </InputLabel>
                  <OutlinedInput
                    autoComplete="true"
                    fullWidth
                    required
                    id="NewAddress"
                    value={newAddress}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onChange={handleModifyAddress}
                    label="Địa chỉ"
                  />
                </FormControl>
                <Paper className="absolute top-[132px] left-[7%] right-[7%] z-[2] col-span-full flex flex-col shadow-hd rounded-lg">
                  <div className="max-h-[10.5rem] overflow-auto">
                    {!isHidden &&
                      addressSuggest &&
                      addressSuggest.length > 0 &&
                      addressSuggest.map((address, index) => {
                        return (
                          <div
                            onMouseDown={() => {
                              setNewAddress(
                                address.structured_formatting.main_text
                              );
                              handleGetDetail(address.compound);
                            }}
                            className="p-3 text-sm hover:bg-primary-color hover:cursor-pointer hover:text-white outline outline-1 outline-border-color"
                            key={index}
                          >
                            {address.description}
                          </div>
                        );
                      })}
                  </div>
                </Paper>
              </div>
              <div className="col-span-full grid grid-cols-12 gap-4">
                <div className="col-span-full">
                  <Autocomplete
                    sx={{
                      width: "100%",
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined || value === "" || option === value
                    }
                    value={provinces}
                    onChange={(_event, newProvinces) => {
                      setProvinces(newProvinces || "");
                      setDistricts("");
                      setWards("");
                    }}
                    options={provinceList}
                    renderInput={(params) => (
                      <TextField required {...params} label="Thành phố/vịnh" />
                    )}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      );
                    }}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                        />
                      ));
                    }}
                  />
                </div>
                <div className="col-span-full">
                  <Autocomplete
                    sx={{
                      width: "100%",
                    }}
                    value={districts}
                    onChange={(_event, newDistricts) => {
                      setDistricts(newDistricts || "");
                      setWards("");
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined || value === "" || option === value
                    }
                    disabled={provinces == ""}
                    options={[...districtList, ""]}
                    renderInput={(params) => (
                      <TextField required {...params} label="Quận/huyện" />
                    )}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      );
                    }}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                        />
                      ));
                    }}
                  />
                </div>
                <div className="col-span-full">
                  <Autocomplete
                    sx={{
                      width: "100%",
                    }}
                    disabled={provinces == "" || districts == ""}
                    value={wards}
                    onChange={(_event, newWards) => {
                      setWards(newWards || "");
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined || value === "" || option === value
                    }
                    options={wardList}
                    renderInput={(params) => (
                      <TextField required {...params} label="Phường/xã" />
                    )}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      );
                    }}
                    renderTags={(tagValue, getTagProps) => {
                      return tagValue.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                        />
                      ));
                    }}
                  />
                </div>
              </div>
              <div className="col-span-full mt-4 flex gap-x-4 justify-end">
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-secondary-color transition-all duration-200 hover:bg-text-color py-4 
                           float-right px-6 text-white rounded-md w-[7rem]"
                >
                  Quay lại
                </button>
                <button
                  className="bg-secondary-color transition-all duration-200 hover:bg-text-color py-4 
                           float-right px-6 text-white rounded-md w-[7rem]"
                  type="submit"
                >
                  Thêm
                </button>
              </div>
            </form>
          </Box>
        ) : (
          <Box sx={modalStyle}>
            <h2 className="w-full text-2xl tracking-[0] text-secondary-color uppercase font-semibold text-center pb-4">
              Địa chỉ của bạn
            </h2>
            <FormControl sx={{ minHeight: "50vh" }} fullWidth>
              <RadioGroup
                name="address"
                value={address}
                onChange={(e) => handleChangeAddress(e.target.value)}
              >
                {addressList &&
                  addressList.map((address, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          index < addressList.length - 1
                            ? "border-b border-text-color "
                            : ""
                        }py-2`}
                      >
                        <FormControlLabel
                          value={address}
                          control={
                            <Radio
                              sx={{
                                "&, &.Mui-checked": {
                                  color: "#f22a59",
                                },
                              }}
                            />
                          }
                          label={address}
                        />
                      </div>
                    );
                  })}
              </RadioGroup>
              <div className="w-full pt-4 flex justify-start gap-x-4">
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-left px-4 text-white rounded-md min-w-[6rem] mb-2"
                >
                  Thêm địa chỉ mới
                </button>
              </div>
            </FormControl>

            <div className="w-full pt-4 flex justify-end gap-x-4 border-t border-border-color">
              <button
                onClick={handleClose}
                className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md w-[6rem]"
              >
                Hủy
              </button>
              <button
                onClick={handleClose}
                className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md"
              >
                Xác nhận
              </button>
            </div>
          </Box>
        )}
      </Modal>
      <div className="grid font-bold">
        <span>{info?.fullname}</span>
        <span> {info?.phone}</span>
      </div>
      <p className="text-center">{address}</p>
      <div>
        <button
          onClick={handleOpen}
          className="px-3 bg-secondary-color py-2 rounded-lg text-white hover:opacity-60 hover:cursor-pointer"
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
};

export default OrderInfo;
