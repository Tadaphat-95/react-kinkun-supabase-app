import React, { useState, useEffect } from "react";
import food from "../assets/food.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "../lib/SubaseClient";
import Swal from "sweetalert2";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(() => {
    fetchKinkuns();
  }, []);

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

  const HandleDeleteClick = async (id, food_image_url) => {
    const result = await Swal.fire({
      title: "คุณต้องการลบข้อมูลนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "red",
      cancelButtonColor: "gray",
    });

    if (result.isConfirmed) {
      // ลบไฟล์ภาพถ้ามี
      if (food_image_url) {
        // ดึงชื่อไฟล์จาก URL (สมมติชื่อไฟล์อยู่หลังสุดของ path)
        const urlParts = food_image_url.split("/");
        const imageName = urlParts[urlParts.length - 1];

        const { error: storageError } = await supabase.storage
          .from("kinkunBK")
          .remove([imageName]);

        if (storageError) {
          alert("เกิดข้อผิดพลาดในการลบไฟล์รูปภาพ กรุณาลองใหม่อีกครั้ง");
          return;
        }
      }

      // ลบข้อมูลในตาราง
      const { error: deleteError } = await supabase
        .from("kinkun_tb")
        .delete()
        .eq("id", id);

      if (deleteError) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
        return;
      }

      Swal.fire("ลบข้อมูลเรียบร้อยแล้ว", "", "success");
      fetchKinkuns(); // รีเฟรชข้อมูลหลังลบ
    }
  };

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
                  {!kinkun.food_img ? (
                    "-"
                  ) : (
                    <img
                      src={kinkun.food_img}
                      alt="รูปอาหาร"
                      className="w-12 h-12 object-cover"
                    />
                  )}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_name}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_where}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_pay} บาท
                </td>
                <td className="border border-gray-700 p-2">
                  {new Date(kinkun.created_at).toLocaleDateString("th-TH")}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <Link
                    to={`/EditKinkun/${kinkun.id}`}
                    className="text-green-600 mx-2 hover:underline"
                  >
                    แก้ไข
                  </Link>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() =>
                      HandleDeleteClick(kinkun.id, kinkun.food_img)
                    }
                  >
                    ลบ
                  </button>
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
