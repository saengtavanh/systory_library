// import * as React from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../common/51-modern-default.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./AddLibrary.css";
import FileInput from "./FileInput";
import ImageInput from "./ImageInput";

function EditLibrary({ records }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("username");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const location = useLocation();
  // console.log('location', location);
  const query = new URLSearchParams(location.search);
  // console.log('query', query);
  const LibraryId = query.get("id");
  // console.log('LibraryName', LibraryName);
  // console.log(records);
  let libraryData = records.find((item) => item.$id.value == LibraryId);
  // console.log("libraryData", libraryData);
  // form
  const [id, setId] = useState("");
  const [libraryName, setLibraryName] = useState("");
  const [userName, setUserName] = useState("");
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [installationDes, setInstallationDes] = useState("");
  const [HowToUseDes, setHowToUseDes] = useState("");
  const [exampleDes, setExampleDes] = useState("");
  const [overviewDes, setOverviewDes] = useState("");
  const [suggestionDes, setSuggestionDes] = useState("");
  // form
  const [idCounterInstallations, setIdCounterInstallation] = useState(1);
  const [idCounterHowToUse, setIdCounterHowToUse] = useState(1);
  const [idCounterExamPle, setIdCounterExamPle] = useState(1);
  console.log("files", files);

  // Define the initial rows in state
  const [rowsInstallations, setRowsInstallations] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);
  const [rowsHowToUse, setRowsHowToUse] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);
  const [rowsExample, setRowsExamPle] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);

  useEffect(() => {
    if (libraryData) {
      setId(libraryData.$id.value);
      setLibraryName(libraryData.LIB_NAME.value || "");
      setDescription(libraryData.DESCRIPTION.value || "");
      setReference(libraryData.REFERENCE.value || "");
      setInstallationDes(libraryData.DESCRIPTIONS_INS.value || "");
      setHowToUseDes(libraryData.DESCRIPTIONS_HTU.value || "");
      setExampleDes(libraryData.DESCRIPTIONS_EXP.value || "");
      setOverviewDes(libraryData.DESCRIPTIONS_INS.value || "");
      setSuggestionDes(libraryData.DESCRIPTIONS_SGT.value || "");

      // Table inatallations
      const TableInstallations = libraryData.INSTALLATIONS.value.map(
        (item, index) => ({
          id: item.id,
          title: item.value.TITLE_INS.value || "",
          description: item.value.CONTENT_INS.value || "",
          example: item.value.EXAMPLE_INS.value || "",
        })
      );

      // Table howtouse
      const TableHowToUse = libraryData.HOWTOUSE.value.map((item, index) => ({
        id: item.id,
        title: item.value.TITLE_HTU.value || "",
        description: item.value.CONTENT_HTU.value || "",
        example: item.value.EXAMPLE_HTU.value || "",
      }));

      // Table example
      const TableExamPle = libraryData.EXAMPLE.value.map((item, index) => ({
        id: item.id,
        title: item.value.TITLE_EXP.value || "",
        description: item.value.CONTENT_EXP.value || "",
        example: item.value.EXAMPLE_EXP.value || "",
      }));

      //set to State Table installations
      setRowsInstallations(TableInstallations);
      setIdCounterInstallation(TableInstallations.length + 1);

      //set to State Table Howtouse
      setRowsHowToUse(TableHowToUse);
      setIdCounterHowToUse(TableHowToUse.length + 1);

      //set to State Table example
      setRowsExamPle(TableExamPle);
      setIdCounterExamPle(TableExamPle.length + 1);
    }
  }, [libraryData]);

  // created functions keep input value
  const handleInputChangeTitle = (id, field, value, type) => {
    switch (type) {
      case "installations":
        setRowsInstallations((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      case "howToUse":
        setRowsHowToUse((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      case "example":
        setRowsExamPle((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      default:
        break;
    }
  };

  //Create functions add new row
  const addRow = (type, index) => {
    switch (type) {
      case "installations":
        setIdCounterInstallation((prevCounter) => prevCounter + 1);
        setRowsInstallations((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterInstallations + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      case "howToUse":
        setIdCounterHowToUse((prevCounter) => prevCounter + 1);
        setRowsHowToUse((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterHowToUse + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      case "example":
        setIdCounterExamPle((prevCounter) => prevCounter + 1);
        setRowsExamPle((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterExamPle + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      default:
        break;
    }
  };

  //Create functions remove row
  const removeRow = (id, type) => {
    switch (type) {
      case "installations":
        setRowsInstallations((prevRows) =>
          prevRows.filter((row) => row.id !== id)
        );
        break;
      case "howToUse":
        setRowsHowToUse((prevRows) => prevRows.filter((row) => row.id !== id));
        break;
      case "example":
        setRowsExamPle((prevRows) => prevRows.filter((row) => row.id !== id));
        break;
      default:
        break;
    }
  };

  // set username from sessionStorage to state
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (libraryData && libraryData.FILE && libraryData.FILE.value) {
      const extractedFiles = libraryData.FILE.value.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.contentType,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModifiedDate),
        fileKey: file.fileKey,
        url: file.fileKey,
      }));
      setFiles(extractedFiles);
    } else {
      setFiles([]);
    }

    // file Image
    if (libraryData && libraryData.IMAGE && libraryData.IMAGE.value) {
      const extractedFilesImage = libraryData.IMAGE.value.map((image) => ({
        name: image.name,
        size: image.size,
        type: image.contentType,
        lastModified: image.lastModified,
        lastModifiedDate: new Date(image.lastModifiedDate),
        fileKey: image.fileKey,
        url: image.fileKey,
      }));
      setImage(extractedFilesImage);
    } else {
      setImage(null);
    }
  }, [libraryData]);
  // get value file image
  // console.log("File image ===== ", image);
  // console.log("userName ===== ", userName);

  function onChangeFile(files) {
    console.log("retriveFile:", files);
    for (let [key, value] of files.entries()) {
      // console.log(key, value);
    }
    setFiles(files);
  }

  function onRemoveFile(files) {
    console.log("removedFile:", files);
    for (let [key, value] of files.entries()) {
      // console.log(key, value);
    }
    setFiles(files);
  }

  function onChangeImage(image) {
    console.log("image", image);
    for (let [key, value] of image.entries()) {
      // console.log(key, value);
    }
    setImage(image);
  }
  function onRemoveImage(image) {
    // console.log("imageupdate", image);
    setImage(image);
    // console.log(image);
  }

  // create function when the click button save
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    if (files && files.entries) {
      // if (files) {
      for (let [key, value] of files.entries()) {
        formData.append(key, value);
      }
    }

    if (image && image.entries) {
      for (let [key, value] of image.entries()) {
        formData.append(key, value);
      }
    }

    const record = {
      id,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
      userName,
    };

    formData.append("record", JSON.stringify(record));
    // console.log("Client", record);
    try {
      await axios
        .post("http://localhost:3001/Update/Data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // console.log(response);
        });
      window.location.reload();
      // navigate(`/content?id=${records[0].$id.value}`);
      window.location.href = `/content?id=${id}`;
      // navigate("/");
    } catch (err) {
      console.error("Error uploading file client 4454545:", err);
    }
  }

  return (
    <>
      <main className="content-container">
        <div className="add-content">
          <section className="section">
            {/* <div className="section-header" >Overview</div> */}
            <div className="group">
              <label>Library Image</label>
              <ImageInput
                onChangeImage={onChangeImage}
                onRemoveImage={onRemoveImage}
                initialImage={image}
              />
            </div>
            <div className="group-row">
              <div className="group">
                <label>Library Name</label>
                <div className="kintoneplugin-input-outer">
                  <input
                    style={{ width: "102%" }}
                    className="kintoneplugin-input-text"
                    type="text"
                    value={libraryName}
                    onChange={(e) => {
                      setLibraryName(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="group-row">
              <div className="group">
                <label>Description</label>
                <div className="kintoneplugin-input-outer">
                  <textarea
                    style={{ width: "102%", height: "10rem" }}
                    className="kintoneplugin-input-text"
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label>Reference</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="group">
              <label>Attachment</label>
              <FileInput
                onChangeFile={onChangeFile}
                onRemoveFile={onRemoveFile}
                initialFiles={files}
              />
            </div>
            {/* ============================ */}
          </section>

          {/* overview section */}
          <section className="section" id="overview">
            <div className="section-header">Overview</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={overviewDes}
                  onChange={(e) => {
                    setOverviewDes(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>
          {/* installation section */}
          <section className="section" id="installation">
            <div className="section-header">Installation</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={installationDes}
                  onChange={(e) => {
                    setInstallationDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table Installations</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsInstallations.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("installations", index)}
                          ></button>
                          {/* )} */}
                          {rowsInstallations.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "installations")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* how to use section */}
          <section className="section" id="installation">
            <div className="section-header">How to use</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={HowToUseDes}
                  onChange={(e) => {
                    setHowToUseDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table How to use</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsHowToUse.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("howToUse", index)}
                          ></button>
                          {/* )} */}
                          {rowsHowToUse.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "howToUse")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Example section */}
          <section className="section" id="example">
            <div className="section-header">Example</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={exampleDes}
                  onChange={(e) => {
                    setExampleDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table Example</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsExample.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("example", index)}
                          ></button>
                          {/* )} */}
                          {rowsExample.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "example")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Suggestion section */}
          <section className="section" id="suggestion">
            <div className="section-header">Suggestion</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={suggestionDes}
                  onChange={(e) => {
                    setSuggestionDes(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>

          <section className="section">
            <button
              className="submit"
              type="button"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Submit
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

export default EditLibrary;
