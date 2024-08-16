import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { BASEURL, PageCount } from "../constant/constant";
import axios from "axios";
import "./Dashboard.css";
import Loader from "../utils/Loader";
const Dashboard = () => {
  const userId = sessionStorage.getItem("userId");
  // data for select tag

  const [campList, setCampList] = useState([]);
  const [listCampType, setListCampType] = useState("");
  const [campReportList, setCampReportList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // for filter result

  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //  for showing dashboard list
  const getCampReportList = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASEURL}/report/getAllCampReport?searchName=${searchQuery}`,
        {
          campTypeId: listCampType,
          userId: userId,
          startDate,
          endDate,
          filterBy,
        }
      );

      if (res?.data?.errorCode == "1") {
        setCampReportList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      let timer = setTimeout(() => {
        getCampReportList();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      getCampReportList();
    }
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

  useEffect(() => {
    getCampList();
  }, []);

  // for search

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Camp Request Count",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#fa3e5e");
          gradient.addColorStop(1, "#781122"); // lighter shade towards the bottom
          return gradient;
        },
        borderColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#fa3e5e");
          gradient.addColorStop(1, "#781122"); // lighter shade towards the bottom
          return gradient;
        },
        borderWidth: 2,
        data: [],
      },
      {
        label: "Camp Report Count",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#de4e35");
          gradient.addColorStop(1, "#52170c"); // lighter shade towards the bottom
          return gradient;
        },
        borderColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#de4e35");
          gradient.addColorStop(1, "#52170c"); // lighter shade towards the bottom
          return gradient;
        },
        borderWidth: 2,
        data: [],
      },
    ],
  });

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Don't maintain aspect ratio for responsiveness
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const convertMonthNumberToName = (monthNumber) => {
    return monthNames[monthNumber - 1];
  };

  const getCampCountForGraph = async () => {
    try {
      const response = await axios.post(`${BASEURL}/dashboard/getCampCount`, {
        userId: userId,
        campTypeId: listCampType,
      });
      const response1 = await axios.post(
        `${BASEURL}/campRequest/getCampRequestCount`,
        {
          userId: userId,
          campTypeId: listCampType,
        }
      );

      console.log("Survey data response", response);
      console.log("Survey data response1", response1);

      // Assuming response.data contains the same structure as your stacked bar chart data
      const sortedData = response.data.sort((a, b) => {
        // If years are different, sort by year
        if (a.report_year !== b.report_year) {
          return a.report_year - b.report_year;
        }
        // If years are the same, sort by month
        return a.report_month - b.report_month;
      });

      const sortedData1 = response1.data.sort((a, b) => {
        // If years are different, sort by year
        if (a.report_year !== b.report_year) {
          return a.report_year - b.report_year;
        }
        // If years are the same, sort by month
        return a.report_month - b.report_month;
      });

      const xValues = sortedData1.map(
        (item) =>
          `${convertMonthNumberToName(item.report_month)} ${item.report_year}`
      );

      console.log("X values", xValues);
      const camp_request_count = sortedData1.map(
        (item) => item.Camp_Request_Count
      );
      const camp_count = sortedData.map((item) => item.Camp_Count);

      //const pendingValues = sortedData.map(item => item.survey_pending);
      setChartData({
        labels: xValues,
        datasets: [
          { ...chartData.datasets[0], data: camp_request_count },
          { ...chartData.datasets[1], data: camp_count },
        ],
      });
    } catch (error) {
      console.error("Error fetching survey data:", error);
    }
  };

  useEffect(() => {
    getCampCountForGraph();
  }, [listCampType]);

  const handelReportDownload = () => {
    // Define custom column headers
    const headers = [
      "Camp Report Id",
      "Doctor UIN Number",
      "Doctor Name",
      "PathLab Name",
      "Camp Name",
      "Camp Date",
      "Camp Venue",
      "Brand Name",
      "Representative Name",
      "Screened Count",
      "Diagnosed Count",
      "Prescription Count",
    ];

    // Map the data to match the custom column headers
    const mappedData = campReportList.map((item) => ({
      "Camp Report Id": item.crid,
      "Doctor UIN Number": item.uin_number,
      "Doctor Name": item.doctor_name,
      "PathLab Name": item.pathlab_name,
      "Camp Name": item.camp_name,
      "Camp Date": item.camp_date,
      "Camp Venue": item.camp_venue,
      "Brand Name": item.description,
      "Representative Name": item.rep_name,
      "Screened Count": item.screened_count,
      "Diagnosed Count": item.diagnosed_count,
      "Prescription Count": item.prescription_count,
    }));

    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const rn = Math.floor(Math.random() * 1000) + 1;
    XLSX.writeFile(wb, `Lupin_AllReport_${rn}.xlsx`);
  };

  const handelSingalReportDownload = (id) => {
    const filterData = campReportList.filter((e) => {
      return e.crid === id;
    });
    // Define custom column headers
    const headers = [
      "Camp Report Id",
      "Doctor UIN Number",
      "Doctor Name",
      "PathLab Name",
      "Camp Name",
      "Camp Date",
      "Camp Venue",
      "Brand Name",
      "Representative Name",
      "Screened Count",
      "Diagnosed Count",
      "Prescription Count",
    ];

    // Map the data to match the custom column headers
    const mappedData = filterData.map((item) => ({
      "Camp Report Id": item.crid,
      "Doctor UIN Number": item.uin_number,
      "Doctor Name": item.doctor_name,
      "PathLab Name": item.pathlab_name,
      "Camp Name": item.camp_name,
      "Camp Date": item.camp_date,
      "Camp Venue": item.camp_venue,
      "Brand Name": item.description,
      "Representative Name": item.rep_name,
      "Screened Count": item.screened_count,
      "Diagnosed Count": item.diagnosed_count,
      "Prescription Count": item.prescription_count,
    }));

    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const rn = Math.floor(Math.random() * 1000) + 1;
    XLSX.writeFile(wb, `Lupin_Report_${rn}.xlsx`);
  };

  const handleFilter = (e) => {
    setFilterBy(e.target.value);
  };

  // pagination logic

  const [page, setPage] = useState(1);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(campReportList.length / PageCount) &&
      page !== selectedPage
    )
      setPage(selectedPage);
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(campReportList.length / PageCount);
    const pageNumbers = [];
    const maxPageNumbersToShow = PageCount;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, page - 2);
      const endPage = Math.min(totalPages - 1, page + 2);

      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((pageNum, index) =>
      pageNum === "..." ? (
        <li className="page-item" key={index}>
          <span className="page-link">{pageNum}</span>
        </li>
      ) : (
        <li
          className={`page-item ${page === pageNum ? "active" : ""}`}
          onClick={() => selectPageHandler(pageNum)}
          key={pageNum}
        >
          <span className="page-link">{pageNum}</span>
        </li>
      )
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <div>
      <main id="main" className="main">
        {/* <div className="pagetitle">
          <h1>Dashboard</h1>
        </div> */}
        {/* End Page Title */}
        <div className="bar">
          <Bar data={chartData} options={options}></Bar>
        </div>
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
                    value={searchQuery}
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
                      onClick={handelReportDownload}
                    >
                      <i className="bx bx-cloud-download"></i> Download Report
                    </button>
                  </div>
                  <hr />
                  {/* Bordered Table */}
                  <div className="tbst">
                    <table className="table table-striped newcss">
                      <thead>
                        <tr>
                          <th>Report Id</th>
                          <th>Doctor Id</th>
                          <th>Doctor Name</th>
                          <th>Rep Name</th>
                          <th>Pathlab Name</th>
                          <th>Camp Date</th>
                          <th>Camp Venue</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campReportList &&
                          campReportList.length > 0 &&
                          campReportList
                            .slice(
                              page * PageCount - PageCount,
                              page * PageCount
                            )
                            .map((e) => (
                              <tr key={e.crid}>
                                <td>{e.crid}</td>
                                <td>{e.uin_number}</td>
                                <td>{e.doctor_name}</td>
                                <td>{e.rep_name}</td>
                                <td>{e.pathlab_name}</td>
                                <td>{e.camp_date}</td>
                                <td>{e.camp_venue}</td>

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-primary rounded-pill"
                                    onClick={() =>
                                      handelSingalReportDownload(e.crid)
                                    }
                                  >
                                    <i className="ri-download-2-fill"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>

                  {/* { campReportList.length>0 && <div className="pagination">
                     <span onClick={()=>selectPageHandler(page-1)}>prev</span>
                     {[...Array(Math.ceil(campReportList.length / 5))].map((_, i) => {
                     return <span 
                     className={page === i+1 ? "show" : ""}
                
                     onClick={()=>selectPageHandler(i+1)} key={i}>
                      {i + 1}
                      </span>;
                     })}
                     <span onClick={()=>selectPageHandler(page+1)}>next</span>

                  </div>} */}
                  {/* End Bordered Table */}
                  {campReportList && campReportList.length > 0 && (
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

                            {renderPageNumbers()}
                            {/* {[
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
                                      page === i + 1 ? "showpag" : ""
                                    }`}
                                  >
                                    {i + 1}
                                  </span>
                                </li>
                              );
                            })} */}
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
      {/* End #main */}
    </div>
  );
};

export default Dashboard;
