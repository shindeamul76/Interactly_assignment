import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

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

const Home = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    localStorage.getItem("interactiveNodes")
      ? JSON.parse(localStorage.getItem("interactiveNodes"))
      : initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [name, setName] = useState('')

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
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    localStorage.setItem("interactiveNodes", JSON.stringify(nodes));
  }, [nodes]);

  const onNodeClick = (_, node) => {
    setDeleteButtonVisible(true);
    setSelectedNode(node);
  };

  const onEdgeClick = (_, edge) => {
    setDeleteButtonVisible(true);
    setSelectedEdge(edge);
  };

  const handleDeleteClick = () => {
    if (selectedNode) {
      alert(`are you sure want to delete ${selectedNode.data.label}`);
      setNodes(nodes.filter((node) => node.id !== selectedNode.id));
    } else if (selectedEdge) {
      alert(`are you sure want to delete ${selectedNode.data.label}`);
      setEdges(edges.filter((edge) => edge.id !== selectedEdge.id));
    }
    setDeleteButtonVisible(false);
  };

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
          snapToGrid={true}
          snapGrid={[16, 16]}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
        >
          <Controls />
          <MiniMap
            nodeColor={(nd) => {
              if (nd.type === "input") return "blue";
              return "#FFCC00";
            }}
          />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>

        {deleteButtonVisible && (
          <button
            className="delete-btn"
            onClick={handleDeleteClick}
            style={{
              position: "absolute",
              top: selectedNode && selectedNode.position.y - 0,
              // : selectedEdge?.points[0] - 30,
              left: selectedNode && selectedNode.position.x + 0,
              // : selectedEdge?.points[0].x + 80 ,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
      </div>
    </>
  );
};

export default Home;
