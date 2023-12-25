"use client";
import Title from "@/components/dashboard/Title";
import Toolbar from "@mui/material/Toolbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import InfoIcon from "@mui/icons-material/Info";
import {
  VisuallyHiddenInput,
  imageLoader,
  modalStyle,
} from "@/features/img-loading";
import { SaleBanner } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import { createData, getDataAdmin, patchData } from "@/hooks/useAdmin";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { warningMessage } from "@/features/toasting";
import { decodeToken } from "@/features/jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import { HTTP_PORT, getData } from "@/hooks/useData";

type AdminSaleBannerProps = {
  banners: SaleBanner[];
  token?: { accessToken?: string; refreshToken?: string };
};

// type UpdateSaleBanner = {
//   name: string;
//   parentId: number | null;
//   imageFile: string;
// };
const AdminSaleBanner = (props: AdminSaleBannerProps) => {
  const { banners, token } = props;
  const router = useRouter();
  const [saleBanner, setSaleBanner] = useState<SaleBanner>({
    bannerId: 0,
    image: "",
    isActive: false,
  });
  const [image, setImage] = useState<any>("");
  const [isUpdate, setUpdate] = useState<boolean>(false);

  const [bannerDetail, setBannerDetail] = useState<SaleBanner | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [saleBannerList, setSaleBannerList] = useState<SaleBanner[]>(
    banners.sort((a, b) => b.bannerId - a.bannerId).slice(0, rowsPerPage)
  );

  useEffect(() => {
    banners &&
      setSaleBannerList(
        banners.sort((a, b) => b.bannerId - a.bannerId).slice(0, rowsPerPage)
      );
    if (token && token.accessToken && token.refreshToken) {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken!)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken!)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
  }, [banners, rowsPerPage, token]);

  function resetSaleBanner() {
    setSaleBanner({
      bannerId: 0,
      image: "",
      isActive: false,
    });
    setBannerDetail(null);
    setImage("");
  }

  const handleOpen = () => {
    resetSaleBanner();
    setOpen(true);
  };
  const handleClose = () => {
    resetSaleBanner();
    setUpdate(false);
    setOpen(false);
  };
  const handleCloseDetail = () => {
    resetSaleBanner();
    setOpenDetail(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setSaleBanner({ ...saleBanner, image: imageUrl });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const openInfoModal = async (item: SaleBanner) => {
    setOpenDetail(true);
    const bannerRes = await getData(
      `${HTTP_PORT}/api/v1/banners/${item.bannerId}`
    );
    setBannerDetail(bannerRes.success ? bannerRes.result : null);
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newSaleBannerList = banners.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setSaleBannerList(newSaleBannerList);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setSaleBannerList(banners.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  // async function handleUpdateSaleBanner(
  //   event: React.FormEvent<HTMLFormElement>
  // ) {
  //   event.preventDefault();
  //   if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
  //     warningMessage("Đang tạo lại phiên đăng nhập mới");
  //     router.refresh();
  //     return undefined;
  //   } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
  //     warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
  //     router.push("/login");
  //     router.refresh();
  //     return;
  //   }
  // }

  async function handleCreateSaleBanner(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return undefined;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

    const formData = new FormData();
    if (image !== "") {
      formData.append("image", image);
    }

    const id = toast.loading("Đang tạo...");
    const res = await createData(
      "/api/v1/users/admin/banners",
      getCookie("accessToken")!,
      formData
    );
    if (res.success) {
      toast.update(id, {
        render: `Tạo mới banner quảng cáo thành công`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      handleClose();
      router.refresh();
    } else if (res.statusCode == 403 || res.statusCode == 401) {
      toast.update(id, {
        render: `Vui lòng đăng nhập`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else {
      toast.update(id, {
        render: "Lỗi hệ thống",
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    }
  }

  // async function handleChangeSaleBannerActive(item: SaleBanner) {
  //   console.log(item);
  //   const newActiveStatus = item.isActive ? false : true;
  //   const changeSaleBannerActive = await patchData(
  //     `/api/v1/users/admin/banners/${item.bannerId}`,
  //     getCookie("accessToken")!,
  //     { isActive: newActiveStatus }
  //   );

  //   if (changeSaleBannerActive.success) {
  //     successMessage("Đổi trạng thái danh mục thành công");
  //     setSaleBannerList(
  //       banners
  //         .filter((SaleBanner) => SaleBanner.bannerId !== item.bannerId)
  //         .sort((a, b) => b.bannerId - a.bannerId)
  //         .slice(0, rowsPerPage)
  //     );
  //     router.refresh();
  //   } else if (changeSaleBannerActive.status == 401) {
  //     warningMessage("Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới");
  //     router.refresh();
  //   } else if (changeSaleBannerActive.status == 500) {
  //     errorMessage("Lỗi hệ thống");
  //     router.refresh();
  //   } else if (changeSaleBannerActive.status == 404) {
  //     errorMessage("Không tìm thấy danh mục này");
  //   } else errorMessage("Lỗi sai dữ liệu truyền");
  // }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Modal
        open={openDetail}
        onClose={handleCloseDetail}
        aria-labelledby="order-tracking-title"
        aria-describedby="order-tracking-description"
      >
        <Box sx={modalStyle}>
          {bannerDetail && bannerDetail.image !== "" ? (
            <>
              <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
                Chi tiết banner
              </h2>
              <div className="col-span-full grid grid-flow-col grid-cols-12 ">
                <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium p-1">
                  <div className="grid items-center w-fit gap-x-2 justify-center my-2">
                    {bannerDetail.image ? (
                      <Image
                        loader={imageLoader}
                        blurDataURL={bannerDetail.image}
                        placeholder="blur"
                        className="w-[8rem] h-[8rem] p-1 border border-border-color"
                        width={300}
                        height={300}
                        src={bannerDetail.image}
                        alt="Uploaded Image"
                      ></Image>
                    ) : (
                      <p className="grid place-content-center text-xl text-text-color">
                        Không có ảnh banner
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-full grid place-items-center gap-x-2 p-1">
                  <span className="text-lg font-semibold text-secondary-color">
                    ID Banner: {bannerDetail?.bannerId}
                  </span>
                </div>
                <div className="col-span-full grid place-items-center text-lg text-text-color gap-x-2 p-1">
                  <span>
                    Trạng thái:{" "}
                    {bannerDetail?.isActive == true
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center p-4 h-[17rem]">
              <CircularProgress />
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            {isUpdate ? `Cập nhật banner` : "Tạo banner mới"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? () => {} //(event) => handleUpdateSaleBanner(event)
                : (event) => handleCreateSaleBanner(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid text-sm text-[#999] font-medium mb-4  place-items-center">
              {saleBanner && saleBanner.image ? (
                <Image
                  loader={imageLoader}
                  className="w-[6.25rem] h-[6.25rem] rounded-md"
                  width={300}
                  height={300}
                  src={saleBanner.image}
                  alt="Uploaded Image"
                ></Image>
              ) : (
                <p className="grid place-content-center text-xl text-text-color">
                  Không có ảnh nào
                </p>
              )}
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Tải ảnh lên
                <VisuallyHiddenInput
                  required={!isUpdate}
                  onChange={(e) => handleImageUpload(e)}
                  type="file"
                />
              </Button>
            </div>
            <div className="col-span-full">
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                type="submit"
              >
                {isUpdate ? "Lưu" : "Tạo"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* banners */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              // height: 240,
              overflow: "auto",
            }}
          >
            <Title>
              <div className="flex w-full justify-between items-center min-w-[680px]">
                <span>Danh sách banner quảng cáo</span>
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  Tạo mới
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID Banner</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saleBannerList &&
                  saleBannerList.map((item) => (
                    <TableRow key={item.bannerId}>
                      <TableCell>
                        <span className="text-center">{item.bannerId}</span>
                      </TableCell>
                      <TableCell>
                        {item.isActive == true
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </TableCell>
                      <TableCell>
                        {item.image !== "" && item.image && (
                          <Image
                            loader={imageLoader}
                            className="w-[4rem] h-[4rem] outline outline-1 outline-border-color p-1"
                            width={80}
                            height={80}
                            alt="productImg"
                            src={item.image}
                            priority
                          ></Image>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => openInfoModal(item)}
                          sx={{
                            "&:hover": {
                              color: "#999",
                              opacity: "0.6",
                              background: "white",
                            },
                            color: "#639df1",
                          }}
                        >
                          <InfoIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={banners.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminSaleBanner;
