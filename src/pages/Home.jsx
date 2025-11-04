import React, { useState } from "react";
import food from "../assets/food.png";
import { FaFacebook, FaLine } from "react-icons/fa";
import { AiFillGithub } from "react-icons/ai";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  const [secureCode, setSecureCode] = useState("");
  const navigate = useNavigate();

  const handleAccessAppClick = () => {
    if (secureCode.trim() === "") {
      //alert('กรุณากรอกรหัสเข้าใช้งาน');
      Swal.fire({
        icon: "warning",
        iconColor: "black",
        title: "กรุณากรอกรหัสเข้าใช้งาน",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "blue",
      });
      return;
    }

    if (secureCode.toUpperCase() === "SAU") {
      navigate("/ShowAllKinkun");
    } else {
      //alert("รหัสเข้าใช้งานไม่ถูกต้อง");
      Swal.fire({
        icon: "warning",
        iconColor: "black",
        title: "กรุณากรอกรหัสเข้าใช้งาน",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "blue",
      });
      
    }
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          บันทึกการกิน
        </h1>
        <img src={food} alt="food" className="block mx-auto w-30 mt-5" />

        <input
          type="text"
          placeholder="Enter secure code"
          value={secureCode}
          onChange={(e) => setSecureCode(e.target.value)}
          className="p-3 border border-gray-400 rounded-md mt-5 w-full"
        />

        <button
          onClick={handleAccessAppClick}
          className="w-full bg-blue-700 p-3 rounded-md text-white mt-5 hover:bg-blue-800 cursor-pointer"
        >
          เข้าใช้งาน
        </button>

        <div className="mt-5 flex justify-center gap-5">
          <a href="#">
            <FaFacebook className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
          <a href="#">
            <FaLine className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
          <a href="#">
            <AiFillGithub className="text-2xl text-gray-500 hover:text-red-700" />
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
