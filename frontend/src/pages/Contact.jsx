import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#05081c] text-white pt-28 pb-16 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold">
            Contact <span className="text-blue-500">RailCrowd</span>
          </h1>

          <p className="text-gray-400 text-xl mt-5">
            We'd love to hear your feedback and suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Details */}

          <div className="space-y-8">

            <div className="bg-[#131b31] p-6 rounded-2xl">
              <Mail className="text-blue-500 mb-4" size={34} />
              <h2 className="text-2xl font-bold">Email</h2>
              <p className="text-gray-400 mt-2">
                support@railcrowd.ai
              </p>
            </div>

            <div className="bg-[#131b31] p-6 rounded-2xl">
              <Phone className="text-green-500 mb-4" size={34} />
              <h2 className="text-2xl font-bold">Phone</h2>
              <p className="text-gray-400 mt-2">
                +91 98765 43210
              </p>
            </div>

            <div className="bg-[#131b31] p-6 rounded-2xl">
              <MapPin className="text-red-500 mb-4" size={34} />
              <h2 className="text-2xl font-bold">Location</h2>
              <p className="text-gray-400 mt-2">
                Bengaluru, Karnataka, India
              </p>
            </div>

          </div>

          {/* Contact Form */}

          <form
            onSubmit={handleSubmit}
            className="bg-[#131b31] p-8 rounded-2xl space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800 p-4 rounded-xl outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800 p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-slate-800 p-4 rounded-xl outline-none"
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-slate-800 p-4 rounded-xl outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl flex justify-center items-center gap-3 font-semibold"
            >
              <Send size={20} />
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;