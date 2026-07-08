import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import MolecularInteractions from "./MolecularInteractions";
import ReactDOM from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import API_CONFIG from "../../apiconfig";
import { C, GRAD, GRAD_H } from "../../utils/colors";
const StructureDownload = () => {
  const { BASE_URL, PORT1 } = API_CONFIG;
  const [fileError, setFileError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proteins, setProteins] = useState([]);
  const [polling, setPolling] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // Track the open accordion
  const [affinityData, setAffinityData] = useState([]);
  const [report, setReport] = useState({}); // State to store API data
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [proteinRecords, setProteinRecords] = useState([]);
  const [messages, setMessages] = useState([]);
  const wsUrl = "ws://20.84.78.153:8080/api/v1/ws-process-protein/";
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("File is required"),
    }),
    onSubmit: async (values) => {
      handleUpload(values.file);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];

    if (file) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (allowedTypes.includes(file.type)) {
        formik.setFieldValue("file", file);
        setFileError("");
      } else {
        setFileError("Only CSV or Excel files are allowed");
        formik.setFieldValue("file", null);
      }
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      setFileError("Please upload a valid file");
      return;
    }

    setLoading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        //  "http://20.84.78.153:8080/api/v1/download-protein-drugs/",
        `${BASE_URL}:${PORT1}/api/v1/download-protein-drugs/`,
        formData
      );
      console.log("res", res.data);
      setProteins(res.data.proteins);
      setUploadSuccess(true);
      setPolling(true);
      callApiForProteins(res.data);
      //fetchProteins();
    } catch (error) {
      console.error("Error starting protein process:", error);
    } finally {
      setLoading(false);
    }
  };
  const callApiForProteins = async (apiData) => {
    try {
      const proteinPromises = apiData.proteins.map((protein, i) => {
        const requestBody = {
          protein_record: {
            pdb_file_path: protein.pdb_file_path,
            protein_name: protein.protein_name,
            top_n_affinity_records: protein.top_n_affinity_records,
            status: protein.status,
            time_taken: protein.time_taken,
          },
          drug_records: apiData.drugs,
        };

        return axios
          .post(
            // "http://20.84.78.153:8080/api/v1/process-protein-v2/",
            `${BASE_URL}:${PORT1}/api/v1/process-protein-v2/`,
            requestBody,
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((response) => {
            console.log("response", response);
            // setProteins((prevData) => {
            //   const updated = [...prevData];
            //   updated[i] = {
            //     ...updated[i],
            //     status: response.data.status || "Processed",
            //     top_n_affinity_records: response.data.top_n_affinity_records || [],
            //   };
            //   return updated;
            // });
            // return response.data; // collect for WebSocket
          })
          .catch((error) => {
            console.error(`Error processing ${protein.protein_name}:`, error);
            return null; // or handle error case
          });
      });

      const allProcessed = await Promise.all(proteinPromises);

      // ✅ All responses received, now call WebSocket
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify(apiData.proteins));
      };

      ws.onmessage = (event) => {
        try {
          if (!event?.data) {
            console.warn("⚠️ WebSocket received empty message");
            return;
          }
      
          const data = JSON.parse(event.data);
      
          if (data?.proteins) {
            console.log("📩 WebSocket received message:", data.proteins);
            setProteins(data.proteins);
          } else {
            console.warn("⚠️ WebSocket message has no 'proteins' field:", data);
          }
        } catch (err) {
          console.error("❌ WebSocket message parsing error:", err);
        }
      };
      

      ws.onerror = (error) => console.error("WebSocket error:", error);
      ws.onclose = () => console.log("WebSocket closed");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // webscoket start
  useEffect(() => {
    if (proteinRecords.length === 0) return; // Don't connect if empty

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify(proteinRecords));
    };

    ws.onmessage = (event) => {
      try {
        const responseData = JSON.parse(event.data);
        const enhancedData = [...responseData, ...responseData];
        setMessages((prevMessages) => [...prevMessages, enhancedData]);
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [proteinRecords]); // 👈 Only runs when proteinRecords is updated

  // websocket end
  // Call the function

  const handleToggle = (index, status, protienName, protein) => {
    console.log("protein", protein);
    if (protein.top_n_affinity_records.length > 0) {
      setAffinityData(protein.top_n_affinity_records.length);
    }
    if (status === "Success" || status === "Failed To Convert to pdbqt") {
      // fetchAffinityValues(protienName);
      setOpenIndex(openIndex === index ? null : index);
    }
  };
  const fetchAffinityValues = async (proteinName) => {
    try {
      const response = await axios.get(
        // `http://20.84.78.153:8080/api/v1/top-affinity-values/${proteinName}`
        `${BASE_URL}:${PORT1}/api/v1/top-affinity-values/${proteinName}`
      );

      console.log("AffinityValues", response);
      setAffinityData((prev) => ({
        ...prev,
        [proteinName]: response.data, // Store data for the specific protein
      }));
    } catch (error) {
      console.error(
        `Error fetching affinity values for ${proteinName}:`,
        error
      );
    }
  };
  const handleAction = async (proteinName, actionType) => {
    if (actionType === "createbundle") {
      try {
        const response = await axios.post(
          // `http://20.84.78.153:8080/api/v1/create-protein-bundle/${proteinName}`
          `${BASE_URL}:${PORT1}/api/v1/create-protein-bundle/${proteinName}`
        );

        if (response.status === 200) {
          toast.success(
            `${actionType} action completed successfully for ${proteinName}`
          );
        } else {
          toast.error(
            `Failed to complete ${actionType} action for ${proteinName}`
          );
        }
      } catch (error) {
        toast.error(
          `Failed to complete ${actionType} action for ${proteinName}`
        );
      }
    } else if (actionType === "downloadbundle") {
      try {
        const response = await axios.get(
          // `http://20.84.78.153:8080/api/v1/download-protein-bundle/${proteinName}`,
          `${BASE_URL}:${PORT1}/api/v1/download-protein-bundle/${proteinName}`,
          {
            responseType: "blob", // Important: Ensures binary data handling
          }
        );

        // Create a Blob from the ZIP file response
        const blob = new Blob([response.data], { type: "application/zip" });

        // Create a download link dynamically
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${proteinName}.zip`; // Set the filename
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success(
          `${actionType} action completed successfully for ${proteinName}`
        );
      } catch (error) {
        console.error("Error downloading the protein bundle:", error);
      }
    } else if (actionType === "generatepip") {
      try {
        const response = await axios.post(
          // `http://20.84.78.153:8080/api/v1/generate-plip-report/${proteinName}`
          `${BASE_URL}:${PORT1}/api/v1/generate-plip-report/${proteinName}`
        );

        if (response.status === 200) {
          alert(
            `${actionType} action completed successfully for ${proteinName}`
          );
        } else {
          alert(`Failed to complete ${actionType} action for ${proteinName}`);
        }
      } catch (error) {
        console.error(`Error during ${actionType} action:`, error);
        alert(`Error performing ${actionType} action for ${proteinName}`);
      }
    }
  };
  const onProtienData = async () => {
    try {
      const response = await axios.delete(
        // `http://20.84.78.153:8080/api/v1/clear-protein-data`
        `${BASE_URL}:${PORT1}/api/v1/clear-protein-data`
      );
      console.log("data,,");
    } catch (error) {
      console.error("Error during");
    }
  };
  const downloadreport = async (protienName, arr) => {
    console.log("pro", protienName, arr);
    const requestBody = {
      affinity_record: arr,
      protein_name: protienName,
    };
    const res = await axios.post(
      // "http://20.84.78.153:8080/api/v1/generate-ligplot-report/",
      `${BASE_URL}:${PORT1}/api/v1/generate-ligplot-report/`,
      requestBody
    );
    console.log("resdatataaa", res.data);
    setReport(res.data);
    setShowModal(true);
  };
  const handleOutsideClick = (event) => {
    // Close modal only if clicked outside the content div
    if (event.target.id === "modal-overlay") {
      setShowModal(false);
    }
  };
  const Modal = ({ showModal, setShowModal, report }) => {
    if (!showModal) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed top-20 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center z-50"
        onClick={handleOutsideClick}
        id="modal-overlay"
      >
        <div className="bg-white p-8 rounded-md max-w-5xl relative max-h-[90vh] max-w-[90vw] overflow-auto">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
          >
            X
          </button>
          <MolecularInteractions data={report} />
          {/* Pass API data to the MolecularInteractions component */}
        </div>
      </div>,
      document.getElementById("modal-root") // Render at root level
    );
  };
  return (
    <>
      <div className="m-1 p-4 border rounded-md mb-3" style={{ borderColor: C.teal }}>
        <h1 className="text-lg font-semibold" style={{ color: C.navy }}>
          Screening Suite
        </h1>
        <p className="mt-1 text-[14px] text-justify" style={{ color: C.muted }}>
          The Screening Suite is responsible for retrieving, preparing, and
          virtually screening drug candidates against target proteins. It
          automates molecular structure downloads, optimizes ligand and protein
          files, and performs high-throughput docking using AutoDock Vina.
          Post-docking analysis, integrates the PLIP (Protein-Ligand Interaction
          Profiler) module to analyze interactions such as hydrogen bonds,
          hydrophobic contacts, salt bridges, and π-stacking. This ensures a
          comprehensive evaluation of ligand-protein binding, helping to
          prioritize the most effective drug candidates for further development.
        </p>
      </div>

      <div className="shadow-md m-1 p-3 mt-2">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-16">
            {/* File Upload Section */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold" style={{ color: C.navy }}>
                Upload CSV or Excel<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                className="mt-1 p-2 w-72 border rounded-lg"
                style={{ color: C.navy }}
              />
              {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </div>

            {/* Buttons Section */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white disabled:opacity-50"
                disabled={loading}
                style={{ background: GRAD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.sage;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = GRAD;
                }}
              >
                {loading ? "Processing..." : "Start Process"}
              </button>

              <button
                type="button"
                className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-700"
                onClick={onProtienData}
              >
                Clear Cache
              </button>
            </div>
          </div>
        </form>

        {/* Accordion for Protein Status */}
        <div className="mt-6">
          {proteins.map((protein, index) => {
            const isExpandable =
              protein.status === "Success" ||
              protein.status === "Failed To Convert to pdbqt";
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border rounded-lg mb-2 overflow-hidden"
              >
                <button
                  className={`w-full p-4 text-left flex justify-between ${
                    isExpandable
                      ? "cursor-pointer"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: isExpandable ? C.sky : C.bg,
                    color: C.navy
                  }}
                  onMouseEnter={(e) => {
                    if (isExpandable) {
                      e.currentTarget.style.backgroundColor = C.bg;
                      e.currentTarget.style.color = C.sage;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isExpandable) {
                      e.currentTarget.style.backgroundColor = C.sky;
                      e.currentTarget.style.color = C.navy;
                    }
                  }}
                  onClick={() =>
                    handleToggle(
                      index,
                      protein.status,
                      protein.protein_name,
                      protein
                    )
                  }
                  disabled={!isExpandable} // Disable button if not expandable
                >
                  <span className="font-bold">{protein.protein_name}</span>
                  <span
                    className={`px-2 py-1 rounded-lg text-sm flex items-center ${
                      !protein.status
                        ? "bg-gray-500 text-white"
                        : protein.status === "Success"
                        ? "bg-green-500 text-white"
                        : protein.status === "Failed To Convert to pdbqt"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                    style={
                      protein.status === "Success"
                        ? { backgroundColor: "#009f30" }
                        : {}
                    }
                  >
                    {!protein.status ? (
                      <svg
                        className="w-4 h-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      protein.status
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4" style={{ backgroundColor: C.bg }}>
                    {/* Buttons Section */}
                    <div className="flex gap-4 mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        style={{ backgroundColor: C.teal }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = C.navy;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = C.teal;
                        }}
                        onClick={() =>
                          handleAction(protein.protein_name, "createbundle")
                        }
                      >
                        Create Bundle
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        style={{ backgroundColor: C.sage }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = C.navy;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = C.sage;
                        }}
                        onClick={() =>
                          handleAction(protein.protein_name, "downloadbundle")
                        }
                      >
                        Download Bundle
                      </button>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                      <table className="min-w-full border border-gray-300">
                        {/* Table Head */}
                        <thead
                          style={{
                            background: GRAD_H,
                          }}
                        >
                          <tr className="text-white uppercase text-sm">
                            <th className="p-3 ">Protein Name</th>
                            <th className="p-3 ">Mode</th>
                            <th className="p-3 ">Binding Affinity (kcal/mol)</th>
                            <th className="p-3 ">Protein-Ligand</th>
                            <th className="p-3 ">Protein</th>
                            <th className="p-3 ">Ligand</th>
                            <th className="p-3 ">Download Report</th>
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                          {protein?.top_n_affinity_records?.map(
                            (item, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-100 transition duration-200"
                              >
                                <td className="p-3 border text-center" style={{ color: C.navy }}>
                                  {protein?.protein_name}
                                </td>
                                <td className="p-3 border  text-center" style={{ color: C.navy }}>
                                  {item.Mode}
                                </td>
                                <td className="p-3 border  text-center" style={{ color: C.navy }}>
                                  {item.Affinity_kcal_per_mol}
                                </td>
                                <td className="p-3 border  text-center" style={{ color: C.navy }}>
                                  {item.protien_ligand}
                                </td>
                                <td className="p-3 border  text-center" style={{ color: C.navy }}>
                                  {item.protein}
                                </td>
                                <td className="p-3 border  text-center" style={{ color: C.navy }}>
                                  {item.ligand}
                                </td>
                                <td className="p-3 border">
                                  <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg "
                                    style={{ backgroundColor: C.teal }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = C.navy;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = C.teal;
                                    }}
                                    onClick={() =>
                                      downloadreport(
                                        protein.protein_name,
                                        protein?.top_n_affinity_records[index]
                                      )
                                    }
                                  >
                                    PLIP REPORT
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <ToastContainer />
      </div>
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          report={report}
        />
      )}
    </>
  );
};

export default StructureDownload;
