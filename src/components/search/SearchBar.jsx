import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useLocation for query params
import axios from "axios";

export const SearchBar = ({ setResults }) => {
  const [name, setName] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [localization, setLocalization] = useState("");
  const [assurance, setassurance] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  // States to hold fetched specialities and assurances
  const [specialities, setSpecialities] = useState([]);
  const [assurances, setAssurances] = useState([]);

  // List of 58 Algerian cities
  const localizationsAlgerie = [
    "Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Chlef", "Tizi Ouzou",
    "Béjaïa", "Skikda", "Sidi Bel Abbès", "Tlemcen", "Ghardaïa", "Mostaganem", "Biskra",
    "Tébessa", "El Oued", "Tiaret", "Ouargla", "Djelfa", "M'sila", "Jijel", "Relizane",
    "Saïda", "Guelma", "Laghouat", "Médéa", "Tamanrasset", "Béchar", "Adrar", "Tindouf",
    "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tissemsilt", "Khenchela", "Souk Ahras",
    "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Ouled Djellal",
    "Bouira", "Illizi", "Tamanrasset", "Timimoun", "Beni Abbès", "In Salah", "In Guezzam",
    "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "Ouled Djellal"
  ];

  // Fetch specialities and assurances data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/adv_search`);
        const { specialities, assurances, days_of_week } = response.data;

        setSpecialities(Object.values(specialities));
        setAssurances(Object.values(assurances));
        setDaysOfWeek(Object.values(days_of_week));
        console.log(response.data);
        console.log(daysOfWeek);
      } catch (error) {
        console.error("Error fetching specialities and assurances:", error);
      }
    };

    fetchData();
  }, []);

  // Get query params from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    setName(queryParams.get("name") || "");
    setSpecialite(queryParams.get("specialite") || "");
    setLocalization(queryParams.get("localization") || "");
    setassurance(queryParams.get("assurance") || "");
    setDisponibilite(queryParams.get("disponibilite") || "");
  }, [location.search]);  // Update whenever URL changes

  // Navigation with query params
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      name,
      specialite,
      localization,
      assurance,
      disponibilite,
    }).toString();
    navigate(`/search?${queryParams}`);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    if (name === "specialite") {
      setSpecialite(value);
    } else if (name === "localization") {
      setLocalization(value);
    } else if (name === "assurance") {
      setassurance(value);
    } else if (name === "disponibilite") {
      setDisponibilite(value);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Name Input */}
      <div className="col-span-1">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        />
      </div>

      {/* Spécialité Dropdown */}
      <div className="col-span-1">
        <select
          name="specialite"
          value={specialite}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Spécialité</option>
          {specialities.map((speciality, index) => (
            <option key={index} value={speciality}>
              {speciality}
            </option>
          ))}
        </select>
      </div>

      {/* Localization Dropdown */}
      <div className="col-span-1">
        <select
          name="localization"
          value={localization}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Localization</option>
          {localizationsAlgerie.map((localization, index) => (
            <option key={index} value={localization}>
              {localization}
            </option>
          ))}
        </select>
      </div>

      {/* Type d'assurance Dropdown */}
      <div className="col-span-1">
        <select
          name="assurance"
          value={assurance}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Type d'assurance</option>
          {assurances.map((assurance, index) => (
            <option key={index} value={assurance}>
              {assurance}
            </option>
          ))}
        </select>
      </div>

      {/* Disponibilité Dropdown */}
      <div className="col-span-1">
        <select
          name="disponibilite"
          value={disponibilite}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Disponibilité</option>
          {daysOfWeek.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1">
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-10 border-2 bg-sky-500 border-sky-500 focus:outline-none focus:border-sky-500 text-white rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          Search
        </button>
      </div>
    </div>
  );
};