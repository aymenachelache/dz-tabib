import PropTypes from 'prop-types';

export const BookingConfirmation = ({ t }) => {
    const bookingDetails = {
        doctor: "Dr. Sarah Benali",
        specialty: "Cardiologist",
        date: "November 25, 2024",
        time: "10:30 AM",
        location: "123 Medical Blvd, Algiers",
        appointmentId: "APPT12345",
      };
    return (
        <>
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full">
                    {/* Header Section */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <svg
                                className="w-16 h-16 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Booking Confirmed!
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Your appointment has been successfully scheduled.
                        </p>
                    </div>

                    {/* Booking Summary */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Booking Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Patient Name</p>
                                <p className="font-medium text-gray-800">John Doe</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Doctor Name</p>
                                <p className="font-medium text-gray-800">Dr. Sarah Johnson</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Booking Date</p>
                                <p className="font-medium text-gray-800">Nov 21, 2024, 11:40 AM</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Waiting Time</p>
                                <p className="font-medium text-gray-800">15 Minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Clinic Information */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Clinic Information
                        </h3>
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-800">Clinic Address:</span>{" "}
                                30 Gezziret El Arab, Floor 2, Mohandseen, Cairo.
                            </p>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium text-gray-800">Clinic Number:</span>{" "}
                                01062078492
                            </p>
                            <a
                                href="#"
                                className="text-blue-600 mt-4 inline-block hover:underline"
                            >
                                View on Maps
                            </a>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-8 text-center">
                        <a
                            href="#"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 transition"
                        >
                            View My Appointments
                        </a>
                    </div>
                </div>
            </div>



            <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 text-center">
                        <svg
                            className="w-20 h-20 mx-auto mb-4 "
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
                        <p className="mt-2 text-lg">
                            Thank you for booking with us. Your appointment details are below.
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Patient Name</p>
                                <p className="font-medium text-gray-800">John Doe</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Doctor Name</p>
                                <p className="font-medium text-gray-800">Dr. Sarah Johnson</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Booking Date</p>
                                <p className="font-medium text-gray-800">Nov 21, 2024, 11:40 AM</p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-500">Waiting Time</p>
                                <p className="font-medium text-gray-800">15 Minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Clinic Information */}
                    <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Clinic Details
                        </h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-800">Address:</span> 30
                                Gezziret El Arab, Floor 2, Mohandseen, Cairo.
                            </p>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium text-gray-800">Phone:</span>{" "}
                                01062078492
                            </p>
                            <a
                                href="#"
                                className="text-blue-600 font-medium mt-4 inline-block hover:underline"
                            >
                                View on Maps
                            </a>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 md:p-8 text-center bg-gray-50">
                        <a
                            href="#"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 transition"
                        >
                            View My Appointments
                        </a>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <div className="text-green-500 text-6xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mt-2">
            Your appointment has been successfully booked.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-700">Booking Details:</h2>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium text-gray-800">{bookingDetails.doctor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialty:</span>
              <span className="font-medium text-gray-800">{bookingDetails.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-800">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-800">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-800">{bookingDetails.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment ID:</span>
              <span className="font-medium text-gray-800">{bookingDetails.appointmentId}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            View Details
          </button>
          <button className="ml-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Back to Home
          </button>
        </div>
      </div>
    </div>


    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg">
        <div className="p-6 bg-blue-600 text-white text-center py-6 rounded-t-xl">
          <h1 className="text-2xl font-bold mt-2">Appointment Confirmed</h1>
          <p className="text-blue-100 mt-1">
            Your appointment has been successfully scheduled.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-800">Booking Details</h2>
            <div className="bg-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium text-gray-800">{bookingDetails.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty:</span>
                <span className="font-medium text-gray-800">{bookingDetails.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-800">{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-gray-800">{bookingDetails.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment ID:</span>
                <span className="font-medium text-gray-800">{bookingDetails.appointmentId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="#details"
              className="block w-full text-center bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              View Appointment Details
            </a>
            <a
              href="#home"
              className="block w-full text-center bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>


        </>
    )
}

BookingConfirmation.propTypes = {
    t: PropTypes.func.isRequired,
}