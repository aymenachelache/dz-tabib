import ChangeLanguage from "../chengeLanguage/changeLanguage"
import logo from '../../assets/dz_tabib.svg'
import profile from '../../assets/profile_icon.png'
import { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import dztabib from "../../assets/dz_tabib.svg"
import Cookies from 'js-cookie';

export const Header = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = useState(Cookies.get("authToken"));
  const handleLogout = () => {
    Cookies.remove("authToken");
    window.location = "/";
  }
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img
              className="h-8 w-auto"
              src={logo}
              alt=""
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-4">
          <ChangeLanguage />
          {!isAuth ? <>
            <Link to="/signup" className="text-sm/6 font-semibold text-gray-900">
              {t("Header.SignUp")}
            </Link>
            <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
              {t("Header.Login")}
            </Link>
          </> : <div className="group relative">
            <Link to={"/profile"}>
              <img
                src={profile}
                className="w-5 cursor-pointer"
                alt=""
              />
            </Link>
            {isAuth && (
              <div className="group-hover:block hidden absolute z-50 dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <Link to="/profile"><p className="cursor-pointer hover:text-black">My Profile</p></Link>
                  <Link to="/editprofile"><p className="cursor-pointer hover:text-black">Edit Profile</p></Link>
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>}
        </div>
      </nav>
      {/* Mobile menu, show/hide based on menu open state. */}
      <div className={`lg:hidden ${!isOpen && 'hidden'}`} role="dialog" aria-modal="true">
        {/* Background backdrop, show/hide based on slide-over state. */}
        <div className="fixed inset-0 z-10" />
        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              {/* <span className="">DZ-TABIB</span> */}
              <img
                className="h-8 w-auto"
                src={dztabib}
                alt=""
              />
            </a>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setIsOpen(false)}>
              <span className="sr-only">Close menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="h-[90%] flex flex-col justify-between divide-y divide-gray-500/10">
            {isAuth && <><div className="py-6">
              <div className="-mx-3">
                <Link to="/" className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{t("Header.HomePage")}</Link>
                <Link to="/profile" className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{t("Header.Profile")}</Link>
                <Link to="/editprofile" className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">{t("Header.EditProfile")}</Link>
                <div to="/" className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer" onClick={handleLogout}>{t("Header.LogOut")}</div>
              </div>

            </div>
            </>

            }
            {!isAuth && <div className="py-6">
              <Link
                to="/login"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                {t("Header.Login")}
              </Link>
              <Link
                to="/signup"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                {t("Header.SignUp")}
              </Link>
            </div>}
          </div>
        </div>
      </div>
    </header>

  )
}

Header.propTypes = {
  t: PropTypes.func.isRequired,
};
