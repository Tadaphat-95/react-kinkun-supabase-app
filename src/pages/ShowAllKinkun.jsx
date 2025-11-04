import React, { useState, useEffect } from "react";
import food from "../assets/food.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "../lib/SubaseClient";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(() => {
    const fetchKinkuns = async () => {
      try {
        const { data, error } = await supabase
          .from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Fetch error:", error);
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } else {
          setKinkuns(data);
        }
      } catch (ex) {
        console.error("Unexpected error:", ex);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    };

    fetchKinkuns();
  }, []);

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลบันทึกการกิน
        </h1>
        <img src={food} alt="กินกัน" className="block mx-auto w-20 mt-5" />

        <div className="mt-8 flex justify-end">
          <Link
            to="/AddKinkun"
            className="mb-6 bg-blue-700 p-3 rounded hover:bg-blue-800 text-white"
          >
            เพิ่มการกิน
          </Link>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-700 p-2">รูป</th>
              <th className="border border-gray-700 p-2">กินอะไร</th>
              <th className="border border-gray-700 p-2">กินที่ไหน</th>
              <th className="border border-gray-700 p-2">กินไปเท่าไร</th>
              <th className="border border-gray-700 p-2">วันไหน</th>
              <th className="border border-gray-700 p-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {kinkuns.map((kinkun) => (
              <tr key={kinkun.id}>
                <td className="border border-gray-700 p-2">
                  <img
                    src={kinkun.image_url || food}
                    alt={kinkun.what}
                    className="w-12 h-12 object-cover"
                  />
                </td>
                <td className="border border-gray-700 p-2">{kinkun.what}</td>
                <td className="border border-gray-700 p-2">{kinkun.where}</td>
                <td className="border border-gray-700 p-2">{kinkun.pay} บาท</td>
                <td className="border border-gray-700 p-2">
                  {new Date(kinkun.created_at).toLocaleDateString("th-TH")}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <button className="text-blue-600 hover:underline mr-2">
                    แก้ไข
                  </button>
                  <button className="text-red-600 hover:underline">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
