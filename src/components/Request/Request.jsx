import React, { useState, useEffect } from "react";
import ConfirmationPopup from "../popup/Popup";
//import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import * as XLSX from "xlsx/xlsx.mjs";
import axios from "axios";
import "../Dashboard/Dashboard.css";
import { BASEURL } from "../constant/constant";
import toast from "react-hot-toast";
const Request = () => {
  const userId = sessionStorage.getItem("userId");
  // data for select tag
  const [isLoading, setIsLoading] = useState(false);
  const [campList, setCampList] = useState([]);
  const [representativeList, setRepresentativeList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [pathlabList, setPathlabList] = useState([]);
  const [marketingHeadList, setMarketingHeadList] = useState([]);
  const [marketingHeadEmail, setMarketingHeadEamil] = useState("");
  const [marketingHeadId, setMarketingHeadId] = useState("");

  const [campType, setCampType] = useState("");
  const [campName, setCampName] = useState("");
  const [repId, setRepId] = useState("");
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repMobile, setRepMobile] = useState("");
  const [repHq, setRepHq] = useState("");
  const [repZone, setRepZone] = useState("");
  const [repState, setRepState] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorQualification, setDoctorQualification] = useState("");
  const [pathlab, setPathlab] = useState("");
  const [pathlabName, setPathlabName] = useState("");
  const [pathlabEmail, setPathlabEmail] = useState("");

  const [campVenue, setCampVenue] = useState("");
  const [campDate, setCampDate] = useState("");
  const [campTime, setCampTime] = useState("");
  const [campPatients, setCampPatients] = useState("");
  const [abmContact, setAbmContact] = useState("");

  const [listCampType, setListCampType] = useState("");
  const [campRequestList, setCampRequestList] = useState([]);
  const [campRequestList1, setCampRequestList1] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [addRequestModel, setAddRequestModel] = useState(false);
  const [infoRequestModel, setInfoRequestModel] = useState(false);
  const [editRequestModel, setEditRequestModel] = useState(false);

  const [infoData, setInfoData] = useState({});

  // for delete

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [delId, setDelId] = useState("");
  const [editId, setEditId] = useState("");

  const [requestStatus, setRequestStatus] = useState("");

  // for filter result

  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handelAddRequest = () => {
    setAddRequestModel(true);
  };
  const handelCloseModel = () => {
    setAddRequestModel(false);
  };
  const handelCloseEditModel = () => {
    setEditRequestModel(false);
    setCampType("");
    setCampName("");
    setRepId("");
    setRepName("");
    setRepMobile("");
    setRepEmail("");
    setDoctorId("");
    setDoctorName("");
    setDoctorQualification("");
    setPathlab("");
    setPathlabName("");
    setPathlabEmail("");
    setCampVenue("");
    setCampDate("");
    setCampTime("");
    setCampPatients("");
    setRepZone("");
    setRepHq("");
    setRepState("");
    setAbmContact("");
    setMarketingHeadEamil("");
  };

  const handelInfo = async (campRequestId) => {
    await getCampRequestInfoWithId(campRequestId);
    setInfoRequestModel(true);
  };
  const handelCloseInfoModel = () => {
    setInfoRequestModel(false);
    setInfoData({});
  };

  const handelDelete = (campRequestId) => {
    setShowDeleteConfirmation(true);
    setDelId(campRequestId);
  };
  const handelCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDelId("");
  };

  const handleEdit = async (campRequestId) => {
    setEditId(campRequestId);
    try {
      // Make an API call to fetch the details of the camp request
      const response = await axios.post(
        `${BASEURL}/campRequest/getCampRequestDetails`,
        {
          campReqId: campRequestId,
        }
      );

      if (response.data && response.data.errorCode == "1") {
        const requestData = response.data.data[0]; // Assuming the data is returned as an array

        console.log("request data", requestData);
        // Set the state with the fetched data
        setCampType(requestData.camp_id);
        setCampName(requestData.camp_name);
        setRepId(requestData.rep_id);
        setRepName(requestData.rep_name);
        setRepEmail(requestData.rep_email);
        setRepMobile(requestData.rep_contact);
        setAbmContact(requestData.abm_contact);
        setDoctorId(requestData.cdoc_id);
        setDoctorName(requestData.doctor_name);
        setDoctorQualification(requestData.doctor_qualification);
        setPathlab(requestData.pathlab_id);
        setPathlabName(requestData.pathlab_name);
        setPathlabEmail(requestData.pathlab_email);
        setCampVenue(requestData.camp_venue);
        setCampDate(requestData.camp_date1);
        setCampTime(requestData.camp_time);
        setCampPatients(requestData.no_of_patients);
        setRepZone(requestData.zone);
        setRepHq(requestData.state);
        setRepState(requestData.hq);
        setMarketingHeadId(requestData.mhid);
        setMarketingHeadEamil(requestData.email);
        // Open the edit modal
        setEditRequestModel(true);
      } else {
        // Handle the case where no data is returned or an error occurred
        toast.error("Failed to fetch details for the camp request.");
        //alert("Failed to fetch details for the camp request.");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Failed to fetch camp request details:", error);
      toast.error("Error fetching camp request details.");
      //alert("Error fetching camp request details.");
    }
  };

  const handleConfirmDelete = async () => {
    console.log("inside delete functin ");
    setShowDeleteConfirmation(false);
    try {
      const res = await axios.post(`${BASEURL}/campRequest/deleteCampRequest`, {
        campReqId: delId,
      });

      console.log("inside delete", res);
      if (res.data.errorCode == "1") {
        toast.success("Camp Request Deleted Successfully");
        //alert("Camp Request Deleted Successfully");

        await getCampRequestList();
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

  const getCampRequestInfoWithId = async (campReqId) => {
    try {
      const res = await axios.post(
        `${BASEURL}/campRequest/getCampRequestDetails`,
        { campReqId: campReqId }
      );
      if (res?.data?.errorCode == "1") {
        setInfoData(res?.data?.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  for showing dashboard list
  const getCampRequestList = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/campRequest/getCampRequest?searchName=${searchQuery}`,
        {
          campTypeId: listCampType,
          userId: userId,
          startDate,
          endDate,
          filterBy,
        }
      );

      if (res?.data?.errorCode == "1") {
        setCampRequestList(res?.data?.data);
        setCampRequestList1(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampRequestList();
  }, [listCampType, searchQuery, filterBy, startDate, endDate]);

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

  const getMarketingHead = async () => {
    try {
      const res = await axios.get(`${BASEURL}/report/getMarketingHead`);
      setMarketingHeadList(res?.data?.data);
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

  // for selecting pathlab

  const handelPathlabChange = (event) => {
    if (!event.target.value) {
      setPathlab("");
      setPathlabName("");
      setPathlabEmail("");
      return;
    }

    const selectedPathlab = pathlabList.find(
      (e) => e.pathlab_id == event.target.value
    );

    if (selectedPathlab) {
      setPathlab(selectedPathlab.pathlab_id);
      setPathlabName(selectedPathlab.pathlab_name);
      setPathlabEmail(selectedPathlab.pathlab_email);
    }
  };

  // for selecting doctor data

  const handelDoctorChange = (event) => {
    if (!event.target.value) {
      setDoctorId("");
      setDoctorQualification("");
      return;
    }
    const selectedDoctor = doctorList.find(
      (e) => e.cdoc_id == event.target.value
    );
    console.log(selectedDoctor);
    if (selectedDoctor) {
      setDoctorId(selectedDoctor.cdoc_id);
      setDoctorQualification(selectedDoctor.doctor_qualification);
      setDoctorName(selectedDoctor.doctor_name);
    }
  };

  const handelRepresentativeChange = (event) => {
    if (!event.target.value) {
      setRepId("");
      setRepEmail("");
      setRepMobile("");
      setRepHq("");
      setRepState("");
      setRepZone("");
      setRepName("");
      return;
    }
    const selectedRepresentative = representativeList.find(
      (e) => e.rep_id == event.target.value
    );
    console.log(selectedRepresentative);
    if (selectedRepresentative) {
      setRepId(selectedRepresentative.rep_id);
      setRepName(selectedRepresentative.rep_name);
      setRepEmail(selectedRepresentative.rep_email);
      setRepMobile(selectedRepresentative.rep_contact);
      setRepHq(selectedRepresentative.hq);
      setRepState(selectedRepresentative.state);
      setRepZone(selectedRepresentative.zone);
    }
  };

  useEffect(() => {
    getCampList();
    getRepresentativeList();
    getDoctor();
    getPathlabList();
    getMarketingHead();
  }, []);

  // for search

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // for adding data

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    //console.log("inside handel add submit")

    if (
      !campType ||
      !repId ||
      !doctorId ||
      !pathlab ||
      !campVenue ||
      !campDate ||
      !campTime ||
      !campPatients ||
      !abmContact ||
      !repZone ||
      !repHq ||
      !repState ||
      !marketingHeadEmail
    ) {
      toast.error("Missing Required Field");
      //alert("Missing Required Field");

      return;
    }
    // if(abmContact.length !== 10){
    //   toast.warn("Please Provide 10 Digit Mobile Number")
    // }
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASEURL}/campRequest/sendEmailForAdd`, {
        campTypeId: campType,
        campName: campName,
        repId: repId,
        repName: repName,
        repContact: repMobile,
        repEmail: repEmail,
        docId: doctorId,
        doctorName: doctorName,
        docDegree: doctorQualification,
        pathLabId: pathlab,
        pathLabName: pathlabName,
        pathLabEmail: pathlabEmail,
        campVenue: campVenue,
        campDate: campDate,
        campTime: campTime,
        patientsNo: campPatients,
        zone: repZone,
        state: repState,
        hq: repHq,
        abmContact: abmContact,
        marketingHeadEmail: marketingHeadEmail,
        marketingHeadId: marketingHeadId,
        userId: userId,
      });

      if (res?.data?.errorCode == "1") {
        toast.success("Camp Request Added Successfully");

        await getCampRequestList();
        setCampType("");
        setCampName("");
        setRepId("");
        setRepName("");
        setRepMobile("");
        setRepEmail("");
        setDoctorId("");
        setDoctorName("");
        setDoctorQualification("");
        setPathlab("");
        setPathlabName("");
        setPathlabEmail("");
        setCampVenue("");
        setCampDate("");
        setCampTime("");
        setCampPatients("");
        setRepZone("");
        setRepHq("");
        setRepState("");
        setAbmContact("");
        setMarketingHeadEamil("");
        setMarketingHeadId("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in creating camp request");
    } finally {
      setIsLoading(false);
      setAddRequestModel(false); // Stop loading
    }

    // console.log(campType, repId , doctorId, pathlab ,
    //   campVenue,campDate,campTime,campPatients,abmContact
    //   ,repZone,repHq,repState)
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (
      !campType ||
      !repId ||
      !doctorId ||
      !pathlab ||
      !campVenue ||
      !campDate ||
      !campTime ||
      !campPatients ||
      !abmContact ||
      !repZone ||
      !repHq ||
      !repState ||
      !marketingHeadEmail
    ) {
      toast.error("Missing Required Field");
      //alert("Missing Required Field")
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASEURL}/campRequest/sendEmailForUpdate`,
        {
          campTypeId: campType,
          campName: campName,
          repId: repId,
          repName: repName,
          repContact: repMobile,
          repEmail: repEmail,
          docId: doctorId,
          doctorName: doctorName,
          docDegree: doctorQualification,
          pathLabId: pathlab,
          pathLabName: pathlabName,
          pathLabEmail: pathlabEmail,
          campVenue: campVenue,
          campDate: campDate,
          campTime: campTime,
          patientsNo: campPatients,
          zone: repZone,
          state: repState,
          hq: repHq,
          abmContact: abmContact,
          marketingHeadEmail: marketingHeadEmail,
          marketingHeadId: marketingHeadId,
          userId: userId,
          campReqId: editId,
        }
      );

      if (res?.data?.errorCode == "1") {
        toast.success("Camp Request Updated Successfully");
        //alert("Camp Request Updated Successfully");
        setEditRequestModel(false);
        await getCampRequestList();
        setCampType("");
        setCampName("");
        setRepId("");
        setRepName("");
        setRepMobile("");
        setRepEmail("");
        setDoctorId("");
        setDoctorName("");
        setDoctorQualification("");
        setPathlab("");
        setPathlabName("");
        setPathlabEmail("");
        setCampVenue("");
        setCampDate("");
        setCampTime("");
        setCampPatients("");
        setRepZone("");
        setRepHq("");
        setRepState("");
        setAbmContact("");
        setMarketingHeadEamil("");
        setMarketingHeadId("");
      }
    } catch (error) {
      alert("Error In Updating Camp Request");
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handelRequestStatus = async (e) => {
    const reqStatus = e.target.value;
    //console.log("reqstatus",reqStatus);
    if (!reqStatus) {
      setRequestStatus(reqStatus);
      await getCampRequestList();
      return;
    }
    const selectedData = campRequestList1.filter(
      (e) => e.isApproved === reqStatus
    );
    console.log("selected data", selectedData);
    if (selectedData) {
      setCampRequestList(selectedData);
      setRequestStatus(reqStatus);
    }
  };

  const handleFilter = (e) => {
    setFilterBy(e.target.value);
  };

  // pagination logic

  const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(campRequestList.length / 5) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };

  const handelReportDownload = () => {
    // Define custom column headers
    console.log(campRequestList);
    const headers = [
      "Doctor Name",
      "PathLab Name",
      "Representative Name",
      "Camp Date",
      "Camp Venue",
    ];

    const mappedData = campRequestList.map((item) => ({
      "Doctor Name": item.doctor_name,
      "PathLab Name": item.pathlab_name,
      "Representative Name": item.rep_name,
      "Camp Date": item.camp_date,
      "Camp Venue": item.camp_venue,
    }));

    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const rn = Math.floor(Math.random() * 1000) + 1
    XLSX.writeFile(wb, `Lupin_AllRequest_${rn}.xlsx`);
  };

  return (
    <>
      <main id="main" className="main">
        {/* <div className="pagetitle">
          <h1>Request for Camp</h1>
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
              <div className="dropdown mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control selectStyle"
                  onChange={handleFilter}
                  value={filterBy}
                >
                  <option value="">Select filter</option>
                  <option value="month">Month Wise</option>
                  <option value="week">Week Wise</option>
                </select>
              </div>
              <div className="form-group ml-2" style={{ marginLeft: "1%" }}>
                <label htmlFor="fromDate">From Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  placeholder="Select From Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group ml-2" style={{ marginLeft: "1%" }}>
                <label htmlFor="toDate">To Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  placeholder="Select To Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="dropdown ml-3 mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control selectStyle"
                  onChange={handelRequestStatus}
                  value={requestStatus}
                >
                  <option value="">All Request Status</option>
                  <option value="N">Pending</option>
                  <option value="Y">Approved</option>
                  <option value="R">Rejected</option>
                </select>
              </div>

              <div className="dropdown ml-3 mt-4" style={{ marginLeft: "1%" }}>
                <select
                  className="form-control selectStyle"
                  onChange={(e) => {
                    setListCampType(e.target.value);
                  }}
                  value={listCampType}
                >
                  <option value="">All Camp</option>
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
                      className="btn btn-success mt-2"
                      onClick={handelAddRequest}
                    >
                      <i className="bx bx-plus"></i> New Request
                    </button>
                    <button
                      type="button"
                      className="btn btn-success ml-1 mt-2"
                      onClick={handelReportDownload}
                    >
                      <i className="bx bx-cloud-download"></i> Download Request
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
                          <th scope="col">Request Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campRequestList &&
                          campRequestList.length > 0 &&
                          campRequestList
                            .slice(page * 5 - 5, page * 5)
                            .map((e) => (
                              <tr key={e.camp_req_id}>
                                <td>{e.doctor_name}</td>
                                <td>{e.rep_name}</td>
                                <td>{e.pathlab_name}</td>
                                <td>{e.camp_date}</td>
                                <td>{e.camp_venue}</td>
                                <td>
                                  {e.isApproved == "N" ? (
                                    <span className="badge bg-warning">
                                      Pending
                                    </span>
                                  ) : e.isApproved == "Y" ? (
                                    <span className="badge bg-success">
                                      Approved
                                    </span>
                                  ) : (
                                    <span className="badge bg-danger">
                                      Rejected
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-info rounded-pill"
                                    title="Info"
                                    onClick={() => handelInfo(e.camp_req_id)}
                                  >
                                    <i className="ri-information-2-line"></i>
                                  </button>
                                  <button
                                    className="btn btn-dark rounded-pill ml-1"
                                    title="Edit"
                                    onClick={() => handleEdit(e.camp_req_id)}
                                  >
                                    <i className="ri-edit-2-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger rounded-pill ml-1"
                                    title="Delete"
                                    onClick={() => handelDelete(e.camp_req_id)}
                                  >
                                    <i className="ri-delete-bin-2-fill"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  {campRequestList && campRequestList.length > 0 && (
                    <div>
                      <div className="m-2 float-end">
                        {/* <h5 className="card-title">Pagination with icon</h5> */}

                        <nav aria-label="Page navigation example">
                          <ul className="pagination pcur">
                            <li
                              className="page-item"
                              onClick={() => selectPageHandler(page - 1)}
                            >
                              <span className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </span>
                            </li>
                            {[
                              ...Array(Math.ceil(campRequestList.length / 5)),
                            ].map((_, i) => {
                              return (
                                <li
                                  className="page-item"
                                  onClick={() => selectPageHandler(i + 1)}
                                  key={i}
                                >
                                  <span
                                    className={`page-link ${
                                      page === i + 1 ? "showpag" : ""
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

      {/* {infoRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Request Info</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseInfoModel}
                  ></button>
                </div>
                <div className="modal-body p-4">
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
                    <div className="col-md-4">
                      <label className="form-label">Contact No Of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact No"
                        value={infoData && infoData.rep_contact}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email Id of Rep</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        value={infoData && infoData.rep_email}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Zone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zone"
                        value={infoData && infoData.zone}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        value={infoData && infoData.state}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Hq</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Hq"
                        value={infoData && infoData.hq}
                        readOnly
                      />
                    </div>

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
                    <div className="col-md-4">
                      <label className="form-label">
                        No. of Patients Expected
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Patient No"
                        value={infoData && infoData.no_of_patients}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Contact No. of ABM</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contact No"
                        value={infoData && infoData.abm_contact}
                        readOnly
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

     {infoRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Request Info</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseInfoModel}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <form className="row g-3">
                    <div className="col-md-4 did-floating-label-content">
                     
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Camp Type"
                        value={infoData && infoData.camp_name}
                        readOnly
                      />
                       <label className="form-group form-label did-floating-label">
                        Type of Camp
                      </label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Pathlab Name"
                        value={infoData && infoData.pathlab_name}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Name of Pathlab</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Representative Name"
                        value={infoData && infoData.rep_name}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Name of Rep</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Contact No"
                        value={infoData && infoData.rep_contact}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Contact No Of Rep</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Email"
                        value={infoData && infoData.rep_email}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Email Id of Rep</label>
                    </div>

                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Zone"
                        value={infoData && infoData.zone}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Zone</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="State"
                        value={infoData && infoData.state}
                        readOnly
                      />
                      <label className="form-label did-floating-label">State</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Hq"
                        value={infoData && infoData.hq}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Hq</label>
                    </div>

                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Doctor Name"
                        value={infoData && infoData.doctor_name}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Name of Doctor</label>
                    </div>

                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Doctor Degree"
                        value={infoData && infoData.doctor_qualification}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Degree of Doctor</label>
                    </div>

                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Camp Date"
                        value={infoData && infoData.camp_date}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Date of Camp</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="time"
                        className="form-control did-floating-input"
                        placeholder="Camp Time"
                        value={infoData && infoData.camp_time}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Time of Camp</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Camp Venue"
                        value={infoData && infoData.camp_venue}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Camp Venue</label>
                    </div>
                    <div className="col-md-4 did-floating-label-content">
                      
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Patient No"
                        value={infoData && infoData.no_of_patients}
                        readOnly
                      />
                      <label className="form-label did-floating-label">
                        No. of Patients Expected
                      </label>
                    </div>

                    <div className="col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Contact No"
                        value={infoData && infoData.abm_contact}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Contact No. of ABM</label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {addRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseModel}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3" onSubmit={handleAddSubmit}>
                    <div className="form-group col-md-4">
                      <label className="form-label">Type of Camp</label>
                      <select
                        className="form-control"
                        onChange={(event) => {
                          setCampName(
                            event.target.options[
                              event.target.selectedIndex
                            ].getAttribute("data-campname")
                          );
                          setCampType(event.target.value);
                        }}
                        value={campType}
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
                        

                        onChange={handelPathlabChange}
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
                      <label className="form-label">
                        Name of Marketing Head
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setMarketingHeadEamil(
                            e.target.options[
                              e.target.selectedIndex
                            ].getAttribute("data-email")
                          );

                          setMarketingHeadId(e.target.value);
                        }}
                        value={marketingHeadId}
                      >
                        <option value="">Select...</option>
                        {marketingHeadList.map((e) => (
                          <option
                            data-email={e.email}
                            key={e.mhid}
                            value={e.mhid}
                          >
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Name of Rep</label>
                      <select
                        className="form-control"
                        onChange={handelRepresentativeChange}
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
                    <div className="form-group col-md-4">
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
                        onChange={(e) => {
                          setRepZone(e.target.value);
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
                        onChange={(e) => {
                          setRepState(e.target.value);
                        }}
                        value={repState}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Hq</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setRepHq(e.target.value);
                        }}
                        placeholder="Hq"
                        value={repHq}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Name of Doctor</label>
                      <select
                        className="form-control"
                        onChange={handelDoctorChange}
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
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Contact No of ABM</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contact No."
                        onChange={(e) => {
                          setAbmContact(e.target.value);
                        }}
                        value={abmContact}
                      />
                    </div>
                  
                    <div className="text-center">
                      {isLoading ? (
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{ justifyContent: "center" }}
                          wrapperClass="mx-auto"
                        />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

     {addRequestModel && (
        <div className="addusermodel">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handelCloseModel}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3" onSubmit={handleAddSubmit}>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={(event) => {
                          setCampName(
                            event.target.options[
                              event.target.selectedIndex
                            ].getAttribute("data-campname")
                          );
                          setCampType(event.target.value);
                        }}
                        value={campType}
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
                        <label className="form-label did-floating-label">Type of Camp</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        

                        onChange={handelPathlabChange}
                        value={pathlab}
                      >
                        <option value="">Select...</option>
                        {pathlabList.map((e) => (
                          <option key={e.pathlab_id} value={e.pathlab_id}>
                            {e.pathlab_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Pathlab</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      
                      <select
                        className="form-control did-floating-select"
                        onChange={(e) => {
                          setMarketingHeadEamil(
                            e.target.options[
                              e.target.selectedIndex
                            ].getAttribute("data-email")
                          );

                          setMarketingHeadId(e.target.value);
                        }}
                        value={marketingHeadId}
                      >
                        <option value="">Select...</option>
                        {marketingHeadList.map((e) => (
                          <option
                            data-email={e.email}
                            key={e.mhid}
                            value={e.mhid}
                          >
                            {e.name}
                          </option>
                        ))}
                      </select>
                      <label className="form-label did-floating-label">
                        Name of Marketing Head
                      </label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={handelRepresentativeChange}
                        value={repId}
                      >
                        <option value="">Select...</option>
                        {representativeList.map((e) => (
                          <option key={e.rep_id} value={e.rep_id}>
                            {e.rep_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Rep</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="contact"
                        value={repMobile}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Contact No Of Rep</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="email"
                        value={repEmail}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Email Id of Rep</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="zone"
                        onChange={(e) => {
                          setRepZone(e.target.value);
                        }}
                        value={repZone}
                      />
                        <label className="form-label did-floating-label">Zone</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="state"
                        onChange={(e) => {
                          setRepState(e.target.value);
                        }}
                        value={repState}
                      />
                        <label className="form-label did-floating-label">State</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setRepHq(e.target.value);
                        }}
                        placeholder="hq"
                        value={repHq}
                      />
                        <label className="form-label did-floating-label">Hq</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={handelDoctorChange}
                        value={doctorId}
                      >
                        <option value="">Select...</option>
                        {doctorList.map((e) => (
                          <option key={e.cdoc_id} value={e.cdoc_id}>
                            {e.doctor_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Doctor</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Doctor Degree"
                        value={doctorQualification}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Degree of Doctor</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="date"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampDate(e.target.value);
                        }}
                        placeholder="Camp Date"
                        value={campDate}
                      />
                        <label className="form-label did-floating-label">Date of Camp</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="time"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampTime(e.target.value);
                        }}
                        placeholder="Camp Time"
                        value={campTime}
                      />
                        <label className="form-label did-floating-label">Time of Camp</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampVenue(e.target.value);
                        }}
                        placeholder="Camp Venue"
                        value={campVenue}
                      />
                      <label className="form-label did-floating-label">Camp Venue</label>

                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                   
                      <input
                        type="number"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampPatients(e.target.value);
                        }}
                        placeholder="Patients No."
                        value={campPatients}
                      />
                      <label className="form-label did-floating-label">
                        No. of Patients Expected
                      </label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Contact No."
                        onChange={(e) => {
                          const value = e.target.value;
                         
                          if (/^\d{0,10}$/.test(value)) {
                            setAbmContact(value);
                          }
                         // setAbmContact(e.target.value);
                        }}
                        value={abmContact}
                      />
                        <label className="form-label did-floating-label">Contact No of ABM</label>
                    </div>
                  
                    <div className="text-center">
                      {isLoading ? (
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{ justifyContent: "center" }}
                          wrapperClass="mx-auto"
                        />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {editRequestModel && (
        <div className="addusermodel">
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="ExtralargeModal"
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
                  <form className="row g-3" onSubmit={handleEditSubmit}>
                    <div className="form-group col-md-4">
                      <label className="form-label">Type of Camp</label>
                      <select
                        className="form-control"
                        onChange={(event) => {
                          setCampType(event.target.value);
                          setCampName(
                            event.target.options[
                              event.target.selectedIndex
                            ].getAttribute("data-campname")
                          );
                        }}
                        value={campType}
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
                        //  onChange={(e)=>{
                        //   setPathlab(e.target.value)
                        // }}
                        onChange={handelPathlabChange}
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
                      <label className="form-label">
                        Name of Marketing Head
                      </label>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          setMarketingHeadEamil(
                            e.target.options[
                              e.target.selectedIndex
                            ].getAttribute("data-email")
                          );

                          setMarketingHeadId(e.target.value);
                        }}
                        value={marketingHeadId}
                      >
                        <option value="">Select...</option>
                        {marketingHeadList.map((e) => (
                          <option
                            data-email={e.email}
                            key={e.mhid}
                            value={e.mhid}
                          >
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Name of Rep</label>
                      <select
                        className="form-control"
                        onChange={handelRepresentativeChange}
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
                    <div className="form-group col-md-4">
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
                        onChange={(e) => {
                          setRepZone(e.target.value);
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
                        onChange={(e) => {
                          setRepState(e.target.value);
                        }}
                        value={repState}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="form-label">Hq</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setRepHq(e.target.value);
                        }}
                        placeholder="Hq"
                        value={repHq}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Name of Doctor</label>
                      <select
                        className="form-control"
                        onChange={handelDoctorChange}
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
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label className="form-label">Contact No of ABM</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Contact No."
                        onChange={(e) => {
                          setAbmContact(e.target.value);
                        }}
                        value={abmContact}
                      />
                    </div>
                    <div className="text-center">
                      {isLoading ? (
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{ justifyContent: "center" }}
                          wrapperClass="mx-auto"
                        />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

{editRequestModel && (
        <div className="addusermodel">
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="ExtralargeModal"
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
                  <form className="row g-3" onSubmit={handleEditSubmit}>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={(event) => {
                          setCampType(event.target.value);
                          setCampName(
                            event.target.options[
                              event.target.selectedIndex
                            ].getAttribute("data-campname")
                          );
                        }}
                        value={campType}
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
                        <label className="form-label did-floating-label">Type of Camp</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        //  onChange={(e)=>{
                        //   setPathlab(e.target.value)
                        // }}
                        onChange={handelPathlabChange}
                        value={pathlab}
                      >
                        <option value="">Select...</option>
                        {pathlabList.map((e) => (
                          <option key={e.pathlab_id} value={e.pathlab_id}>
                            {e.pathlab_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Pathlab</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      
                      <select
                        className="form-control did-floating-select"
                        onChange={(e) => {
                          setMarketingHeadEamil(
                            e.target.options[
                              e.target.selectedIndex
                            ].getAttribute("data-email")
                          );

                          setMarketingHeadId(e.target.value);
                        }}
                        value={marketingHeadId}
                      >
                        <option value="">Select...</option>
                        {marketingHeadList.map((e) => (
                          <option
                            data-email={e.email}
                            key={e.mhid}
                            value={e.mhid}
                          >
                            {e.name}
                          </option>
                        ))}
                      </select>
                      <label className="form-label did-floating-label">
                        Name of Marketing Head
                      </label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={handelRepresentativeChange}
                        value={repId}
                      >
                        <option value="">Select...</option>
                        {representativeList.map((e) => (
                          <option key={e.rep_id} value={e.rep_id}>
                            {e.rep_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Rep</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="contact"
                        value={repMobile}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Contact No Of Rep</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="email"
                        value={repEmail}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Email Id of Rep</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="zone"
                        onChange={(e) => {
                          setRepZone(e.target.value);
                        }}
                        value={repZone}
                      />
                        <label className="form-label did-floating-label">Zone</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="state"
                        onChange={(e) => {
                          setRepState(e.target.value);
                        }}
                        value={repState}
                      />
                        <label className="form-label did-floating-label">State</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setRepHq(e.target.value);
                        }}
                        placeholder="Hq"
                        value={repHq}
                      />
                        <label className="form-label did-floating-label">Hq</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <select
                        className="form-control did-floating-select"
                        onChange={handelDoctorChange}
                        value={doctorId}
                      >
                        <option value="">Select...</option>
                        {doctorList.map((e) => (
                          <option key={e.cdoc_id} value={e.cdoc_id}>
                            {e.doctor_name}
                          </option>
                        ))}
                      </select>
                        <label className="form-label did-floating-label">Name of Doctor</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Doctor Degree"
                        value={doctorQualification}
                        readOnly
                      />
                      <label className="form-label did-floating-label">Degree of Doctor</label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="date"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampDate(e.target.value);
                        }}
                        placeholder="Camp Date"
                        value={campDate}
                      />
                        <label className="form-label did-floating-label">Date of Camp</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="time"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampTime(e.target.value);
                        }}
                        placeholder="Camp Time"
                        value={campTime}
                      />
                        <label className="form-label did-floating-label">Time of Camp</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampVenue(e.target.value);
                        }}
                        placeholder="Camp Venue"
                        value={campVenue}
                      />
                        <label className="form-label did-floating-label">Camp Venue</label>
                    </div>
                    <div className="form-group col-md-4 did-floating-label-content">
                      
                      <input
                        type="number"
                        className="form-control did-floating-input"
                        onChange={(e) => {
                          setCampPatients(e.target.value);
                        }}
                        placeholder="Patients No."
                        value={campPatients}
                      />
                      <label className="form-label did-floating-label">
                        No. of Patients Expected
                      </label>
                    </div>

                    <div className="form-group col-md-4 did-floating-label-content">
                      <input
                        type="text"
                        className="form-control did-floating-input"
                        placeholder="Contact No."
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setAbmContact(value);
                          }
                        }}
                        value={abmContact}
                      />
                        <label className="form-label did-floating-label">Contact No of ABM</label>
                    </div>
                    <div className="text-center">
                      {isLoading ? (
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{ justifyContent: "center" }}
                          wrapperClass="mx-auto"
                        />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success mx-auto"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
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

export default Request;
