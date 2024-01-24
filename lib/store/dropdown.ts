/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

interface DropdownStateProps {
    countryValue: string;
    setCountryValue: (countries: string) => void;
    openCountryDropdown: boolean;
    setOpenCountryDropdown: (openCountry: boolean) => void;

    stateValue: string;
    setStateValue: (state: string) => void;
    openStateDropdown: boolean;
    setOpenStateDropdown: (openState: boolean) => void;

    // countryCallingCode: string;
    // setCountryCallingCode: (callingCode: string) => void;
    // openCountryCallingCodeDropdown: boolean;
    // setOpenCountryCallingCodeDropdown: (openCountryCallingCode: boolean) => void;

    // countryCurrencyValue: string;
    // setCountryCurrencyValue: (currency: string) => void;
    // openCountryCurrencyDropdown: boolean;
    // setOpenCountryCurrencyDropdown: (openCountryCurrency: boolean) => void;
}

export const useDropdownStore = create<DropdownStateProps>((set) => ({
    countryValue: "",
    setCountryValue: (country: string) => {
        set({ countryValue: country });
    },
    openCountryDropdown: false,
    setOpenCountryDropdown: (openCountry: boolean) => {
        set({ openCountryDropdown: openCountry });
    },

    stateValue: "",
    setStateValue: (state: string) => {
        set({ stateValue: state });
    },
    openStateDropdown: false,
    setOpenStateDropdown: (openState: boolean) => {
        set({ openStateDropdown: openState });
    },

    // countryCallingCode: "",
    // setCountryCallingCode: (callingCode: string) => {
    //     set({ countryCallingCode: callingCode });
    // },
    // openCountryCallingCodeDropdown: false,
    // setOpenCountryCallingCodeDropdown: (openCountryCallingCode: boolean) => {
    //     set({ openCountryCallingCodeDropdown: openCountryCallingCode });
    // },

    // countryCurrencyValue: "",
    // setCountryCurrencyValue: (currency: string) => {
    //     set({ countryCurrencyValue: currency });
    // },
    // openCountryCurrencyDropdown: false,
    // setOpenCountryCurrencyDropdown: (openCountryCurrency: boolean) => {
    //     set({ openCountryCurrencyDropdown: openCountryCurrency });
    // },
}));
