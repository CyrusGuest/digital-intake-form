import React, { useState } from "react";
import ummhLogo from "./images/ummhLogo.png";
import axios from "axios";
import Loading from "./components/Loading";
import { toast } from "react-toastify";

function App() {
  const [loading, setLoading] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [requestType, setRequestType] = useState(null);
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [url, setUrl] = useState("");
  const [severity, setSeverity] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [ticketID, setTicketID] = useState(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);

  const lambdaUrl =
    "https://1y7dwhyt4g.execute-api.us-east-1.amazonaws.com/development/create-issue"; // Replace with your Lambda function URL

  const handleFileChange = (e) => {
    const fileList = [...e.target.files];
    const encodedFiles = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64String = reader.result.replace(/^data:(.*;base64,)?/, "");

        encodedFiles.push({
          name: file.name,
          mimeType: file.type,
          content: base64String,
        });

        // Check if we've processed all files
        if (encodedFiles.length === fileList.length) {
          setFiles(encodedFiles);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const urlPattern =
      /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=%]*)?$/;

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (email === "" || summary === "" || requestType === null) {
      return toast.error("Please fill out all required fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (url !== "") {
      if (!urlPattern.test(url)) {
        return toast.error("Please enter a valid URL", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }

    // Check if URL is empty
    if (!url.trim()) {
      setShowUrlDialog(true);
      return;
    }

    finishSubmission();
  };

  const finishSubmission = async () => {
    setEmail("");
    setSummary("");
    setDescription("");
    setStepsToReproduce("");
    setUrl("");
    setRequestType(null);
    setSeverity(null);
    setDueDate(null);
    setShowUrlDialog(false);
    setLoading(true);

    let data = {
      email,
      summary,
      description,
      requestType,
      stepsToReproduce,
      url,
      severity,
      duedate: dueDate,
    };

    if (files.length > 0) data.uploadedFiles = files;

    try {
      const response = await axios.post(lambdaUrl, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Successfully submitted new ticket 🎉", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTicketID(response.data.ticketID);

      setLoading(false);
      setTicketSubmitted(true);
    } catch (error) {
      toast.error(
        "Ticket submission failed. Contact Digital Services for assistance",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  if (ticketSubmitted)
    return (
      <div className="md:mt-8 md:mb-32 mx-auto md:shadow-2xl rounded-lg p-6 w-full md:w-2/3 lg:w-1/2">
        <img className="max-w-sm" src={ummhLogo} alt="UMMH Logo" />
        <h1 className="font-bold text-2xl mt-2">Digital Intake Form</h1>
        <h3 className="text-2xl mt-4">
          Your ticket{" "}
          <span className="font-bold text-[#10069f]">{ticketID}</span> has been
          submitted.
        </h3>
        <p className="text-sm text-gray-600">
          The digital services team will be in contact you via email.
        </p>

        <button
          className="shadow-lg font-bold rounded-lg w-full md:w-auto p-3 mt-5 bg-[#10069f] text-white hover:bg-white hover:text-[#10069f] transition-all duration-200"
          onClick={() => {
            setTicketSubmitted(false);
          }}
        >
          Submit another ticket
        </button>
      </div>
    );

  return (
    <div>
      {showUrlDialog && (
        <div className="fixed max-w-md inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-95">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="mb-4">
              Are you sure there is no associated URL with your request?
              Providing a URL greatly aids the Digital Services team in
              assisting with your request.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="shadow-lg font-bold rounded-lg w-full md:w-auto py-3 px-5 mt-5 bg-[#10069f] text-white hover:bg-white hover:text-[#10069f] transition-all duration-200"
                onClick={() => setShowUrlDialog(false)}
              >
                Go Back
              </button>
              <button
                className="shadow-lg font-bold rounded-lg w-full md:w-auto py-3 px-5 mt-5 bg-[#10069f] text-white hover:bg-white hover:text-[#10069f] transition-all duration-200"
                onClick={finishSubmission}
              >
                Submit Anyways
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`md:mt-8 md:mb-32 mx-auto md:shadow-2xl rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 ${
          showUrlDialog ? "opacity-50" : ""
        }`}
      >
        <img className="max-w-sm" src={ummhLogo} alt="UMMH Logo" />
        <h1 className="font-bold text-2xl mt-2">Digital Intake Form</h1>

        {loading ? (
          <Loading />
        ) : (
          <form className="flex flex-col mt-4 gap-6 md:mx-auto">
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="email">
                Email<span className="text-red-600">*</span>
              </label>
              <input
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="text"
                placeholder="john.doe@umassmemorial.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="summary">
                Summary<span className="text-red-600">*</span>
              </label>
              <p className="text-sm text-gray-600">
                A quick, one sentence summary of the request
              </p>
              <input
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="text"
                placeholder="Short answer text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="description">
                Description
              </label>
              <p className="text-sm text-gray-600">
                A more thorough explanation of what you are requesting
              </p>
              <textarea
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="text"
                placeholder="Long answer text"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="requestType">
                Request Type<span className="text-red-600">*</span>
              </label>

              <fieldset className="flex flex-col gap-2">
                <div className="flex mt-2">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="requestType"
                      id="bug"
                      value="Bug/Broken functionality"
                      checked={requestType === "Bug/Broken functionality"}
                      onChange={(e) => setRequestType(e.target.value)}
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label htmlFor="bug" className="font-medium text-gray-900">
                      Bug
                    </label>
                    <p
                      id="bug-description"
                      className="text-xs font-normal text-gray-500"
                    >
                      A functionality is not working as expected.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="requestType"
                      id="improvement"
                      value="Improvement to existing feature/page"
                      checked={
                        requestType === "Improvement to existing feature/page"
                      }
                      onChange={(e) => setRequestType(e.target.value)}
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label
                      htmlFor="improvement"
                      className="font-medium text-gray-900"
                    >
                      Improvement
                    </label>
                    <p
                      id="improvement-description"
                      className="text-xs font-normal text-gray-500"
                    >
                      Enhance a current feature or page.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="requestType"
                      id="new"
                      value="New feature/page request"
                      checked={requestType === "New feature/page request"}
                      onChange={(e) => setRequestType(e.target.value)}
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label htmlFor="new" className="font-medium text-gray-900">
                      New Feature/Page
                    </label>
                    <p
                      id="new-description"
                      className="text-xs font-normal text-gray-500"
                    >
                      Request for a completely new feature or page.
                    </p>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="stepstoreproduce">
                Steps to Reproduce
              </label>
              <p className="text-sm text-gray-600">
                If you are encountering an issue, please outline how you came to
                what you are seeing and what the expected result is
              </p>
              <textarea
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="text"
                placeholder="Long answer text"
                rows="4"
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="url">
                URL
              </label>
              <p className="text-sm text-gray-600">
                Please provide the full URL of where you are seeing the issue or
                requesting changes (format: https://www.website.com)
              </p>
              <input
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="text"
                placeholder="Short answer text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="severity">
                Severity
              </label>

              <fieldset className="flex flex-col gap-2">
                <div class="flex mt-2">
                  <div class="flex items-center h-5">
                    <input
                      aria-describedby="helper-radio-text"
                      type="radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="severity"
                      id="highest"
                      value="Highest - Critical functionality is broken and a fix is needed as soon as possible"
                      checked={
                        severity ===
                        "Highest - Critical functionality is broken and a fix is needed as soon as possible"
                      }
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                  </div>
                  <div class="ml-2 text-sm">
                    <label for="highest" class="font-medium text-gray-900 ">
                      Highest
                    </label>
                    <p id="highest" class="text-xs font-normal text-gray-500">
                      Critical functionality is broken and a fix is needed as
                      soon as possible
                    </p>
                  </div>
                </div>

                <div class="flex">
                  <div class="flex items-center h-5">
                    <input
                      aria-describedby="helper-radio-text"
                      type="radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="severity"
                      id="high"
                      value="High - Functionality is limited and/or a deadline is quickly approaching"
                      checked={
                        severity ===
                        "High - Functionality is limited and/or a deadline is quickly approaching"
                      }
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                  </div>
                  <div class="ml-2 text-sm">
                    <label for="high" class="font-medium text-gray-900 ">
                      High
                    </label>
                    <p id="high" class="text-xs font-normal text-gray-500">
                      Functionality is limited and/or a deadline is quickly
                      approaching
                    </p>
                  </div>
                </div>

                <div class="flex">
                  <div class="flex items-center h-5">
                    <input
                      aria-describedby="helper-radio-text"
                      type="radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="severity"
                      id="medium"
                      value="Medium - A workaround exists and this issue can be addressed in the next development cycle"
                      checked={
                        severity ===
                        "Medium - A workaround exists and this issue can be addressed in the next development cycle"
                      }
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                  </div>
                  <div class="ml-2 text-sm">
                    <label for="medium" class="font-medium text-gray-900 ">
                      Medium
                    </label>
                    <p id="medium" class="text-xs font-normal text-gray-500">
                      A workaround exists and this issue can be addressed in the
                      next development cycle
                    </p>
                  </div>
                </div>

                <div class="flex">
                  <div class="flex items-center h-5">
                    <input
                      aria-describedby="helper-radio-text"
                      type="radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      name="severity"
                      id="low"
                      value="Low - A workaround exists and there is no immediate deadline, this can be worked on in the future"
                      checked={
                        severity ===
                        "Low - A workaround exists and there is no immediate deadline, this can be worked on in the future"
                      }
                      onChange={(e) => setSeverity(e.target.value)}
                    />
                  </div>
                  <div class="ml-2 text-sm">
                    <label for="low" class="font-medium text-gray-900 ">
                      Low
                    </label>
                    <p id="highest" class="text-xs font-normal text-gray-500">
                      A workaround exists and there is no immediate deadline,
                      this can be worked on in the future
                    </p>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="duedate">
                Due Date
              </label>
              <input
                className="outline-none box-border rounded-lg p-2 mt-1 border-2  shadow-lg focus:border-[#10069f] placeholder-[#333B4D] transition-all ease-linear duration-200"
                type="date"
                value={dueDate || ""}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold" htmlFor="export">
                Submit any relevant attachments below
              </label>
              <input
                className="mt-1"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col">
              <button
                className="shadow-lg w-fit mx-auto font-bold rounded-lg py-3 px-12   mt-5 bg-[#10069f] text-white hover:bg-white hover:text-[#10069f] transition-all duration-200"
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
                Submit ticket
              </button>
              <p className="text-sm text-gray-500 text-center mt-3">
                The Digital Services team will reach out via email at
                DigitalWeb@umassmemorial.org.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
