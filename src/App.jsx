import React, { useState } from "react";
import ummhLogo from "./images/ummhLogo.png";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [requestType, setRequestType] = useState(null);
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [url, setUrl] = useState("");
  const [severity, setSeverity] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const lambdaUrl =
    "https://1y7dwhyt4g.execute-api.us-east-1.amazonaws.com/development/create-issue"; // Replace with your Lambda function URL

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    console.log(data);

    try {
      const response = await axios.post(lambdaUrl, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 mx-auto shadow-lg rounded-lg p-6 w-full md:w-2/3 lg:w-1/2">
      <img className="max-w-sm" src={ummhLogo} alt="UMMH Logo" />
      <h1 className="font-bold text-2xl mt-2">Digital Intake Form</h1>
      {/* <p className="text-sm text-gray-500">
        By Digital Services Intern{" "}
        <a
          href="https://www.linkedin.com/in/cyrus-guest-3a3b6a258/"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold text-[#10069f]"
        >
          Cyrus Guest
        </a>{" "}
        & Digital Coordinator Brandon Boucher
      </p> */}

      <form className="flex flex-col mt-4 gap-6 md:mx-auto">
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="email">
            Email*
          </label>
          <input
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
            type="text"
            placeholder="john.doe@umassmemorial.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="summary">
            Summary*
          </label>
          <p className="text-sm text-gray-600">
            A quick, one sentence summary of the request
          </p>
          <input
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
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
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
            type="text"
            placeholder="Long answer text"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="request">
            Request Type*
          </label>

          <fieldset className="flex flex-col gap-1">
            <div className="flex gap-2">
              <input
                type="radio"
                name="requestType"
                id="bug"
                value="Bug/Broken functionality"
                checked={requestType === "Bug/Broken functionality"}
                onChange={(e) => setRequestType(e.target.value)}
              />
              <label htmlFor="bug">Bug/Broken functionality</label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="requestType"
                id="improvement"
                value="Improvement to existing feature/page"
                checked={requestType === "Improvement to existing feature/page"}
                onChange={(e) => setRequestType(e.target.value)}
              />
              <label htmlFor="improvement">
                Improvement to existing feature/page
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="requestType"
                id="new"
                value="New feature/page request"
                checked={requestType === "New feature/page request"}
                onChange={(e) => setRequestType(e.target.value)}
              />
              <label htmlFor="new">New feature/page request</label>
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
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
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
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
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
            <div className="flex gap-2">
              <input
                type="radio"
                name="severity"
                id="highest"
                value="Highest - Critical functionality is broken and a fix is needed
                as soon as possible"
                checked={
                  severity ===
                  "Highest - Critical functionality is broken and a fix is needed as soon as possible"
                }
                onChange={(e) => setSeverity(e.target.value)}
              />
              <label htmlFor="highest">
                Highest - Critical functionality is broken and a fix is needed
                as soon as possible
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="severity"
                id="high"
                value="High - Functionality is limited and/or a deadline is quickly
                approaching"
                checked={
                  severity ===
                  "High - Functionality is limited and/or a deadline is quickly approaching"
                }
                onChange={(e) => setSeverity(e.target.value)}
              />
              <label htmlFor="high">
                High - Functionality is limited and/or a deadline is quickly
                approaching
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="severity"
                id="medium"
                value="Medium - A workaround exists and this issue can be addressed in
                the next development cycle"
                checked={
                  severity ===
                  "Medium - A workaround exists and this issue can be addressed in the next development cycle"
                }
                onChange={(e) => setSeverity(e.target.value)}
              />
              <label htmlFor="medium">
                Medium - A workaround exists and this issue can be addressed in
                the next development cycle
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                name="severity"
                id="low"
                value="Low - A workaround exists and there is no immediate deadline,
                this can be worked on in the future"
                checked={
                  severity ===
                  "Low - A workaround exists and there is no immediate deadline, this can be worked on in the future"
                }
                onChange={(e) => setSeverity(e.target.value)}
              />
              <label htmlFor="low">
                Low - A workaround exists and there is no immediate deadline,
                this can be worked on in the future
              </label>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col">
          <label className="font-bold" htmlFor="duedate">
            Due Date
          </label>
          <input
            className="outline-none placeholder-white border-none shadow-lg rounded-lg p-2 mt-1 text-white bg-[#10069f] focus:bg-white focus:text-[#10069f] focus:placeholder-[#10069f] transition-all duration-200"
            type="date"
            value={dueDate || ""}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* <label className="font-bold mt-8" htmlFor="export">
          Select the daily export file for input
        </label>
        <input className="mt-1" type="file" />
        <label className="font-bold mt-8" htmlFor="export">
          Output directory:{" "}
          <span className="truncate text-[#10069f] font-normal"></span>
        </label>
        <button
          className="rounded-lg p-3 mt-1 shadow-lg bg-[#10069f] text-white font-bold hover:bg-white hover:text-[#10069f] transition-all duration-200"
          type="button"
        >
          Select directory
        </button> */}
        <div className="flex flex-col">
          <button
            className="shadow-lg font-bold rounded-lg p-3 mt-5 bg-[#10069f] text-white hover:bg-white hover:text-[#10069f] transition-all duration-200"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit ticket
          </button>
          <p className="text-sm text-gray-500 text-center mt-3">
            The Digital Services team will reach out via email.
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;
