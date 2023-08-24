import React, { createContext } from 'react'
import { useState } from 'react';
import { useNotification } from '../hooks';


export const SearchContext = createContext()

//debounce function is is a programming pattern or a technique to restrict the calling of a time-consuming function frequently, by delaying the execution of the function until a specified time to avoid unnecessary CPU cycles, and API calls and improve performance.
//so we take the func as a parameter and we calling the func inside the settimeout after 500 miliseconds and if we get another request then inside this timeoutId it will clear this timeoutId and then it will register this new setTimeout function
let timeoutId;
const debounce = (func, delay) => {
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};


export default function SearchProvider({ children }) {
    const [searching, setSearching] = useState(false)
    const [results, setResults] = useState([])
    const [resultNotFound, setResultNotFound] = useState(false)

    const { updateNotification } = useNotification();

    const search = async (method, query, updaterFun) => {
        const { error, results } = await method(query);
        if (error) return updateNotification("error", error);
        // if there is not results we reseting this results
        if (!results.length) {
            setResults([])
            updaterFun && updaterFun([])
            return setResultNotFound(true);
        }

        // or if there is any results we return not found
        setResultNotFound(false);
        setResults(results);
        updaterFun && updaterFun([...results])//if there is an updater function only then we want to invoke this updater function
    }

    const debounceFunc = debounce(search, 300);

    //we will pass the method and query
    //logic for search
    const handleSearch = (method, query, updaterFun) => {
        setSearching(true);
        if (!query.trim()) {
            updaterFun && updaterFun([])
            return resetSearch()
        }
        debounceFunc(method, query, updaterFun)
    }

    const resetSearch = () => {
        setSearching(false);
        setResults([]);
        setResultNotFound(false)
    }

    return (
        <SearchContext.Provider value={{ handleSearch, resetSearch, searching, resultNotFound, results }}
        >
            {children}</SearchContext.Provider>
    )
}
