import React from "react";
import { Link } from "react-router-dom";
import { FileDown, KeyRound, User2 } from "lucide-react";
import closeBtn from "../assets/close-btn-light.png";

export default function SettingsPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0b2132] flex flex-col">
      {/* Top Bar */}
      <div className="h-[20vh] w-full bg-gradient-to-r from-sky-400/20 to-teal-300/20 backdrop-blur-lg shadow-md flex items-center justify-between px-6">
        <h1 className="text-white text-3xl font-bold">
          Se<span className="text-cyan-300">ttings</span>
        </h1>
        <Link to="/">
          <button className="bg-transparent border-0 cursor-pointer">
            <img src={closeBtn} alt="Close" className="w-8 h-8" />
          </button>
        </Link>
      </div>

      {/* Settings Options */}
      <div
        className="flex flex-col items-center justify-center gap-6 flex-grow px-6
        animate-fade-in"
      >
        {/* Edit Profile */}
        <button
          className="w-full max-w-md flex items-center gap-4 px-6 py-4
          rounded-xl text-white text-lg font-semibold
          border border-white/20 bg-white/10 backdrop-blur-lg
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,200,0.5)]
          transition"
        >
          <User2 className="text-cyan-300" size={22} />
          Edit Profile
        </button>

        {/* Change Password */}
        <button
          className="w-full max-w-md flex items-center gap-4 px-6 py-4
          rounded-xl text-white text-lg font-semibold
          border border-white/20 bg-white/10 backdrop-blur-lg
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,200,0.5)]
          transition"
        >
          <KeyRound className="text-cyan-300" size={22} />
          Change Password
        </button>

        {/* Download PDF */}
        <button
          className="w-full max-w-md flex items-center gap-4 px-6 py-4
          rounded-xl text-white text-lg font-semibold
          border border-white/20 bg-white/10 backdrop-blur-lg
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,200,0.5)]
          transition"
        >
          <FileDown className="text-cyan-300" size={22} />
          Download PDF
        </button>
      </div>
    </div>
  );
}
