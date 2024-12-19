import React, { useEffect, useState, useRef } from "react";
import "./Createblog.css";
import NavbarTeam from "../../../components/shared/Navbar/NavbarTeam";
import axios from "axios";
import moment from "moment-timezone";
import Footer from "../../../components/shared/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const Createblog = () => {
  const editor = useRef(null);
  const editor0 = useRef(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [tag, setTag] = useState("");
  const [tag2, setTag2] = useState("");
  const [topicpic, setTopicpic] = useState("");
  const [content, setContent] = useState("");
  const [writernmae, setWritername] = useState("");
  const [writerintro, setWriterintro] = useState("");
  const [writerpic, setWriterpic] = useState("");
  const [writeremail, setWriteremail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [disablecreate, setDisablecreate] = useState(false);
  const [authorid, setAuthorid] = useState("");

  const [socialMedia, setSocialMedia] = useState({});

  const location = useLocation();
  const isadminPage = location.pathname.includes("admin");

  const handleImgChange = (base64) => {
    setTopicpic(base64);
  };

  useEffect(() => {
    // document.title = "Create blog | ECELL NITS";
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Fetch user data and populate the form fields
      axios
        .get(`${import.meta.env.VITE_REACT_APP_APIMAIN}/fetchprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data;
          setWritername(user.name);
          setWriterintro(user.bio);
          setWriterpic(user.userimg);
          setWriteremail(user.email);
          setAuthorid(user._id);
        })
        .catch((error) => {
          console.error("Failed to fetch user data", error);
          // Handle error
        });
    }
  }, [navigate]);

  // get the social media links from the dashboard; and if atleast one is not present then navigate user to edit profile page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_APIMAIN}/dashboard`, config)
        .then((res) => {
          const { facebook, github, linkedin, instagram } = res.data;
          setSocialMedia({ facebook, github, linkedin, instagram });
          if (
            facebook === undefined &&
            github === undefined &&
            linkedin === undefined &&
            instagram === undefined
          ) {
            toast.error("Update your profile to contain atleast 1 social media profile", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            navigate("/editprofile");
          } else {
            console.log("everything is fine");
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  const iscreateblogempty = () => {
    return (
      title !== "" &&
      intro !== "" &&
      authorid !== "" &&
      tag !== "" &&
      writeremail !== "" &&
      content !== "" &&
      writernmae !== "" &&
      writerintro !== "" &&
      writerpic !== "" &&
      topicpic !== ""
    );
  };
  // console.log(`authorid:${authorid}`)
  /* button onclick function */
  const submitform = async (event) => {
    event.preventDefault();
    if (!iscreateblogempty()) {
      toast.error("Please fill all the required blog details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (!writeremail.includes("@") || !writeremail.includes(".")) {
      toast.error("Invalid email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const timestamp = moment().tz("Asia/Kolkata").format();
    setSubmitting(true);
    setDisablecreate(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_APIMAIN}/createblog`,
        {
          title,
          tag,
          intro,
          content,
          writernmae,
          writerintro,
          writerpic,
          timestamp,
          topicpic,
          writeremail,
          authorid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setTitle("");
          setIntro("");
          setTag("");
          setContent("");
          setWritername("");
          setWriterintro("");
          setWriterpic("");
          setTopicpic("");
          setWriteremail("");
          setSubmitting(false);
          setDisablecreate(false);
          toast.success("Blog created but publish subject to verification", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };

  return (
    <div>
      <Helmet>
        <title>{`Create Blog | E-CELL NIT Silchar`}</title>
        <meta name="description" content="E-CELL NIT SILCHAR" />
      </Helmet>
      {isadminPage || <NavbarTeam />}
      <div className="mainblogmake">
        <h2 className="titletopcbl">Add New Blog </h2>
        <div className="firstboxvreateblog">
          <h2 className="ttleinptcrteblog">Title</h2>
          <h4 className="specificttle">Be specific with your title</h4>
          <input
            type="text"
            id="cretaeblogsinpt"
            required
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Enter your title"
            className="input-common-recruit"
          />
        </div>

        <div className="firstboxvreateblog">
          <h2 className="ttleinptcrteblog">Brief Introduction</h2>
          <h4 className="specificttle">
            Write a brief introduction to your blog in about 40-50 words
          </h4>
          {/* <input
                        type="text"
                        required
                        id="cretaeblogsinpt"
                        value={intro}
                        onChange={(event) => {
                            setIntro(event.target.value);
                        }}
                        placeholder="Enter your intro"

                        className='input-common-recruit'
                    /> */}

          {/* <textarea cols="10" rows="5" id="cretaeblogsinpt" typeof='text' required
                        value={intro}
                        onChange={(event) => {
                            setIntro(event.target.value);
                        }}
                        placeholder="Enter your intro"
                        className='input-common-recruit' style={{ whiteSpace: "pre-wrap" }}></textarea> */}

          <JoditEditor
            ref={editor0}
            value={intro}
            onChange={(newIntro) => setIntro(newIntro)}
            onBlur={(newIntro) => setIntro(newIntro)}
            required
          />
        </div>

        <div className="firstboxvreateblog">
          <h2 className="ttleinptcrteblog">Content</h2>
          <h4 className="specificttle">Write about your topic</h4>
          {/* <textarea cols="30" rows="10" className='input-common-recruit' type="text"
                        required
                        id="cretaeblogsinpt"
                        value={content}
                        onChange={(event) => {
                            setContent(event.target.value);
                        }}
                    >
                    </textarea> */}

          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => setContent(newContent)}
            required
          />
        </div>

        <div className="firstboxvreateblog">
          <h2 className="ttleinptcrteblog">Tags</h2>
          <h4 className="specificttle">Add tags to describe your blog</h4>
          <h4 className="specificttle">(Separate tags by space like #tag1 #tag2)</h4>
          <input
            type="text"
            required
            value={tag}
            id="cretaeblogsinpt"
            onChange={(event) => {
              setTag(event.target.value);
            }}
            placeholder="Enter tags"
            className="input-common-recruit"
          />
        </div>

        {/* <div className="firstboxvreateblog">
                    <h2>Second tag</h2>
                    <h4 className='specificttle'>Add second tag</h4>
                    <input
                        type="text"
                        required
                        value={tag2}
                        onChange={(event) => {
                            setTag2(event.target.value);
                        }}
                        placeholder="Enter tag"
                        className='input-common-recruit'
                    />
                </div> */}

        <div className="firstboxvreateblog">
          <h2 className="ttleinptcrteblog">Topic picture</h2>
          <h4 className="specificttle">Add a picture to your blog</h4>
          {/* <input
                        type="text"
                        required
                        id="cretaeblogsinpt"
                        value={topicpic}
                        onChange={(event) => {
                            setTopicpic(event.target.value);
                        }}
                        placeholder="Enter image link"
                        className='input-common-recruit'
                    /> */}
          <h4 className="specificttle">
            Only jpg, jpeg, png, webp, or avif file types of size less than 300KB are
            accepted
          </h4>
          <FileBase64
            multiple={false}
            onDone={({ base64, file }) => {
              if (
                (file.type === "image/png" ||
                  file.type === "image/jpeg" ||
                  file.type === "image/jpg" ||
                  file.type === "image/webp" ||
                  file.type === "image/avif") &&
                file.size <= 300 * 1024
              ) {
                handleImgChange(base64);
              } else {
                toast.error(
                  "Invalid file type or size. Image should be less than 300 KB.",
                  {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  }
                );
                setTopicpic("");
              }
            }}
          >
            {({ file }) => (
              <div>
                {file && file.size <= 300 * 1024 && <p>Selected file: {file.name}</p>}
              </div>
            )}
          </FileBase64>
        </div>

        <div className="firstboxvreateblog" id="writerdivid">
          <h2 className="ttleinptcrteblog">Writer Details</h2>
          <h4 className="specificttle">Name</h4>
          <input
            type="text"
            id="cretaeblogsinpt"
            required
            value={writernmae}
            onChange={(event) => {
              setWritername(event.target.value);
            }}
            placeholder="Enter name"
            className="input-common-recruit"
          />

          <h4 className="specificttle">Email</h4>
          <input
            type="email"
            required
            value={writeremail}
            id="cretaeblogsinpt"
            onChange={(event) => {
              setWriteremail(event.target.value);
            }}
            placeholder="Enter your email"
            className="input-common-recruit"
          />

          <h4 className="specificttle">Brief Introduction</h4>
          {/* <input
                        type="text"
                        required
                        id="cretaeblogsinpt"
                        value={writerintro}
                        onChange={(event) => {
                            setWriterintro(event.target.value);
                        }}
                        placeholder="Enter intro to be displayed"
                        className='input-common-recruit'
                    /> */}

          <textarea
            rows="3"
            type="text"
            required
            id="cretaeblogsinpt"
            value={writerintro}
            onChange={(event) => {
              setWriterintro(event.target.value);
            }}
            placeholder="Enter intro to be displayed"
            className="input-common-recruit"
          ></textarea>

          <h4 className="specificttle">Photograph</h4>
          <input
            type="text"
            required
            id="cretaeblogsinpt"
            value={writerpic}
            onChange={(event) => {
              setWriterpic(event.target.value);
            }}
            placeholder="Your photograph link"
            className="input-common-recruit"
          />
        </div>

        <button
          onClick={submitform}
          className="kretrhereading"
          id="crteblogbtn0"
          disabled={disablecreate}
          style={{
            opacity: disablecreate ? 0.5 : 1,
            cursor: disablecreate ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Posting Blog" : "Post Blog"}{" "}
        </button>
      </div>
      {isadminPage || <Footer />}
    </div>
  );
};

export default Createblog;
