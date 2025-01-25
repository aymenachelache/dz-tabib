import { useTranslation } from "react-i18next";
import './i18n'
import { useEffect } from "react";
import Cookies from "js-cookie";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/homePage/HomePage.jsx";
import './App.scss';
import { Login } from "./pages/login/Login.jsx";
import { SignUp } from "./pages/signUp/SignUp.jsx";
import { Doctors } from "./pages/doctors/Doctors.jsx";
import { DoctorProfile } from "./pages/doctorPofile/DoctorProfile.jsx";
import { AppointmentPage } from "./pages/appointmentPage/AppointmentPage.jsx";
import { BookingConfirmation } from "./pages/bookingConfirmation/BookingConfirmation.jsx";
import { ForgetPassword } from "./pages/forgetPassword/ForgetPassword.jsx";
import { ResetPassword } from "./pages/resetPassword/ResetPassword.jsx";
import { MyProfile } from "./pages/profile/Profile.jsx";
import { EditProfile } from "./pages/EditProfile/EditProfile.jsx";
import { EditWorkingDays } from "./workingDays/EditWorkingDays.jsx";
import { AddWorkingDay } from "./workingDays/AddWorkingDay.jsx";
import { WorkingDaysList } from "./workingDays/WorkingDayList.jsx";
import DoctorAppointment from "./pages/DoctorAppointment/DoctorAppointment.jsx";
import PatientAppointment from "./pages/PatientAppointment/patientAppointment.jsx";
import { SearchPage } from "./pages/SearchPage/SearchPage.jsx";

function App() {
  const { t, i18n } = useTranslation();
  const lng = Cookies.get("i18next") || "en";
  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [lng]);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage t={t} />} />
        <Route path="login" element={<Login t={t} />} />
        <Route path="forgetpassword" element={<ForgetPassword t={t} />} />
        <Route path="signup" element={<SignUp t={t} />} />
        <Route path="doctors" element={<Doctors t={t} />} />
        <Route path="doctor/:id" element={<DoctorProfile t={t} />} />
        <Route path="appointment/:id/:jj/:mm/:aaaa/:workingday" element={<AppointmentPage t={t} />} />
        <Route path="bookingconfirmation" element={<BookingConfirmation t={t} />} />
        <Route path="/reset-password" element={<ResetPassword t={t} />} />
        <Route path="/profile" element={<MyProfile t={t} />} />
        <Route path="/editprofile" element={<EditProfile t={t} />} />
        <Route path="/editwokringdays/:id" element={<EditWorkingDays t={t} />} />
        <Route path="/addworkingday/:id" element={<AddWorkingDay t={t} />} />
        <Route path="/workingdays/:id" element={<WorkingDaysList t={t} />} />
        <Route path="/appointments" element={<DoctorAppointment t={t} />} />
        <Route path="/myappointments" element={<PatientAppointment t={t} />} />
        <Route path="/search" element={<SearchPage t={t} />} />

        
      </Routes>
    </>
  );
}

export default App;
