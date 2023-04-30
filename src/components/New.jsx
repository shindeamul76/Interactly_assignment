import React, { useCallback, useEffect, useState } from "react";

import "reactflow/dist/style.css";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-element";
import ButtonEdge from "./Button-edge";

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const New = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    localStorage.getItem("interactiveData")
      ? JSON.parse(localStorage.getItem("interactiveData"))
      : initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const addNodehandle = () => {
    setNodes((e) =>
      e.concat({
        id: (e.length + 1).toString(),
        data: { label: `${name}` },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
      })
    );
  };

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, type: "buttonedge" }, eds));
    },
    [setEdges]
  );

  const handleNodeMouseEnter = (event, node) => {
    setDeleteButtonVisible(true);
    setSelectedNode(node);
  };

  const handleNodeMouseLeave = () => {
    setDeleteButtonVisible(false);
    setSelectedNode(null);
  };

  const handleEdgeMouseEnter = (event, edge) => {
    setDeleteButtonVisible(true);
    setSelectedEdge(edge);
  };

  const handleEdgeMouseLeave = () => {
    setDeleteButtonVisible(false);
    setSelectedEdge(null);
  };

  const handleDeleteClick = () => {
    if (selectedNode) {
      setNodes(nodes.filter((node) => node.id !== selectedNode.id));
    } else if (selectedEdge) {
      setEdges(edges.filter((edge) => edge.id !== selectedEdge.id));
    }
  };

  useEffect(() => {
    localStorage.setItem("interactiveData", JSON.stringify(nodes));
  }, [nodes]);

  return (
    <>
      <div className="btn">
        <button onClick={addNodehandle}>Create Node</button>
      </div>

      <div style={{ marginTop: "20px", height: "40px" }}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="enter node name"
        />
      </div>

      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onLoad={onLoad}
          onNodeMouseEnter={handleNodeMouseEnter}
          snapToGrid={true}
        //   nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onElementClick={() => setDeleteButtonVisible(false)}
          onPaneClick={() => setDeleteButtonVisible(false)}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        {deleteButtonVisible && (
          <button
            className="delete-btn"
            onClick={handleDeleteClick}
            style={{
              position: "absolute",
              top: selectedNode
                ? selectedNode.position.y - 30
                : selectedEdge?.points[0].y - 30,
              left: selectedNode
                ? selectedNode.position.x + 80
                : selectedEdge?.points[0].x + 80,
            }}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
};

export default New;
