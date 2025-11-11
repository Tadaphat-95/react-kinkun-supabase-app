import React, { useState, useEffect } from "react";
import food from "../assets/food.png";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../lib/SubaseClient";

export default function EditKinkun() {
  const { id } = useParams();
  const [food_name, setfood_name] = useState("");
  const [food_where, setfood_where] = useState("");
  const [food_pay, setfood_pay] = useState("");
  const [food_file, setfood_file] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); // เก็บ url รูปเดิม
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKinkun = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire({
          icon: "warning",
          iconColor: "blue",
          title: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "green",
        });
      } else {
        setfood_name(data.what);
        setfood_where(data.where);
        setfood_pay(data.pay.toString());
        setExistingImageUrl(data.image_url || "");
      }
    };

    fetchKinkun();
  }, [id]);

  const waningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      title: msg,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "blue",
    });
  };

  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      title: msg,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "blue",
    });
  };

  const HandleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    if (file) setfood_file(file);
  };

  const handleSaveUpdateClick = async (e) => {
    e.preventDefault();

    // Validate
    if (!food_name.trim()) return waningAlert("กรุณากรอกของกิน");
    if (!food_where.trim()) return waningAlert("กรุณากรอกกินที่ไหน");
    if (!food_pay.trim() || isNaN(food_pay))
      return waningAlert("กรุณากรอกราคาให้ถูกต้อง");

    let food_image_url = existingImageUrl;

    try {
      // Upload new image ถ้ามีการเลือกรูปใหม่
      if (food_file) {
        // ลบรูปเก่าก่อน (ถ้ามี)
        if (existingImageUrl) {
          const urlParts = existingImageUrl.split("/");
          const oldImageName = urlParts[urlParts.length - 1];
          await supabase.storage.from("kinkunBK").remove([oldImageName]);
        }

        const newFileName = Date.now() + "-" + food_file.name;
        const { error: uploadError } = await supabase.storage
          .from("kinkunBK")
          .upload(newFileName, food_file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("kinkunBK")
          .getPublicUrl(newFileName);

        food_image_url = publicUrlData.publicUrl;
      }

      // Update ข้อมูลในฐานข้อมูล
      const { error: updateError } = await supabase
        .from("kinkun_tb")
        .update({
          what: food_name,
          where: food_where,
          pay: parseFloat(food_pay),
          image_url: food_image_url,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      successAlert("บันทึกข้อมูลสำเร็จ!");
      navigate("/ShowAllKinkun");
    } catch (error) {
      console.error(error);
      waningAlert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <div className="w-10/12 md:w-1/2 lg:w-1/3 mx-auto border-gray-300 p-6 shadow-md my-10 rounded-lg">
      <h1 className="text-2xl font-bold text-center text-blue-700">
        Kinkun APP (Supabase)
        <br />
        แก้ไขข้อมูลการกิน
      </h1>

      <img src={food} alt="food" className="block mx-auto w-20 mt-3" />

      <div className="mt-3">
        <label>กินอะไร</label>
        <input
          value={food_name}
          onChange={(e) => setfood_name(e.target.value)}
          placeholder="เช่น pizza , kfc , ...."
          type="text"
          className="border border-gray-400 w-full p-2 mt-1 rounded"
        />
      </div>

      <div className="mt-3">
        <label>กินที่ไหน</label>
        <input
          value={food_where}
          onChange={(e) => setfood_where(e.target.value)}
          placeholder="เช่น kfc หนองแขม , pizza บางบอน , ..."
          type="text"
          className="border border-gray-400 w-full p-2 mt-1 rounded"
        />
      </div>

      <div className="mt-3">
        <label>กินไปเท่าไร</label>
        <input
          value={food_pay}
          onChange={(e) => setfood_pay(e.target.value)}
          placeholder="เช่น 100 , 299.50 , ..."
          type="text"
          className="border border-gray-400 w-full p-2 mt-1 rounded"
        />
      </div>

      <div className="mt-3">
        <label>เลือกรูปกิน</label>
        <br />
        <br />
        <input
          onChange={HandleSelectImageAndPreview}
          type="file"
          className="hidden"
          id="selectImage"
        />
        <label
          htmlFor="selectImage"
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          เลือกรูป
        </label>

        {/* แสดงรูป preview ถ้ามีการเลือกรูปใหม่ */}
        {food_file ? (
          <>
            <p className="mt-2 text-sm text-gray-600">{food_file.name}</p>
            <img
              src={URL.createObjectURL(food_file)}
              alt="preview"
              className="w-32 h-32 mt-2 object-cover rounded"
            />
          </>
        ) : (
          // ถ้าไม่มีรูปใหม่ ให้แสดงรูปเดิมถ้ามี
          existingImageUrl && (
            <img
              src={existingImageUrl}
              alt="รูปอาหารเดิม"
              className="w-32 h-32 mt-2 object-cover rounded"
            />
          )
        )}
      </div>

      <div className="mt-5">
        <button
          onClick={handleSaveUpdateClick}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full"
        >
          แก้ไขการกิน
        </button>
      </div>

      <Footer />
    </div>
  );
}
