import "./MainContent.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Code from "./Code";
import axios from "axios";
import Spinner from "./Spinner";

function MainContent({ records }) {
  const [fileUrls, setFileUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const IP_ADDRESS = import.meta.env.VITE_IP_ADDRESS;

  const location = useLocation();
  // console.log('location', location);
  const query = new URLSearchParams(location.search);
  // console.log('query', query);
  const LibraryId = query.get("id");
  // console.log('LibraryName', LibraryName);

  console.log(records);
  let libraryData = records
    ? records.find((item) => item.$id.value == LibraryId)
    : null;
  // let libraryData = records.find((item) => item.$id.value == LibraryId);
  // console.log("libraryData", libraryData);
  if (!libraryData) {
    return;
  }
  const {
    CerateBy,
    LIB_NAME,
    DESCRIPTION,
    REFERENCE,
    DESCRIPTIONS_OVER,
    DESCRIPTIONS_INS,
    DESCRIPTIONS_HTU,
    DESCRIPTIONS_EXP,
    DESCRIPTIONS_SGT,
    INSTALLATIONS,
    HOWTOUSE,
    EXAMPLE,
    FILE,
    IMAGE,
  } = libraryData;

  // create funtions get file to set to useState
  const fetchFiles = async () => {
    try {
      if (!FILE || !FILE.value) return;
      const files = await Promise.all(
        FILE.value.map(async (file) => {
          const response = await axios.get(
            `${IP_ADDRESS}/api/file/${file.fileKey}`,
            { responseType: "blob" }
          );
          const url = URL.createObjectURL(response.data);
          return {
            fileKey: file.fileKey,
            url,
            name: file.name,
            size: file.size,
          };
        })
      );
      // return { itemId: item.$id.value, fileUrls }; // Return the item ID and its corresponding file URLs
      const fileUrls = await Promise.all(files);
      const validFileUrls = fileUrls.filter((fileUrl) => fileUrl !== null);
      setFileUrls(fileUrls); // Store the map in the state
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  useEffect(() => {
    if (FILE) {
      fetchFiles().then(() => {
        setLoading(false);
      });
    }
  }, [FILE]);

  function formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <main className="content-container">
          <div className="main-content">
            <h1>{LIB_NAME.value}</h1>
            <section className="section">
              <div className="show-img">
                {IMAGE && IMAGE.value.length > 0 ? (
                  <>
                    <img
                      src={`${IP_ADDRESS}/api/image/${IMAGE.value[0].fileKey}`}
                      alt="Item Image"
                      className="libraly-img"
                    />
                  </>
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <p className="section-description">{DESCRIPTION.value}</p>
            </section>

            <section className="section" id="overview">
              <div className="section-header">Overview</div>
              <p className="section-description">{DESCRIPTIONS_OVER.value}</p>
            </section>
            <div className="divider" />
            {/* installation section */}
            <section className="section" id="installation">
              <div className="section-header">Installation</div>
              <p className="section-description">{DESCRIPTIONS_INS.value}</p>
              {INSTALLATIONS.value.map((item, index) => (
                <div key={index}>
                  <h4>{item.value.TITLE_INS.value}</h4>
                  <p className="section-description">
                    {item.value.CONTENT_INS.value}
                  </p>
                  {item.value.EXAMPLE_INS.value && (
                    <Code code={item.value.EXAMPLE_INS.value} />
                  )}
                </div>
              ))}
            </section>
            <div className="divider" />
            {/* how to use section */}
            <section className="section" id="how_to_use">
              <div className="section-header">How to use</div>
              <p className="section-description">{DESCRIPTIONS_HTU.value}</p>
              {HOWTOUSE.value.map((item, index) => (
                <div key={index}>
                  <h4>{item.value.TITLE_HTU.value}</h4>
                  <p className="section-description">
                    {item.value.CONTENT_HTU.value}
                  </p>
                  {item.value.EXAMPLE_HTU.value && (
                    <Code code={item.value.EXAMPLE_HTU.value} />
                  )}
                </div>
              ))}
            </section>
            <div className="divider" />
            {/* example section */}
            <section className="section" id="example">
              <div className="section-header">Example</div>
              <p className="section-description">{DESCRIPTIONS_EXP.value}</p>
              {EXAMPLE.value.map((item, index) => (
                <div key={index}>
                  <h4>{item.value.TITLE_EXP.value}</h4>
                  <p className="section-description">
                    {item.value.CONTENT_EXP.value}
                  </p>
                  {item.value.EXAMPLE_EXP.value && (
                    <Code code={item.value.EXAMPLE_EXP.value} />
                  )}
                </div>
              ))}
            </section>
            {/* suggestion section */}
            <section className="section" id="suggestion">
              <div className="section-header">Suggestion</div>
              <p className="section-description">{DESCRIPTIONS_SGT.value}</p>
            </section>

            {/* Attachment section */}
            <section className="section" id="attachment">
              <div className="section-header">Attachment</div>
              <div className="link-group">
                {fileUrls &&
                  fileUrls.map((file, index) => (
                    <div className="link-item" key={index}>
                      <a
                        href={file.url}
                        download={file.name}
                        className="link"
                        key={file.fileKey}
                      >
                        {file.name}
                      </a>
                      <span>({formatFileSize(parseInt(file.size))})</span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Reference section */}
            <section className="section" id="reference">
              <div className="section-header">Reference</div>
              <p className="section-description">{REFERENCE.value}</p>
            </section>
            <section className="section" id="reference">
              <div className="section-header">Create By </div>
              <p className="section-description">{CerateBy.value}</p>
            </section>
          </div>
          <div className="table-of-content">
            <h5>Table of contents</h5>
            <ul className="content-list">
              <li className="list-item">
                <a href="#overview">Overview</a>
              </li>
              <li className="list-item">
                <a href="#installation">Installation</a>
              </li>
              <li className="list-item">
                <a href="#how_to_use">How to use</a>
              </li>
              <li className="list-item">
                <a href="#example">Example</a>
              </li>
              <li className="list-item">
                <a href="#suggestion">Suggestion</a>
              </li>
            </ul>
          </div>
        </main>
      )}
    </>
  );
}

export default MainContent;
