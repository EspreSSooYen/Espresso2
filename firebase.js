import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//
// Firebase config
//

const firebaseConfig = {
  apiKey: "AIzaSyC3bTT7kXqbJhqIJYzaD1GOkY9g__aoBCQ",
  authDomain: "car-booking-76217.firebaseapp.com",
  projectId: "car-booking-76217",
  storageBucket: "car-booking-76217.firebasestorage.app",
  messagingSenderId: "259020637364",
  appId: "1:259020637364:web:f5dc83c1b2ec1b2e2303e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//
// สุ่มรหัสการจอง
//

function generateCode() {

  const random =
  Math.floor(100000 + Math.random() * 900000);

  return "BK-" + random;

}

//
// เลือกเวลา (เฉพาะหน้าจอง)
//

let selectedTime = "";

const timeButtons =
document.querySelectorAll(".time-btn");

if (timeButtons.length > 0) {

  timeButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

      timeButtons.forEach((b) => {

        b.classList.remove(
          "bg-amber-800",
          "text-white"
        );

        b.classList.add(
          "bg-amber-200"
        );

      });

      btn.classList.remove(
        "bg-amber-200"
      );

      btn.classList.add(
        "bg-amber-800",
        "text-white"
      );

      selectedTime =
      btn.dataset.time;

    });

  });

}

//
// ปุ่มยืนยันการจอง (เฉพาะหน้า CarBooking)
//

const confirmBtn =
document.getElementById("confirmBtn");

if (confirmBtn) {

  confirmBtn.addEventListener("click", async () => {

    const date =
    document.getElementById("date").value;

    const name =
    document.getElementById("name").value;

    const phone =
    document.getElementById("phone").value;

    if (!date || !name || !phone || !selectedTime) {

      alert("กรุณากรอกข้อมูลให้ครบ และเลือกเวลา");

      return;

    }

    const code =
    generateCode();

    await addDoc(
      collection(db, "bookings"),
      {
        date,
        time: selectedTime,
        name,
        phone,
        code,
        createdAt: new Date()
      }
    );

    alert(
      "จองสำเร็จ รหัสของคุณคือ: "
      + code
    );

  });

}

//
// SEARCH FUNCTION (ใช้ร่วมกัน)
//

async function searchBooking(codeInputId) {

  const code =
  document.getElementById(codeInputId).value;

  const result =
  document.getElementById("result");

  result.innerHTML = "";

  if (!code) {

    alert("กรุณากรอกรหัสการจอง");

    return;

  }

  try {

    const q =
    query(
      collection(db, "bookings"),
      where("code", "==", code)
    );

    const snapshot =
    await getDocs(q);

    if (snapshot.empty) {

      result.innerHTML =
      "<p class='text-red-500 mt-3'>ไม่พบข้อมูลการจอง</p>";

      return;

    }

    snapshot.forEach((doc) => {

      const data =
      doc.data();

      result.innerHTML += `

      <div class="bg-white border rounded-xl p-4 shadow-md mt-3">

      <p><b>รหัส:</b> ${data.code}</p>

      <p><b>ชื่อ:</b> ${data.name}</p>

      <p><b>เบอร์:</b> ${data.phone}</p>

      <p><b>วันที่:</b> ${data.date}</p>

      <p><b>เวลา:</b> ${data.time}</p>

      </div>

      `;

    });

  }

  catch (error) {

    console.error(error);

    result.innerHTML =
    "<p class='text-red-500'>เกิดข้อผิดพลาด</p>";

  }

}

//
// ปุ่ม Search Desktop
//

const searchBtn =
document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    searchBooking("searchCode");

  });

}

//
// ปุ่ม Search Mobile
//

const searchBtnMobile =
document.getElementById("searchBtnMobile");

if (searchBtnMobile) {

  searchBtnMobile.addEventListener("click", () => {

    searchBooking("searchCodeMobile");

  });

}