import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useLocation for query params
import axios from "axios";

export const SearchBar = ({ setResults }) => {
  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");
  const [typeAssurance, setTypeAssurance] = useState("");
  const [disponibilite, setDisponibilite] = useState("");

  // States to hold fetched specialities and assurances
  const [specialities, setSpecialities] = useState([]);
  const [assurances, setAssurances] = useState([]);

  // List of 58 Algerian cities
  const villesAlgerie = [
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
        const response = await axios.get("http://127.0.0.1:8000/adv_search");  // Replace with actual backend API endpoint
        const { specialities, assurances } = response.data;

        setSpecialities(Object.values(specialities));
        setAssurances(Object.values(assurances));
        console.log(response.data);
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
    setSpecialite(queryParams.get("specialite") || "");
    setVille(queryParams.get("ville") || "");
    setTypeAssurance(queryParams.get("typeAssurance") || "");
    setDisponibilite(queryParams.get("disponibilite") || "");
  }, [location.search]);  // Update whenever URL changes

  // Navigation with query params
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      specialite,
      ville,
      typeAssurance,
      disponibilite,
    }).toString();
      navigate(`/search?${queryParams}`);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    
    if (name === "specialite") {
      setSpecialite(value);
    } else if (name === "localization") {
      setVille(value);
    } else if (name === "assurance") {
      setTypeAssurance(value);
    } else if (name === "disponibilite") {
      setDisponibilite(value);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Spécialité Dropdown */}
      <div className="w-72">
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

      {/* Ville Dropdown */}
      <div className="w-72">
        <select
          name="localization"
          value={ville}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Ville</option>
          {villesAlgerie.map((ville, index) => (
            <option key={index} value={ville}>
              {ville}
            </option>
          ))}
        </select>
      </div>

      {/* Type d'assurance Dropdown */}
      <div className="w-72">
        <select
          name="assurance"
          value={typeAssurance}
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
      <div className="w-72">
        <select
          name="disponibilite"
          value={disponibilite}
          onChange={handleSelectChange}
          className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="">Disponibilité</option>
          <option value="Disponible">Disponible</option>
          <option value="Non disponible">Non disponible</option>
        </select>
      </div>

      <div className="w-72">
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
