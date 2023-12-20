"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import { empty_address } from "@/assests/images";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { modalStyle } from "@/features/img-loading";
import { provinces as provincesData } from "@/store/provinces";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { UserContext } from "@/store";
import { updateProfile } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { errorMessage, warningMessage } from "@/features/toasting";
import { getData } from "@/hooks/useData";
import Paper from "@mui/material/Paper";

const Address = () => {
  const router = useRouter();
  const result: any[] = provincesData;
  const { user, setUser } = useContext(UserContext);
  const [address, setAddress] = useState<string | null>("");
  const [addressSuggest, setAddressSuggest] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<string>("");
  const [districts, setDistricts] = useState<string>("");
  const [wards, setWards] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [checkUpdated, setUpdated] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [addressList, setAddressList] = useState<string[]>([]);
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

  const handleChangeAddress = (e: any) => {
    setAddress(e.target.value);
    if (!isUpdate) {
      setProvinces("");
      setDistricts("");
      setWards("");
    } else setUpdated(true);
    handlChangeAddressDebounced(e.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetAddress();
    setUpdate(false);
    setOpen(false);
  };

  function resetAddress() {
    setAddress("");
    setProvinces("");
    setDistricts("");
    setWards("");
    setUpdated(false);
    setAddressSuggest([]);
  }

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let check = false;
    addressList.forEach((item) => {
      const result = checkAddressExisted(
        item,
        address?.trim()!,
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
      handleClose();
      return;
    }
    const result: string = `${address?.trim()!} ${
      provinces.length != 0 ? "- " + provinces : provinces
    } ${districts.length != 0 ? "- " + districts : districts} ${
      wards.length != 0 ? "- " + wards : wards
    }`;
    const newAddressList: string[] = [...addressList, result];
    setAddressList(newAddressList);

    await handleAddress(newAddressList);
    resetAddress();
    handleClose();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
  };
  const openUpdateModal = (id: number) => {
    const address = addressList[id].split(" - ");
    setUpdateId(id);
    setAddress(address[0] || "");
    setProvinces(address[1] || "");
    setDistricts(address[2] || "");
    setWards(address[3] || "");
    setUpdate(true);
    handleOpen();
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

  async function handleAddress(newAddressList: string[]) {
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

    const res = await updateProfile(getCookie("accessToken")!, formData);
    if (res.success) {
      resetAddress();
    } else if (res.status == 500) {
      errorMessage("Lỗi hệ thống");
    } else if (res.statusCode == 401) {
      warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
      router.refresh();
    }
    setUser({ ...user, address: newAddressList.join(",") });
  }

  const handleDeleteAddress = async (_thisId?: number) => {
    const newAddressList = addressList.filter(
      (_address, index) => index !== deleteId
    );
    setAddressList(newAddressList);
    setDeleteId(-1);
    handleCloseDialog();
    await handleAddress(newAddressList);
  };

  const handleOpenDialog = (id: number) => {
    setOpenDialog(true);
    setDeleteId(id);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateAddress = async (
    e: { preventDefault: () => void },
    _id: number
  ) => {
    e.preventDefault();
    let check = false;
    addressList.forEach((item) => {
      const result = checkAddressExisted(
        item,
        address?.trim()!,
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
      handleClose();
      return;
    }
    const newAddressList = addressList.map((item: string, index) => {
      if (index == updateId) {
        item = `${address!} ${
          provinces.length != 0 ? "- " + provinces : provinces
        } ${districts.length != 0 ? "- " + districts : districts} ${
          wards.length != 0 ? "- " + wards : wards
        }`;
      }
      return item;
    });
    setAddressList(newAddressList);
    await handleAddress(newAddressList);
    resetAddress();
    setUpdate(false);
    setUpdateId(-1);
    handleClose();
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
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
        bg-white p-5 max-lg:px-10 rounded-sm gap-y-1 h-fit`}
    >
      <div
        className="col-span-full grid grid-flow-col max-md:grid-flow-row 
      gap-4 place-content-center md:items-center md:place-content-between 
      pb-4 border-b-[0] lg:border-b border-border-color"
      >
        <h2 className="text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center">
          Địa chỉ
        </h2>
        <NavigateButton onClick={handleOpen}>
          <AddIcon sx={{ marginRight: "0.25rem" }} />
          Tạo địa chỉ mới
        </NavigateButton>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {isUpdate ? (
            <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
              Cập nhật địa chỉ
            </h2>
          ) : (
            <h2 className="w-full text-2xl tracking-[0] text-secondary-color uppercase font-semibold text-center pb-4">
              Tạo địa chỉ mới
            </h2>
          )}

          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateAddress(event, updateId)
                : (event) => handleSubmit(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12"
          >
            <div
              className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4
                "
            >
              <FormControl className="col-span-full relative">
                <InputLabel className="mb-2" htmlFor="Address">
                  Địa chỉ
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  required
                  id="Address"
                  value={address}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  onChange={handleChangeAddress}
                  // placeholder="Type your Address"
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
                            setAddress(address.structured_formatting.main_text);
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
                    value == undefined || value == "" || option === value
                  }
                  value={provinces || ""}
                  onChange={(_event, newProvinces) => {
                    setProvinces(newProvinces || "");
                    setDistricts("");
                    setWards("");
                    if (isUpdate) setUpdated(true);
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
                    if (isUpdate) setUpdated(true);
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
                    if (isUpdate) setUpdated(true);
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
                type="button"
                className="bg-secondary-color transition-all duration-200 hover:bg-text-color py-4 
                           float-right px-6 text-white rounded-md w-[7rem]"
                onClick={() => resetAddress()}
              >
                Làm mới
              </button>
              <button
                disabled={isUpdate && !checkUpdated}
                className={`bg-secondary-color transition-all duration-200 ${
                  isUpdate && !checkUpdated
                    ? "opacity-60"
                    : "hover:bg-text-color py-4"
                }
                           float-right px-6 text-white rounded-md w-[7rem]`}
                type="submit"
              >
                {isUpdate ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-address-title"
        aria-describedby="delete-address-description"
      >
        <DialogTitle id="delete-address-title">
          {"Xác nhận xóa địa chỉ này?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-address-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={() => handleDeleteAddress(deleteId)} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {addressList && addressList.length > 0 ? (
        <ul className="col-span-full px-2 max-h-[18rem] overflow-auto">
          {addressList.map((address: string, index) => {
            return (
              <li
                key={`address-${index}`}
                className="flex justify-between items-center py-3 border-b border-text-light-color"
              >
                {address && (
                  <>
                    <div>
                      <h1 className="text-md text-secondary-color truncate">
                        {address}
                      </h1>
                    </div>
                    <div className="flex gap-x-1">
                      <Button
                        onClick={() => openUpdateModal(index!)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#333",
                            color: "white",
                          },
                          color: "#f22a59",
                        }}
                      >
                        <ChangeCircleIcon />
                      </Button>
                      <Button
                        onClick={() => handleOpenDialog(index!)}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#333",
                            color: "white",
                          },
                          color: "#f22a59",
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="col-span-full px-2 min-h-[18rem] grid place-content-center">
          <Image
            width={400}
            height={400}
            className="w-full h-full"
            alt="emptyAddress"
            src={empty_address}
          ></Image>
          <span className="text-center">Không có địa chỉ nào</span>
        </div>
      )}
    </div>
  );
};

export default Address;
