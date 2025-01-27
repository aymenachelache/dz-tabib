import PropTypes from 'prop-types';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { DoctorCard } from './DoctorCard';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar } from '../../components/search/SearchBar';

export const Doctors = ({ t }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1); // Assuming at least 1 page
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update currentPage when searchParams change
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    setDoctors([]);
  }, [searchParams]);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ page: page.toString(), limit: '10' }); // Update the URL search params
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true); // Set loading to true before fetching data
      const page = parseInt(searchParams.get('page')) || 1; // Default to 1 if undefined
      const limit = parseInt(searchParams.get('limit')) || 10; // Default to 10 if undefined

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`, {
          params: {
            page: page,
            limit: limit,
          },
        });
        setDoctors(response.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchDoctors();
  }, [currentPage, searchParams]);

  return (
    <>
      <Header t={t} />
      <div className='bg-gray-100 pt-14'>
        <div className="container min-h-screen mx-auto p-14 bg-white rounded-lg">
          <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            doctors.map((doctor, idx) => (
              <Link to={`/doctor/${doctor.id}`} key={idx}>
                <DoctorCard doctor={doctor} t={t} />
              </Link>
            ))
          )}
        </div>
        <nav aria-label="Page pagination navigation" className='!text-center'>
          <ul className="inline-flex -space-x-px text-sm my-10 mx-auto">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
              >
                {t("pagination.previous")}
              </button>
            </li>

            {/* Dynamically Generate Page Buttons */}
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <li key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight ${page === currentPage
                      ? "text-blue-600 bg-blue-50 border-blue-300"
                      : "text-gray-500 bg-white border-gray-300"
                      } hover:bg-gray-100 hover:text-gray-700`}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            {/* Next Button */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              >
                {t("pagination.next")}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <Footer t={t} />
    </>
  );
};

Doctors.propTypes = {
  t: PropTypes.func.isRequired,
};