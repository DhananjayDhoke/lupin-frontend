import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASEURL } from "../constant/constant";
import ConfirmationPopup from "../popup/Popup";
//import { toast } from "react-toastify";
import Select from "react-select";
import toast from "react-hot-toast";
//import { ThreeDots } from "react-loader-spinner";
const Report = () => {
  const userId = sessionStorage.getItem("userId");
  // data for select tag

  const [campList, setCampList] = useState([]);
  const [representativeList, setRepresentativeList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [pathlabList, setPathlabList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const [campType, setCampType] = useState("");
  const [repId, setRepId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [feedback, setFeedback] = useState("");
  //const [repName, setRepName] = useState('');
  //const [repEmail, setRepEmail] = useState('');
  //const [repMobile, setRepMobile] = useState('');
  //const [repHq, setRepHq] = useState('');
  //const [repZone, setRepZone] = useState('');
  //const [repState, setRepState] = useState('');

  const [screenedCount, setScreenedCount] = useState(null);
  const [prescriptionCount, setPrescriptionCount] = useState(null);
  const [diagnosedCount, setDiagnosedCount] = useState(null);

  const [doctorId, setDoctorId] = useState("");
  const [doctorQualification, setDoctorQualification] = useState("");
  //const [doctorMobile, setDoctorMobile] = useState('');
  //const [doctorAddress, setDoctorAddress] = useState('')
  const [pathlab, setPathlab] = useState("");

  const [campVenue, setCampVenue] = useState("");
  const [campDate, setCampDate] = useState("");
  const [campTime, setCampTime] = useState("");
  const [campPatients, setCampPatients] = useState("");
  //const [abmContact, setAbmContact] = useState('');

  const [listCampType, setListCampType] = useState("");
  const [campReportList, setCampReportList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("campReportList", campReportList);

  const [addRequestModel, setAddRequestModel] = useState(false);
  const [infoReportModel, setInfoReportModel] = useState(false);
  const [editRequestModel, setEditRequestModel] = useState(false);

  const [infoData, setInfoData] = useState({});
  const [campImages, setCampImages] = useState([]);

  // for delete

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [delId, setDelId] = useState("");
  const [editId, setEditId] = useState("");
  const [crid, setCrid] = useState("");

  const [currentIndex, setCurrentIndex] = useState(1);

  // for file upload

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // for camp request data

  const [campRequestList, setCampRequestList] = useState([]);
  const [campRequestData, setCampRequstData] = useState(null);
  const [campReqId, setCampReqId] = useState("");

  const handelAddReport = () => {
    setAddRequestModel(true);
  };
  const handleGoNext = () => {
    if (!campReqId) {
      toast.error("Please Select Camp Request");
      return;
    }
    setCurrentIndex(2);
  };
  const handlePrevious = () => {
    setCurrentIndex(1);
  };
  const handelCloseModel = async () => {
    setAddRequestModel(false);
    setCurrentIndex(1);
    await getCampReportList();
  };

  const handelCloseEditModel = async () => {
    setEditRequestModel(false);
    setCurrentIndex(1);
    await getCampReportList();
    setCampType("");
    setRepId("");
    setDoctorId("");
    setPathlab("");
    setCampVenue("");
    setCampDate("");
    setCampTime("");
    setScreenedCount("");
    setDiagnosedCount("");
    setPrescriptionCount("");
    setBrandId("");
    setSelectedBrands([]);
    setFeedback("");
  };

  const handelInfo = async (campReportId) => {
    await getCampReportInfoWithId(campReportId);
    await getCampReportImages(campReportId);
    setInfoReportModel(true);
  };
  const handelCloseInfoModel = () => {
    setInfoReportModel(false);
    setInfoData({});
  };

  const handelDelete = (campReportId) => {
    setShowDeleteConfirmation(true);
    setDelId(campReportId);
  };
  const handelCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDelId("");
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    try {
      const res = await axios.post(`${BASEURL}/report/deleteReportWithId`, {
        crId: delId,
      });

      //console.log("inside delete",res);
      if (res.data.errorCode == "1") {
        //alert("Camp Report Deleted Successfully");
        toast.success("Camp Report Deleted Successfully");
        await getCampReportList();
        setDelId("");
      } else {
        toast.error(`Failed to delete employee with ID ${delId}`);
        //alert(`Failed to delete employee with ID ${delId}`)
      }
    } catch (error) {
      toast.error(error.message);
      //alert(error.message)
    }
  };

  const getCampReportInfoWithId = async (crid) => {
    try {
      const res = await axios.post(`${BASEURL}/report/getReportInfoWithId`, {
        crId: crid,
      });
      console.log("inside info........", res);
      if (res?.status === 200) {
        setInfoData(res?.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCampReportImages = async (crid) => {
    try {
      const res = await axios.post(`${BASEURL}/report/getImages`, {
        crId: crid,
      });
      if (res?.status === 200) {
        console.log("inside get images", res);
        setCampImages(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  for showing dashboard list
  const getCampReportList = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/report/getAllCampReport?searchName=${searchQuery}`,
        { campTypeId: listCampType, userId: userId }
      );

      if (res?.data?.errorCode == "1") {
        setCampReportList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampReportList();
  }, [listCampType, searchQuery]);

  // for get camp type

  const getCampList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getCampType`);
      setCampList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRepresentativeList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getRepresentative`);
      setRepresentativeList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getDoctor`);
      setDoctorList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPathlabList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getPathLab`);
      setPathlabList(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBrandList = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getBrandName`);
      console.log("inside brand list", res);
      setBrandList(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get camp request List

  //  for showing dashboard list
  const getCampRequestList = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/campRequest/getApprovedCampRequest`,
        { userId: userId }
      );

      console.log("inside camp request list ", res);
      if (res?.data?.errorCode == "1") {
        setCampRequestList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampList();
    getRepresentativeList();
    getDoctor();
    getPathlabList();
    getBrandList();
    getCampRequestList();
  }, []);

  // for search

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // for adding data

  // const handleAddSubmit = async() => {

  //  // event.preventDefault();

  //   if(!campType || !repId || !doctorId || !pathlab
  //     || !campVenue || !campDate || !campTime || !screenedCount ||
  //     !prescriptionCount || !diagnosedCount ||selectedBrands.length === 0){
  //           toast.error("Missing Required Field");
  //           return;
  //     }
  //     const myStr = selectedBrands?.map(item => item.value).join(',');
  //     try {
  //        const res = await axios.post(`${BASEURL}/report/addReportWithInfo`,{
  //         campTypeId:campType,
  //         repId:repId,
  //         docId:doctorId,
  //         pathLabId:pathlab,
  //         campVenue:campVenue,
  //         campDate:campDate,
  //         campTime:campTime,
  //         screenedCount:screenedCount,
  //         diagnosedCount:diagnosedCount,
  //         prescriptionCount:prescriptionCount,
  //         brandId:myStr,
  //         feedback:feedback,
  //         userId:userId

  //        })

  //        console.log("responce",res);

  //        if(res?.data?.errorCode == "1"){
  //         setCurrentIndex(2)
  //         toast.success("Camp Report Added Successfully")
  //         //setAddRequestModel(false);
  //         //await getCampRequestList();
  //         setCrid(res?.data?.crid);
  //         setCampType('');
  //         setRepId('');
  //         setDoctorId('');
  //         setPathlab('');
  //         setCampVenue('');
  //         setCampDate('');
  //         setCampTime('');
  //         setScreenedCount('');
  //         setDiagnosedCount('');
  //         setPrescriptionCount('');
  //         setSelectedBrands([]);
  //         setFeedback('')

  //        }
  //     } catch (error) {
  //      console.log(error)
  //     }

  // }

  // const handleAddSubmit = async() => {

  //   if( !campReqId || !screenedCount || !prescriptionCount || !diagnosedCount ||selectedBrands.length === 0){
  //     console.log("responce",campReqId);
  //     //toast.error("Missing Required Field");
  //     alert("Missing Required Field");
  //     return;
  //     }

  //     const myStr = selectedBrands?.map(item => item.value).join(',');
  //     try {
  //        const res = await axios.post(`${BASEURL}/report/addReportWithInfo`,{

  //         campTypeId:campType,
  //         repId:repId,
  //         docId:doctorId,
  //         pathLabId:pathlab,
  //         campVenue:campVenue,
  //         campDate:campDate,
  //         campTime:campTime,
  //         screenedCount:screenedCount,
  //         diagnosedCount:diagnosedCount,
  //         prescriptionCount:prescriptionCount,
  //         brandId:myStr,
  //         feedback:feedback,
  //         userId:userId,
  //         campReqId:campReqId
  //        })

  //        console.log("responce",res);

  //        if(res?.data?.errorCode == "1"){
  //         //setCurrentIndex(2)
  //         //toast.success("Camp Report Added Successfully")
  //         alert("Camp Report Added Successfully")
  //         //setAddRequestModel(false);
  //         await getCampRequestList();
  //         setCrid(res?.data?.crid);
  //         setScreenedCount('');
  //         setDiagnosedCount('');
  //         setPrescriptionCount('');
  //         setSelectedBrands([]);
  //         setFeedback('')
  //         setCampReqId('');
  //         setCampRequstData('');

  //        }
  //     } catch (error) {
  //      console.log(error)
  //     }

  // }

  const handleAddSubmit = async () => {
    // Validate required fields
    if (
      !campReqId ||
      !screenedCount ||
      !prescriptionCount ||
      !diagnosedCount ||
      selectedBrands.length === 0
    ) {
      toast.error("Missing Required Field");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      //alert('No Image files selected')
      return;
    }

    const myStr = selectedBrands?.map((item) => item.value).join(",");

    try {
      // First API call: Submit the report
      const reportResponse = await axios.post(
        `${BASEURL}/report/addReportWithInfo`,
        {
          campTypeId: campType,
          repId: repId,
          docId: doctorId,
          pathLabId: pathlab,
          campVenue: campVenue,
          campDate: campDate,
          campTime: campTime,
          screenedCount: screenedCount,
          diagnosedCount: diagnosedCount,
          prescriptionCount: prescriptionCount,
          brandId: myStr,
          feedback: feedback,
          userId: userId,
          campReqId: campReqId,
        }
      );

      console.log("Report response", reportResponse);

      if (reportResponse?.data?.errorCode === "1") {
        // Report submission successful
        // alert("Camp Report Added Successfully");
        //await getCampRequestList();
        setCrid(reportResponse?.data?.crid);
        setScreenedCount("");
        setDiagnosedCount("");
        setPrescriptionCount("");
        setSelectedBrands([]);
        setFeedback("");
        setCampReqId("");
        setCampRequstData("");

        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        // Add any additional data required by your backend API
        formData.append("crId", reportResponse.data.crid);
        formData.append("userId", userId);

        try {
          // Second API call: Upload images
          const imageUploadResponse = await axios.post(
            `${BASEURL}/report/uploadImages`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageUploadResponse.status === 200) {
            toast.success("Camp Report Added Successfully");
            await getCampReportList();
            setSelectedFiles([]);
            setPreviewUrls([]);
          } else {
            toast.error("Failed to upload images");
          }
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error("Error uploading images");
        }
      } else {
        toast.error("Error in submitting the report");
      }
    } catch (error) {
      console.error("Error submitting the report:", error);
      toast.error("Error submitting the report");
    } finally {
      setAddRequestModel(false);
      setCurrentIndex(1);
    }
  };

  // const handleImageUpload = async () => {
  //   if (selectedFiles.length === 0) {
  //     //toast.error('No files selected');
  //     alert('No Image files selected')
  //     return;
  //   }

  //   const formData = new FormData();
  //   selectedFiles.forEach((file) => {
  //     formData.append('images', file);
  //   });

  //   // Add any additional data required by your backend API
  //   formData.append('crId', crid);
  //   formData.append('userId', userId);

  //   try {
  //     const res = await axios.post(`${BASEURL}/report/uploadImages`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (res.status === 200) {
  //       //toast.success('Images uploaded successfully');
  //       alert("Image Uploaded")
  //       await getCampReportList();
  //       setSelectedFiles([]);
  //       setPreviewUrls([]);
  //     } else {
  //      // toast.error('Failed to upload images');
  //      alert("Error in image upload")
  //     }
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     //toast.error('Error uploading images');
  //   }
  //   finally{
  //     setAddRequestModel(false);
  //     setCurrentIndex(1)
  //   }
  // };

  const handleEdit = async (campReportId) => {
    setEditId(campReportId);

    try {
      // Make an API call to fetch the details of the camp request
      const response = await axios.post(
        `${BASEURL}/report/getReportInfoWithId`,
        {
          crId: campReportId,
        }
      );

      if (response.status === 200) {
        const requestData = response.data[0]; // Assuming the data is returned as an array

        console.log("inside handel edit", response);
        // Set the state with the fetched data
        //setCampType(requestData.camp_id);
        //setRepId(requestData.rep_id);
        //setDoctorId(requestData.cdoc_id);
        //setPathlab(requestData.pathlab_id);
        //setCampVenue(requestData.camp_venue);
        // setCampDate(requestData.camp_date1);
        // setCampTime(requestData.camp_time);
        setScreenedCount(requestData.screened_count);
        setDiagnosedCount(requestData.diagnosed_count);
        setPrescriptionCount(requestData.prescription_count);
        setBrandId(requestData.brand_id);
        setFeedback(requestData.feedback);
        await getCampReportImages(campReportId);

        // Open the edit modal
        setEditRequestModel(true);
      } else {
        // Handle the case where no data is returned or an error occurred
        toast.error("Failed to fetch details for the camp report.");
        //alert("Failed to fetch details for the camp report.")
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Failed to fetch camp report details:", error);
      //toast.error("Error fetching camp report details.");
    }
  };

  useEffect(() => {
    // Convert comma-separated string to an array of selected options
    if (brandId) {
      const selectedValues = brandId.split(",").map(Number);
      const selectedOptions = brandList
        .filter((brand) => selectedValues.includes(brand.basic_id))
        .map((brand) => ({ value: brand.basic_id, label: brand.description }));
      setSelectedBrands(selectedOptions);
    } else {
      setSelectedBrands([]);
    }
  }, [brandId]);

  const handleEditSubmit = async () => {
    if (
      !screenedCount ||
      !prescriptionCount ||
      !diagnosedCount ||
      selectedBrands.length === 0
    ) {
      toast.error("Missing Required Field");
      //alert("Missing Required Field");
      return;
    }
    if (selectedFiles.length + campImages.length === 0) {
      toast.error("No files selected");
      //alert("No Selected File")
      return;
    }

    // get camp images
    //await getCampReportImages(editId);
    const myStr = selectedBrands?.map((item) => item.value).join(",");

    try {
      const res = await axios.post(`${BASEURL}/report/updateReportWithInfo`, {
        screenedCount: screenedCount,
        diagnosedCount: diagnosedCount,
        prescriptionCount: prescriptionCount,
        brandId: myStr,
        feedback: feedback,
        userId: userId,
        crId: editId,
      });

      // console.log("inside edit submit",res)

      if (res?.data?.errorCode == "1") {
        toast.success("Camp Report Updated Successfully");
        //setEditRequestModel(false);
        //await getCampReportList();
        //setCurrentIndex(2)
        //setCampType('');
        //setRepId('');
        //setDoctorId('');
        //setPathlab('');
        //setCampVenue('');
        //setCampDate('');
        //setCampTime('');
        setScreenedCount("");
        setDiagnosedCount("");
        setPrescriptionCount("");
        setBrandId("");
        setSelectedBrands([]);
        setFeedback("");

        if (selectedFiles && selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("images", file);
          });

          // Add any additional data required by your backend API
          formData.append("crId", editId);
          formData.append("userId", userId);

          try {
            // Second API call: Upload images
            const imageUploadResponse = await axios.post(
              `${BASEURL}/report/uploadImages`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (imageUploadResponse.status === 200) {
              //toast.success("Camp Report Updated successfully");
              await getCampReportList();
              setSelectedFiles([]);
              setPreviewUrls([]);
            } else {
              toast.error("Failed to upload images");
            }
          } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Error uploading images");
          }
        }
      }
    } catch (error) {
      toast.error("Server error in updating report");
    } finally {
      setEditRequestModel(false);
    }
  };

  // const handleEditImageUpload = async () => {
  //   console.log("indie image upload edit id",editId)
  //   if (selectedFiles.length+campImages.length === 0) {
  //     toast.error('No files selected');
  //     return;
  //   }

  //   const formData = new FormData();
  //   selectedFiles.forEach((file) => {
  //     formData.append('images', file);
  //   });

  //   // Add any additional data required by your backend API
  //   formData.append('crId', editId);
  //   formData.append('userId', userId);

  //   try {
  //     const res = await axios.post(`${BASEURL}/report/uploadImages`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (res.status === 200) {
  //       toast.success('Images uploaded successfully');
  //       await getCampReportList();
  //       setSelectedFiles([]);
  //       setPreviewUrls([]);
  //     } else {
  //       toast.error('Failed to upload images');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     toast.error('Error uploading images');
  //   }
  //   finally{
  //     setEditRequestModel(false);
  //     setCurrentIndex(1)
  //   }
  // };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    //const files = event.target.files;
    if (files.length + selectedFiles.length > 3) {
      toast.error("You can only upload up to 3 images");
      //alert('You can only upload up to 3 images')
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleEditFileChange = (event) => {
    const files = Array.from(event.target.files);
    //const files = event.target.files;
    if (files.length + selectedFiles.length + campImages.length > 3) {
      toast.error("You can only upload up to 3 images");
      //alert('You can only upload up to 3 images');
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newSelectedFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handelDeleteCampImage = async (imgid) => {
    try {
      const res = await axios.post(`${BASEURL}/report/deleteSingalImg`, {
        crimgid: imgid,
      });
      if (res?.data?.errorCode == "1") {
        //toast.success("Image Deleted")
        //alert('Image Deleted')
        await getCampReportImages(editId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBrandChange = (selectedOptions) => {
    setSelectedBrands(selectedOptions);
  };

  const brandOptions = brandList?.map((brand) => ({
    value: brand.basic_id,
    label: brand.description,
  }));

  // for select camp request

  const handelCampRequestChange = (event) => {
    if (!event.target.value) {
      //console.log("insid empty here")
      setCampRequstData("");
      setCampReqId("");
      setCampReqId("");
      setCampType("");
      setRepId("");
      setDoctorId("");
      setPathlab("");
      setCampVenue("");
      setCampDate("");
      setCampTime("");
      setCampPatients("");
      setDoctorQualification("");
    }

    const requestData = campRequestList.find(
      (camp) => camp.camp_req_id == event.target.value
    );
    console.log("reqdata", requestData);
    if (requestData) {
      //setCampRequstData(requestData);
      setCampReqId(requestData.camp_req_id);
      setCampType(requestData.camp_id);
      setRepId(requestData.rep_id);
      setDoctorId(requestData.cdoc_id);
      setPathlab(requestData.pathlab_id);
      setCampVenue(requestData.camp_venue);
      setCampDate(requestData.camp_date2);
      setCampTime(requestData.camp_time);
      setCampPatients(requestData.no_of_patients);
      setDoctorQualification(requestData.doctor_qualification);
    }
  };
  const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(campReportList.length / 5) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };

  return (
    <>
      <main id="main" className="main">
        {/* <div className="pagetitle">
          <h1>Report for Camp</h1>
        </div> */}

        <section className="section dashboard">
          <div className="row">
            <div className="d-sm-flex align-items-center justify-content-end mb-4">
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group mt-4">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search."
                    aria-label="Search."
                    aria-describedby="basic-addon2"
                    onChange={handleSearchChange}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </form>
              <div className="dropdown ml-3 mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control selectStyle"
                  onChange={(e) => {
                    setListCampType(e.target.value);
                  }}
                  value={listCampType}
                >
                  <option value="">Select Type of Camp</option>
                  {campList.map((e) => (
                    <option key={e.camp_id} value={e.camp_id}>
                      {e.camp_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="m-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handelAddReport}
                    >
                      <i className="bx bx-plus"></i> Add Report
                    </button>
                  </div>
                  <hr />
                  <div className="tbst">
                    <table className="table table-hover newcss">
                      <thead>
                        <tr>
                          <th scope="col">Doctor Name</th>
                          <th scope="col">Rep Name</th>
                          <th scope="col">Pathlab Name</th>
                          <th scope="col">Camp Date</th>
                          <th scope="col">Camp Venue</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campReportList &&
                          campReportList.length > 0 &&
                          campReportList
                            .slice(page * 5 - 5, page * 5)
                            .map((e) => (
                              <tr key={e.crid}>
                                <td>{e.doctor_name}</td>
                                <td>{e.rep_name}</td>
                                <td>{e.pathlab_name}</td>
                                <td>{e.camp_date}</td>
                                <td>{e.camp_venue}</td>
                                <td>
                                  <button
                                    className="btn btn-info btn-circle rounded-pill"
                                    title="Info"
                                    onClick={() => handelInfo(e.crid)}
                                  >
                                    <i className="ri-information-2-line"></i>
                                  </button>
                                  <button
                                    className="btn btn-dark rounded-pill ml-1"
                                    title="Edit"
                                    onClick={() => handleEdit(e.crid)}
                                  >
                                    <i className="ri-edit-2-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger rounded-pill ml-1"
                                    title="Delete"
                                    onClick={() => handelDelete(e.crid)}
                                  >
                                    <i className="ri-delete-bin-2-fill"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  {campReportList && campReportList.length > 0 && (
                    <div>
                      <div className="m-2 float-end">
                        {/* <h5 className="card-title">Pagination with icon</h5> */}

                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li
                              className="page-item"
                              onClick={() => selectPageHandler(page - 1)}
                            >
                              <span className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </span>
                            </li>
                            {[
                              ...Array(Math.ceil(campReportList.length / 5)),
                            ].map((_, i) => {
                              return (
                                <li
                                  className="page-item"
                                  onClick={() => selectPageHandler(i + 1)}
                                  key={i}
                                >
                                  <span
                                    className={`page-link ${
                                      page === i + 1 ? "show" : ""
                                    }`}
                                  >
                                    {i + 1}
                                  </span>
                                </li>
                              );
                            })}
                            {/* <li className="page-item" onClick={()=>selectPageHandler(i+1)} key={i}><span className="page-link" >{i+1}</span></li> */}
                            <li
                              className="page-item"
                              onClick={() => selectPageHandler(page + 1)}
                            >
                              <span className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                              </span>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {infoReportModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Report Info</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseInfoModel}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3">
                    <div className="col-md-4">
                      <label className="form-group form-label">
                        Type of Camp
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Camp Type"
                        value={infoData && infoData.camp_name}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Name of Pathlab</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Pathlab Name"
                        value={infoData && infoData.pathlab_name}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Name of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Representative Name"
                        value={infoData && infoData.rep_name}
                        readOnly
                      />
                    </div>
                    {/* <div className="col-md-4">
                      <label className="form-label">Contact No Of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact No"
                        value={infoData && infoData.rep_contact}
                        readOnly
                      />
                    </div> */}
                    {/* <div className="col-md-4">
                      <label className="form-label">Email Id of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        value={infoData && infoData.rep_email}
                        readOnly
                      />
                    </div> */}

                    {/* <div className="col-md-4">
                      <label className="form-label">Zone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zone"
                        value={infoData && infoData.zone}
                        readOnly
                      />
                    </div> */}
                    {/* <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        value={infoData && infoData.state}
                        readOnly
                      />
                    </div> */}
                    {/* <div className="col-md-4">
                      <label className="form-label">Hq</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Hq"
                        value={infoData && infoData.hq}
                        readOnly
                      />
                    </div> */}

                    <div className="col-md-4">
                      <label className="form-label">Name of Doctor</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Doctor Name"
                        value={infoData && infoData.doctor_name}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Degree of Doctor</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Doctor Degree"
                        value={infoData && infoData.doctor_qualification}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Date of Camp</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Camp Date"
                        value={infoData && infoData.camp_date}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Time of Camp</label>
                      <input
                        type="time"
                        className="form-control"
                        placeholder="Camp Time"
                        value={infoData && infoData.camp_time}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Camp Venue</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Camp Venue"
                        value={infoData && infoData.camp_venue}
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Brand Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brand Name"
                        value={infoData && infoData.description}
                        readOnly
                      />
                    </div>

                    {/* <div className="col-md-4">
                      <label className="form-label">Contact No of ABM</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact No"
                        value={infoData && infoData.abm_contact}
                        readOnly
                      />
                    </div> */}
                    <div className="form-group col-md-4">
                      <label className="form-label">Patients Screened</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Screened No."
                        value={infoData && infoData.screened_count}
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Patients Diagnosed</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Diagnosed No."
                        value={infoData && infoData.diagnosed_count}
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">
                        Prescription Generated
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Prescription No."
                        value={infoData && infoData.prescription_count}
                        readOnly
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Feedback</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact No"
                        value={infoData && infoData.feedback}
                        readOnly
                      />
                    </div>
                    <div>Camp Images</div>

                    <div className="form-row flex">
                      {campImages &&
                        campImages.length > 0 &&
                        campImages.map((img) => (
                          <img
                            key={img.crimgid}
                            className="campimage"
                            crossOrigin="anonymous"
                            src={`${BASEURL}/uploads/report/${img.imgpath}`}
                          ></img>
                        ))}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {addRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Report</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseModel}
                  ></button>
                </div>
                <div className="modal-body">
                  {currentIndex === 1 ? (
                    <form className="row g-3">
                      <div className="form-group col-md-4">
                        <label className="form-label">
                          Select Camp Request
                        </label>
                        <select
                          className="form-control"
                          onChange={handelCampRequestChange}
                          value={campReqId}
                        >
                          <option value="">Select...</option>
                          {campRequestList.map((e) => (
                            <option key={e.camp_req_id} value={e.camp_req_id}>
                              {e.camp_date1}-{e.camp_venue}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label className="form-label">Type of Camp</label>
                        <select
                          className="form-control"
                          onChange={(event) => {
                            //setCampName(event.target.options[event.target.selectedIndex].getAttribute('data-campname'));
                            setCampType(event.target.value);
                          }}
                          value={campType}
                          disabled
                        >
                          <option value="">Select...</option>
                          {campList.map((e) => (
                            <option
                              data-campname={e.camp_name}
                              key={e.camp_id}
                              value={e.camp_id}
                            >
                              {e.camp_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">Name of Pathlab</label>
                        <select
                          className="form-control"
                          onChange={(e) => {
                            setPathlab(e.target.value);
                          }}
                          //onChange={handelPathlabChange}
                          disabled
                          value={pathlab}
                        >
                          <option value="">Select...</option>
                          {pathlabList.map((e) => (
                            <option key={e.pathlab_id} value={e.pathlab_id}>
                              {e.pathlab_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label className="form-label">Name of Rep</label>
                        <select
                          className="form-control"
                          onChange={(e) => {
                            setRepId(e.target.value);
                          }}
                          disabled
                          value={repId}
                        >
                          <option value="">Select...</option>
                          {representativeList.map((e) => (
                            <option key={e.rep_id} value={e.rep_id}>
                              {e.rep_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* <div className="form-group col-md-4">
                      <label className="form-label">Contact No Of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        
                        placeholder="contact"
                        value={repMobile}
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Email Id of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        
                        placeholder="email"
                        value={repEmail}
                        readOnly
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Zone</label>
                      <input
                        type="text"
                        className="form-control"
                       
                        placeholder="zone"
                        onChange={(e)=>{
                          setRepZone(e.target.value)
                         }}
                        value={repZone}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        
                        placeholder="state"
                        onChange={(e)=>{
                          setRepState(e.target.value)
                         }}
                        value={repState}
                      />
                    </div> */}
                      {/* <div className="form-group col-md-4">
                      <label className="form-label">Hq</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e)=>{
                          setRepHq(e.target.value)
                         }}
                        placeholder="Hq"
                        value={repHq}
                      />
                    </div> */}
                      <div className="form-group col-md-4">
                        <label className="form-label">Name of Doctor</label>
                        <select
                          className="form-control"
                          onChange={(e) => {
                            setDoctorId(e.target.value);
                          }}
                          disabled
                          value={doctorId}
                        >
                          <option value="">Select...</option>
                          {doctorList.map((e) => (
                            <option key={e.cdoc_id} value={e.cdoc_id}>
                              {e.doctor_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">Degree of Doctor</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Doctor Degree"
                          value={doctorQualification}
                          readOnly
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">Date of Camp</label>
                        <input
                          type="date"
                          className="form-control"
                          onChange={(e) => {
                            setCampDate(e.target.value);
                          }}
                          placeholder="Camp Date"
                          value={campDate}
                          disabled
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label className="form-label">Time of Camp</label>
                        <input
                          type="time"
                          className="form-control"
                          onChange={(e) => {
                            setCampTime(e.target.value);
                          }}
                          placeholder="Camp Time"
                          value={campTime}
                          disabled
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label className="form-label">Camp Venue</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => {
                            setCampVenue(e.target.value);
                          }}
                          placeholder="Camp Venue"
                          value={campVenue}
                          disabled
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label className="form-label">
                          No. of Patients Expected
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            setCampPatients(e.target.value);
                          }}
                          placeholder="Patients No."
                          value={campPatients}
                          disabled
                        />
                      </div>

                      {/* <div className="form-group col-md-4">
                      <label className="form-label">Contact No of ABM</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contact No."
                        onChange={(e)=>{
                          setAbmContact(e.target.value)
                        }}
                        value={abmContact}
                      />
                    </div> */}
                    </form>
                  ) : (
                    <form className="row g-3">
                      <div className="form-group col-md-4">
                        <label className="form-label">
                          No. of Patients Screened
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            setScreenedCount(e.target.value);
                          }}
                          placeholder="Patients Screened No."
                          value={screenedCount}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">
                          No. of Patients Diagnosed
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            setDiagnosedCount(e.target.value);
                          }}
                          placeholder="Patients Diagnosed No."
                          value={diagnosedCount}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">
                          No. of Prescription Generated
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            setPrescriptionCount(e.target.value);
                          }}
                          placeholder="Prescription Generated No."
                          value={prescriptionCount}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">Brand Name</label>
                        <Select
                          isMulti
                          options={brandOptions}
                          value={selectedBrands}
                          onChange={handleBrandChange}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select Brands..."
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: 140, // Adjust this value to your desired height
                              overflowY: "auto", // Enable vertical scrolling
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: 140, // Ensure the inner menu list is also constrained
                            }),
                          }}
                          menuPosition="fixed" // Fix the menu position
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">Feedback</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => {
                            setFeedback(e.target.value);
                          }}
                          placeholder="Feedback"
                          value={feedback}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label className="form-label">
                          {" "}
                          Upload Camp Images
                        </label>{" "}
                        <br />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          disabled={selectedFiles.length >= 3}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {previewUrls.map((url, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={url}
                              alt="Preview"
                              style={{ width: "100px", height: "130px" }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                background: "#07070742",
                                color: "white",
                                border: "none",
                                padding: "0px 4px",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </form>
                  )}

                  {currentIndex === 1 ? (
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-success mx-auto mt-2"
                        onClick={handleGoNext}
                      >
                        Next
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  {currentIndex === 2 ? (
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-success mx-auto mt-1"
                        onClick={handlePrevious}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-success mx-auto ml-1 mt-1"
                        //onClick={handleImageUpload}
                        onClick={handleAddSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editRequestModel && (
        <div className="addusermodel">
          <div
            className="modal fade show"
            style={{ display: "block" }}
            //id="ExtralargeModal"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseEditModel}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3">
                    <div className="form-group col-md-4">
                      <label className="form-label">
                        No. of Patients Screened
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => {
                          setScreenedCount(e.target.value);
                        }}
                        placeholder="Patients Screened No."
                        value={screenedCount}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">
                        No. of Patients Diagnosed
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => {
                          setDiagnosedCount(e.target.value);
                        }}
                        placeholder="Patients Diagnosed No."
                        value={diagnosedCount}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">
                        No. of Prescription Generated
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => {
                          setPrescriptionCount(e.target.value);
                        }}
                        placeholder="Prescription Generated No."
                        value={prescriptionCount}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Brand Name</label>
                      <Select
                        isMulti
                        options={brandOptions}
                        value={selectedBrands}
                        onChange={handleBrandChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select Brands..."
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: 140, // Adjust this value to your desired height
                            overflowY: "auto", // Enable vertical scrolling
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 140, // Ensure the inner menu list is also constrained
                          }),
                        }}
                        menuPosition="fixed" // Fix the menu position
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Feedback</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                        placeholder="Feedback"
                        value={feedback}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label"> Upload Camp Images</label>
                      <br />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditFileChange}
                        disabled={selectedFiles.length + campImages.length >= 3}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {campImages &&
                        campImages.length > 0 &&
                        campImages.map((img) => (
                          <div
                            key={img.crimgid}
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              crossOrigin="anonymous"
                              src={`${BASEURL}/uploads/report/${img.imgpath}`}
                              alt="Report Image"
                              style={{ width: "100px", height: "130px" }}
                            />
                            <button
                              type="button"
                              onClick={() => handelDeleteCampImage(img.crimgid)}
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                background: "#07070742",
                                color: "white",
                                border: "none",
                                padding: "0px 4px",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}

                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={url}
                            alt="Preview"
                            style={{ width: "100px", height: "130px" }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              background: "#07070742",
                              color: "white",
                              border: "none",
                              padding: "0px 4px",
                              cursor: "pointer",
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </form>
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-success mx-auto mt-1"
                      //onClick={handleImageUpload}
                      onClick={handleEditSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to Delete Camp Request?"
          onConfirm={handleConfirmDelete}
          onCancel={handelCancelDelete}
        />
      )}
    </>
  );
};

export default Report;
