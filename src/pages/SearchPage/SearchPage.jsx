import PropTypes from 'prop-types';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { DoctorCard } from './DoctorCard';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar } from '../../components/search/SearchBar';

export const SearchPage = ({ t }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State to hold query parameters
  const [specialite, setSpecialite] = useState(searchParams.get('specialite') || '');
  const [localization, setLocalization] = useState(searchParams.get('localization') || '');
  const [assurance, setAssurance] = useState(searchParams.get('assurance') || '');
  const [disponibilite, setDisponibilite] = useState(searchParams.get('disponibilite') || '');
  const [name, setName] = useState(searchParams.get('name') || ''); // New state for name

  // State to handle pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchParams({ ...searchParams, page: page.toString() });
    }
  };

  // Fetch doctors data when query params or currentPage change
  useEffect(() => {
    const specialiteParam = searchParams.get('specialite') || '';
    const localizationParam = searchParams.get('localization') || '';
    const assuranceParam = searchParams.get('assurance') || '';
    const disponibiliteParam = searchParams.get('disponibilite') || '';
    const nameParam = searchParams.get('name') || ''; // Get name from searchParams
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Clear doctors list before fetching new data
    setDoctors([]);
    setLoading(true); // Start loading

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/adv_search/search`, {
          params: {
            page,
            limit,
            specialite: specialiteParam,
            localization: localizationParam,
            assurance: assuranceParam,
            disponibilite: disponibiliteParam,
            name: nameParam, // Pass name to the API
          },
        });

        setDoctors(response.data.doctors || []);
        setTotalPages(response.data.totalPages || 1); // Assuming the response includes totalPages
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDoctors();
  }, [searchParams, currentPage]);

  // Update the specialite when searchParams change
  useEffect(() => {
    const specialiteParam = searchParams.get('specialite');
    if (specialiteParam) {
      setSpecialite(specialiteParam);
    }
  }, [searchParams]);

  return (
    <>
      <Header t={t} />
      <div className="bg-gray-100 pt-14 mt-7">
        <div className="container min-h-screen mx-auto p-14 bg-white rounded-lg">
          <div className="mb-6">
            <SearchBar t={t} /> {/* Passing setSearchParams to SearchBar */}
          </div>
          <h1 className="text-2xl font-bold mb-4">{t("searchPage.allDoctors")}</h1>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor, idx) => (
              <Link to={`/doctor/${doctor.id}`} key={idx}>
                <DoctorCard doctor={doctor} t={t} />
              </Link>
            ))
          ) : (
            <p>{t("searchPage.noDoctorsFound")}</p>
          )}
        </div>

        {/* Pagination */}
        <nav aria-label="Page pagination navigation" className="!text-center">
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
                    className={`flex items-center justify-center px-3 h-8 leading-tight ${
                      page === currentPage
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

SearchPage.propTypes = {
  t: PropTypes.func.isRequired,
};