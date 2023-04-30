
import React, { useContext, useEffect, useState } from "react";

import { nodes as initialNodes, edges as initialEdges } from '../components/initial-element';

import  {
    useNodesState,
    useEdgesState,
  } from 'reactflow'


const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(localStorage.getItem("interactiveData") ? JSON.parse(localStorage.getItem("interactiveData")) : initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        localStorage.setItem("interactiveData", JSON.stringify(nodes))
      }, [nodes])

    return (
        <GlobalContext.Provider value={{
            nodes,
            setNodes,
            onNodesChange,
            edges,
            setEdges,
            onEdgesChange,
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}