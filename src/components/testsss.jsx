import "./Login.css";
import "./Spinner.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import logo from "../assets/systory-logo.png"; // Adjust the path according to your project structure

const Login = (props) => {
  const [userInput, setUserInput] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(props);
  const { records } = props;
  console.log("records ==========", records);

  useEffect(() => {
    // if (sessionStorage.getItem("username") && records) {
    //   navigate(`/content?id=${records[0].$id.value}`);
    // }

    if (sessionStorage.getItem("username") && records && records.length > 0) {
      navigate(`/content?id=${records[0].$id.value}`);
    }
  }, []);

  const onLogin = async () => {
    setLoading(true);
    try {
      if (!userInput || !password) return;

      const response = await axios.post("http://localhost:3001/getUser", {
        userInput,
        password,
      });
      console.log("data User ==== ", response);
      let Users = response.data.data.records;
      console.log("records: 00000000000", records);
      // if (Users.length > 0) {
      //   sessionStorage.setItem("username", Users[0].NAME.value);
      //   sessionStorage.setItem("admin", Users[0].USER_ROLE.value);
      // }

      if (Users.length > 0) {
        sessionStorage.setItem("username", Users[0].NAME.value);
        sessionStorage.setItem("admin", Users[0].USER_ROLE.value);

        // if (records && records.length > 0) {
        //   // window.location.href = `/AddLibrary`;
        //   navigate(`/AddLibrary`);
        // } else if (records && records.length < 0) {
        //   navigate(`/content?id=${records[0].$id.value}`);
        // }
      } else {
        return;
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      {loading && <Spinner />}
      {/* {records && records.length > 0 && ( */}
      <div className="form-login">
        <div className="box">
          <h1 className="text-center">Login to website</h1>
          <form>
            <div className="form-group">
              <label className="form-label fw-bold" htmlFor="email">
                Username or Email
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Name or Email"
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label fw-bold" htmlFor="password">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
            </div>
            <button
              className="btn"
              type="button"
              name="signin"
              style={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                textAlign: "center",
                fontSize: "18px",
              }}
              onClick={() => onLogin()}
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Login;








import "./Header.css";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./Spinner.css";
import Spinner from "./Spinner";
// import { useLocation } from "react-router-dom";
function Header({ records }) {
  const [loading, setLoading] = useState(false);
  // const [showEditDelete, setShowEditDelete] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location :", location);
  const query = new URLSearchParams(location.search);
  const LibraryId = query.get("id");
  let libraryData = records.find((item) => item.$id.value === LibraryId);
  let username =
    libraryData && libraryData.CerateBy && libraryData.CerateBy.value;
  const loggedInUsername = sessionStorage.getItem("username");
  const loggedInUsernameRole = sessionStorage.getItem("admin");
  // check username according ID and get name
  let CheckUserLogin = username === loggedInUsername;
  // check delete Lirbary
  let CheckUserDelete = loggedInUsernameRole === "admin";

  function onLogout() {
    sessionStorage.removeItem("username");
    window.location.reload();
    navigate("/");
  }

  //create function click hidden button
  // const handleAddLibrary = () => {
  //   setShowEditDelete(false);
  // };

  // if (!records && records.length > 0) return;
  // useEffect(() => {
  //   if (handleDelete && records) {
  //     navigate(`/content?id=${records[0].$id.value}`);
  //   }
  // }, [handleDelete, records]);

  // function delete
  const handleDelete = async (id) => {
    setLoading(true);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success swal2-confirm",
        cancelButton: "btn btn-danger swal2-cancel",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Do you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(
              `http://localhost:3001/delete/record/${id}`
            );
            swalWithBootstrapButtons
              .fire({
                title: "Deleted!",
                text: "",
                // text: response.data.message,
                icon: "success",
              })
              .then(() => {
                window.location.reload();
                navigate(`/content?id=${records[0].$id.value}`);
              });
          } catch (error) {
            console.error("Error deleting record:", error);
            swalWithBootstrapButtons.fire({
              title: "Error",
              text: "There was an error deleting the record.",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons
            .fire({
              title: "Cancelled",
              text: "",
              icon: "error",
            })
            .then(() => {
              // window.location.reload();
              // Check when deleting records is to navigate to the first records
              // if (records && records.length > 0) {
              //   navigate(`/content?id=${libraryData}`);
              // }
              window.location.href = `/content?id=${id}`;
            });
        }
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Spinner />}

      <header className="header">
        <nav className="navbar">
          <div className="logo">
            {records && records.length > 0 && (
              <NavLink to={`/content?id=${records[0].$id.value}`}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/cae4fb078c75a656bef67378beae8c2fee523fff5a7fff8caed98f6ea5f85c35?apiKey=b53945e59ede4d0cb34670777c19b8a0&"
                  alt="Systory Library Logo"
                />
                <div className="logo-text">Systory Library</div>
              </NavLink>
            )}
          </div>
          <div className="navbar-actions">
            {/* <input placeholder="Search" type="text"/> */}
            {/* {CheckUserDelete && showEditDelete && (
              <NavLink to={`/DeleteLibrary?id=${LibraryId}`}>
                <button
                  className="edit-library"
                  onClick={() => handleDelete(`${LibraryId}`)}
                  disabled={loading}
                >
                  Delete Library
                </button>
              </NavLink>
            )}

            {CheckUserLogin && showEditDelete && (
              <NavLink to={`/EditLibrary?id=${LibraryId}`}>
                <button className="edit-library">Edit Library</button>
              </NavLink>
            )} */}

            {location.pathname !== "/AddLibrary" && (
              <>
                {CheckUserDelete && (
                  <NavLink to={`/DeleteLibrary?id=${LibraryId}`}>
                    <button
                      className="edit-library"
                      onClick={() => handleDelete(LibraryId)}
                      disabled={loading}
                    >
                      Delete Library
                    </button>
                  </NavLink>
                )}

                {CheckUserLogin && (
                  <NavLink to={`/EditLibrary?id=${LibraryId}`}>
                    <button className="edit-library">Edit Library</button>
                  </NavLink>
                )}
              </>
            )}

            <NavLink to="/AddLibrary">
              <button className="add-library">Add Library</button>
            </NavLink>
            <button className="logout" onClick={() => onLogout()}>
              Log out
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;

