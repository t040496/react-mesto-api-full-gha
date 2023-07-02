import { createContext } from "react";

export const CurrentUserContext = createContext({
    avatar: null,
    name: null,
    about: null
});
