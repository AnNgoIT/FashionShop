"use client";
import Title from "@/components/dashboard/Title";
import UpdateIcon from "@mui/icons-material/Update";
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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useEffect, useState } from "react";
import { modalStyle } from "@/features/img-loading";
import { Style } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { createData } from "@/hooks/useAdmin";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

type AdminStyleProps = {
  styles: Style[];
};
const AdminStyle = (props: AdminStyleProps) => {
  const { styles } = props;
  const router = useRouter();
  const [style, setStyle] = useState<Style>({
    styleId: 0,
    name: "",
    isActive: false,
  });

  const [isUpdate, setUpdate] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [styleList, setstyleList] = useState<Style[]>(
    styles.sort((a, b) => b.styleId - a.styleId).slice(0, rowsPerPage)
  );

  useEffect(() => {
    styles &&
      setstyleList(
        styles.sort((a, b) => b.styleId - a.styleId).slice(0, rowsPerPage)
      );
  }, [styles, rowsPerPage]);

  function resetStyle() {
    setStyle({
      styleId: 0,
      name: "",
      isActive: false,
    });
    setPage(0);
    setRowsPerPage(5);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetStyle();
    setUpdate(false);
    setOpen(false);
  };

  const handleStyle = (e: any) => {
    const value = e.target.value;
    setStyle({
      ...style,
      [e.target.name]: value,
    });
  };

  const openUpdateModal = (id: number) => {
    // const category = categoryList.find((category) => category.styleId == id);
    // setUpdateId(id);
    // setName(category?.name!);
    // setImage(category?.image!);
    // setUpdatedAt(category?.updatedAt!);
    // setUpdate(true);
    // handleOpen();
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newstyleList = styles.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setstyleList(newstyleList);
  };

  const handleSearchstyles = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setstyleList(styles.slice(0, rowsPerPage));
    else {
      const newstyleList = styles.filter((item) => item.name.includes(name));
      setstyleList(newstyleList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setstyleList(styles.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  // function handleUpdateStyle(
  //   event: React.FormEvent<HTMLFormElement>,
  //   id: number
  // ) {
  //   event.preventDefault();
  //   const newCategoryList = categoryList.map((item: Category) => {
  //     if (item.styleId == id) {
  //       item = {
  //         styleId: id,
  //         name,
  //         parentName: undefined,
  //         image,
  //         createdAt,
  //         updatedAt,
  //         isActive: true,
  //         styleNames: [],
  //       };
  //     }
  //     return item;
  //   });
  //   setCategoryList(newCategoryList);

  //   resetStyle();
  //   setUpdateId(-1);
  //   handleClose();
  // }
  async function handleCreateStyle(e: { preventDefault: () => void }) {
    e.preventDefault();

    const payload = {
      name: style.name,
    };
    const id = toast.loading("Creating...");
    const res = await createData(
      "/api/v1/users/admin/styles",
      getCookie("accessToken")!,
      payload,
      "application/json"
    );
    if (res.success) {
      toast.update(id, {
        render: `Created Style Success`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      handleClose();
      router.refresh();
    } else if (res.statusCode == 403 || res.statusCode == 401) {
      toast.update(id, {
        render: `You don't have permission`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else if (res.statusCode == 409) {
      toast.update(id, {
        render: "Style already existed",
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else {
      toast.update(id, {
        render: "Server Error",
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    }
  }

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
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            {isUpdate ? `Style ID: ${updateId}` : "Create Style"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => {} //handleUpdateCategory(event, updateId)
                : (event) => handleCreateStyle(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Name
                </InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  fullWidth
                  name="name"
                  id="Name"
                  value={style.name}
                  onChange={handleStyle}
                  label="Name"
                />
              </FormControl>
            </div>
            <div className="col-span-full">
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                type="submit"
              >
                {isUpdate ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* styles */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <Title>
              <div className="flex w-full justify-between items-center min-w-[680px]">
                <span>Style List</span>
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newStyle) =>
                    handleSearchstyles(e, newStyle?.name!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.name == "" ||
                    option.name == value.name
                  }
                  options={styles}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="styles" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.styleId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <span key={`cate-name-${option.styleId}`}>
                          {option.name}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.styleId}
                        label={option.styleId}
                      />
                    ));
                  }}
                />
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  New Style
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {styleList &&
                  styleList.length > 0 &&
                  styleList.map((item) => (
                    <TableRow key={item.styleId}>
                      <TableCell>
                        <span className="text-center">{item.name}</span>
                      </TableCell>
                      <TableCell sx={{ minWidth: "18rem" }}>
                        {/* <Button
                          onClick={() => openUpdateModal(item.styleId)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                              opacity: "0.6",
                            },
                            color: "#639df1",
                          }}
                        >
                          <UpdateIcon />
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={styles.length}
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

export default AdminStyle;