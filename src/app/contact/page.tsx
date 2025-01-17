"use client";

import { useState } from "react";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const saveContact = async () => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, subject, message }),
    });
    const data = await response.json();
    console.log(data);
    setEmail("");
    setSubject("");
    setMessage("");
    window.location.reload();
  };

  return (
    <div className="p-10">
      <p className="text-4xl text-white">Contact</p>
      <div className="flex flex-col items-center justify-center mt-5">
        <div className="flex flex-col items-start w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="mb-2 p-2 border border-gray-300 rounded text-black"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            className="mb-2 p-2 border border-gray-300 rounded text-black"
            required
            onChange={(e) => setSubject(e.target.value)}
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            className="mb-2 p-2 border border-gray-300 rounded text-black"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={saveContact}
            className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!email || !subject || !message}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
