import { useTranslation } from 'react-i18next';
import '../../i18n.js'; // Assurez-vous que le fichier i18n est bien importé

const ChangeLanguage = () => {
    const { i18n } = useTranslation(); // Utilisation correcte du hook

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div>
            <button className='font-bold' onClick={() => handleLanguageChange('fr')}>FR</button>/
            <button className='font-bold' onClick={() => handleLanguageChange('ar')}>AR</button>
            <button className='font-bold' onClick={() => handleLanguageChange('en')}>EN</button>
        </div>
    );
};

export default ChangeLanguage;
