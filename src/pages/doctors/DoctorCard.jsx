import PropTypes from 'prop-types';
import doctorImg from "./../../assets/doctor.jpg"
export const DoctorCard = ({ doctor, t }) => {
    return (
        <div className="bg-white hover:cursor-pointer hover:bg-blue-100 transition-all duration-300 ease-linear shadow-md p-6 rounded-lg mb-6">
            <div className="flex gap-6 max-md:flex-col justify-center items-start max-md:items-center flex-wrap max-sm:text-center">
                {/* Doctor Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-blue-400 overflow-hidden">
                    <img src={doctor.photo || doctorImg} alt="DoctorImg" />
                </div>
                <div className="flex-1">
                    {/* Doctor Details */}
                    <h3 className="text-xl font-bold text-blue-500">
                        {t("doctorCard.doctor")} {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p className="text-gray-500 text-sm">{doctor.title}</p>
                    {/* Ratings */}
                    <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                            {"★".repeat(Math.floor(doctor.rating))}
                            {"☆".repeat(5 - Math.floor(doctor.rating))}
                        </div>
                        <span className="text-gray-600 text-sm ml-2">
                            {doctor.rating} ({doctor.reviews} reviews)
                        </span>
                    </div>
                    <p className="text-sm mt-1">
                        <span className="font-medium">{t("doctorCard.specializedIn")}</span>{" "}
                        {doctor.specialization_name}
                    </p>
                    {/* Location */}
                    <p className="text-sm text-gray-600 mt-2">
                        {t("doctorCard.location")} {doctor.city},{doctor.state}, Algeria
                    </p>
                    <p className="text-sm text-gray-600">
                        {t("doctorCard.fees")} {doctor?.visit_price} DA
                    </p>

                </div>
                {/* Appointment Section */}
                {/* <div className="mt-4 flex flex-col items-center">
                    {doctor.availability.map((slot, index) => (
                        <div key={index} className="mt-2">
                            <h4 className="text-sm font-bold !text-center">{slot.day}</h4>
                            <div className="mt-1 !text-center">
                                {slot.dis.map((time, idx) => (
                                    <>
                                        <button
                                            key={idx}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-4 py-1 rounded-s-md mb-2"
                                        >
                                            {time}
                                        </button>
                                        <button
                                            key={idx}
                                            className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-4 py-1 rounded-e-md mb-2"
                                        >
                                            {t("booking.book")}
                                        </button>
                                    </>
                                ))}
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};


DoctorCard.propTypes = {
    doctor: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};