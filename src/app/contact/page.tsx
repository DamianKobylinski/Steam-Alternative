const Contact = () => {
  return (
    <div className="p-10">
      <p className="text-4xl text-white">Contact</p>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-start w-1/2">
          <form className="flex flex-col w-full" action="mailto:damiankob12@gmail.com?subject=Your+tip+on+mailto+links&body=Thanks+for+this+tip">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="mb-2 p-2 border border-gray-300 rounded text-black"
              required
            />
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              className="mb-2 p-2 border border-gray-300 rounded text-black"
              required
            />
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className="mb-2 p-2 border border-gray-300 rounded text-black"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
