"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import { empty_address } from "@/assests/images";
import { useProvinces } from "@/hooks/Province/useProvinces";
import Loading from "../loading";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 4,
};

export type Address = {
  id?: number;
  address?: string;
  provinces?: string;
  districts?: string;
  wards?: string;
};

const AddressPage = () => {
  const [address, setAddress] = useState<string>("");
  const [provinces, setProvinces] = useState<string>("");
  const [districts, setDistricts] = useState<string>("");
  const [wards, setWards] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [addressList, setAddressList] = useState<Address[]>([
    {
      id: 1,
      address: "282 Vĩnh Phúc",
      provinces: "Thành phố Hà Nội",
      districts: "Quận Ba Đình",
      wards: "Phường Vĩnh Phúc",
    },
  ]);

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

  const dataList = useProvinces();
  if (dataList.isLoading) return <Loading />;

  const provinceList: string[] = dataList.result.map(
    (item: any) => (item = item.name)
  );
  const districtList: string[] =
    provinces != ""
      ? dataList.result
          .find((item: any) => item.name == provinces)
          .districts.map((item: any) => (item = item.name))
      : [];
  const wardList: string[] =
    provinces != "" && districts != ""
      ? dataList.result
          .find((item: any) => item.name == provinces)
          .districts.find((item: any) => item.name == districts)
          .wards.map((item: any) => (item = item.name))
      : [];
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newId = addressList[addressList.length - 1].id!;
    const result: Address = {
      id: newId + 1,
      address,
      provinces,
      districts,
      wards,
    };
    const newAddressList: Address[] = [...addressList, result];
    setAddressList(newAddressList);
    resetAddress();
    handleClose();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
  };
  const openUpdateModal = (id: number) => {
    const address = addressList.find((address) => address.id == id);
    setUpdateId(id);
    setAddress(address?.address!);
    setProvinces(address?.provinces!);
    setDistricts(address?.districts!);
    setWards(address?.wards!);
    setUpdate(true);
    handleOpen();
  };

  const handleDeleteAddress = (id: number) => {
    const newAddressList = addressList.filter((address) => address.id != id);
    setAddressList(newAddressList);
  };

  const handleUpdateAddress = (
    e: { preventDefault: () => void },
    id: number
  ) => {
    e.preventDefault();
    if (isUpdate && address && provinces && districts && wards) {
      const newAddressList = addressList.map((item: Address) => {
        if (item.id == id) {
          item = { id, address, provinces, districts, wards };
        }
        return item;
      });
      setAddressList(newAddressList);

      resetAddress();
      setUpdate(false);
      setUpdateId(-1);
      handleClose();
    }
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
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateAddress(event, updateId)
                : (event) => handleSubmit(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-8">
                <InputLabel className="mb-2" htmlFor="Address">
                  Address
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  // placeholder="Type your Address"
                  label="Address"
                />
              </FormControl>
              <div className="col-span-3 col-start-10">
                <button
                  className="bg-primary-color transition-all duration-200 hover:bg-text-color py-4 
                           float-right px-6 text-white rounded-[5px]"
                  type="submit"
                >
                  {isUpdate ? "Update" : "Add"}
                </button>
              </div>
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
                  onChange={(event, newProvinces) => {
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
                  value={districts}
                  onChange={(event, newDistricts) => {
                    setDistricts(newDistricts!);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option === value
                  }
                  disabled={provinces == ""}
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
                  disabled={provinces == "" || districts == ""}
                  value={wards}
                  onChange={(event, newWards) => {
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
          </form>
        </Box>
      </Modal>
      {addressList && addressList.length != 0 ? (
        <ul className="col-span-full h-[14rem] overflow-auto px-2">
          {addressList.map((address, index) => {
            return (
              <li
                key={`address-${address.id}`}
                className="flex justify-between items-center py-3 border-b border-text-light-color"
              >
                <div className="">
                  <h1 className="text-lg text-secondary-color">
                    {address.address}
                  </h1>
                  <h2 className="flex">
                    {`${address.provinces ? address.provinces + " - " : ""}${
                      address.districts ? address.districts + " - " : ""
                    }${address.wards}`}
                  </h2>
                </div>
                <div className="flex gap-x-1">
                  <Button
                    onClick={() => openUpdateModal(address.id!)}
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
                    onClick={() => handleDeleteAddress(address.id!)}
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

export default AddressPage;
