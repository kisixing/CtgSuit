import { createContext } from "react";
import { useVisited } from "./visited";


type c = {} & ReturnType<typeof useVisited>

export const context = createContext<c>({
    visitedData: [],
    setVisitedData: () => { },
});


export const useContextValue = () => {
    const v = useVisited()
    return { ...v }
}