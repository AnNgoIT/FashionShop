"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const Address = () => {
  const { user, setUser } = useContext(UserContext);
  const [address, setAddress] = useState<string | null>("");
  const [provinces, setProvinces] = useState<string>("");
  const [districts, setDistricts] = useState<string>("");
  const [wards, setWards] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [addressList, setAddressList] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.address) setAddressList(user.address!.split(","));
  }, [user]);

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
  }

  const result: any[] = provincesData;

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
    const result: string = `${address!} ${
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
    const address = addressList[0].split("-");
    setUpdateId(id);
    setAddress(address[0] || "");
    setProvinces(address[1] || "");
    setDistricts(address[2] || "");
    setWards(address[3] || "");
    setUpdate(true);
    handleOpen();
  };

  async function handleAddress(newAddressList: string[]) {
    const formData = new FormData();
    formData.append("address", newAddressList.join(","));

    const id = toast.loading("Vui lòng chờ...");
    const res = await updateProfile(getCookie("accessToken")!, formData);
    if (res.success) {
      toast.update(id, {
        render: `Tạo địa chỉ mới thành công`,
        type: "success",
        autoClose: 1500,
        isLoading: false,
      });
    } else if (res.statusCode == 500) {
      toast.update(id, {
        render: `Lỗi hệ thống`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
    } else {
      toast.update(id, {
        render: `${res.message}`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
    }
    setUser({ ...user, address: newAddressList.join(",") });
  }

  const handleDeleteAddress = async (_thisId?: number) => {
    const newAddressList = addressList.filter(
      (_address, index) => index !== deleteId
    );
    console.log(newAddressList);
    await handleAddress(newAddressList);
    setAddressList(newAddressList);
    setDeleteId(-1);
    handleCloseDialog();
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
  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
        bg-white p-5 max-lg:px-10 rounded-sm mb-8 h-fit gap-y-1`}
    >
      <div className="col-span-full grid grid-flow-col max-md:grid-flow-row gap-4 place-content-center md:items-center md:place-content-between pb-4 border-b-[0] lg:border-b border-border-color">
        <h2 className="text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center">
          Address
        </h2>
        <NavigateButton onClick={handleOpen}>
          <AddIcon sx={{ marginRight: "0.25rem" }} />
          New Address
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
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Address">
                  Address
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  required
                  id="Address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  // placeholder="Type your Address"
                  label="Address"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-cols-12 gap-4">
              <div className="col-span-full">
                <Autocomplete
                  sx={{
                    width: "100%",
                  }}
                  readOnly={isUpdate}
                  disabled={isUpdate}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option === value
                  }
                  value={provinces}
                  onChange={(_event, newProvinces) => {
                    setProvinces(newProvinces!);
                  }}
                  options={provinceList}
                  renderInput={(params) => (
                    <TextField {...params} label="Citys/Provinces" />
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
                  readOnly={isUpdate}
                  value={districts}
                  onChange={(_event, newDistricts) => {
                    setDistricts(newDistricts!);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option === value
                  }
                  disabled={provinces == "" || isUpdate}
                  options={[...districtList, ""]}
                  renderInput={(params) => (
                    <TextField {...params} label="Districts" />
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
                  readOnly={isUpdate}
                  disabled={provinces == "" || districts == "" || isUpdate}
                  value={wards}
                  onChange={(_event, newWards) => {
                    setWards(newWards!);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option === value
                  }
                  options={wardList}
                  renderInput={(params) => (
                    <TextField {...params} label="Wards" />
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
                className="bg-secondary-color transition-all duration-200 hover:bg-text-color py-4 
                           float-right px-6 text-white rounded-md w-[7rem]"
                type="submit"
              >
                Thêm
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
          {"Confirm to delete this address?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-address-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => handleDeleteAddress(deleteId)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {addressList && addressList.length != 0 ? (
        <ul className="col-span-full h-[14rem] overflow-auto px-2">
          {addressList.map((address: string, index) => {
            return (
              <li
                key={`address-${index}`}
                className="flex justify-between items-center py-3 border-b border-text-light-color"
              >
                {address && (
                  <>
                    <div>
                      <h1 className="text-lg text-secondary-color">
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
        <div className="col-span-full min-h-[14rem] grid place-content-center">
          <Image alt="emptyAddress" src={empty_address}></Image>
          <span className="text-center">Empty Address</span>
        </div>
      )}
    </div>
  );
};

export default Address;
