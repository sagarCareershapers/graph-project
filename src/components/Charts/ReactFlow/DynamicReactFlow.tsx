"use client";
import React, { useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    useEdgesState,
    useNodesState,
    addEdge,
    Handle,
    Position,
    Connection,
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";

import "reactflow/dist/style.css";
import data from "@/utils/data/simpleData.json"

// ReactFlow Component
const DynamicReactFlow: React.FC = () => {
    const { fitView } = useReactFlow();
    // const { zoomToFit } = useReactFlow();



    useEffect(() => {
        fitView();
        // zoomToFit();
    }, []);

    // const json = {
    //     "nodes": [
    //         {
    //             "id": "1",
    //             "position": { "x": 100, "y": 100 },
    //             "data": {
    //                 "label": "Node 1"
    //             },
    //             "handles": [
    //                 {
    //                     "type": "source",
    //                     "position": "Right",
    //                     "id": "right-handle",
    //                     "style": { 
    //                         "background": "red", 
    //                         "top": "50%", 
    //                         "transform": "translateY(-50%)" 
    //                     }
    //                 }
    //             ],
    //             "style": { 
    //                 "width": 100, 
    //                 "height": 100, 
    //                 "backgroundColor": "lightblue", 
    //                 "border": "1px solid red" 
    //             }
    //         },
    //         {
    //             "id": "2",
    //             "position": { "x": 300, "y": 100 },
    //             "data": {
    //                 "label": "Node 2"
    //             },
    //             "handles": [
    //                 {
    //                     "type": "target",
    //                     "position": "Left",
    //                     "id": "left-handle",
    //                     "style": { 
    //                         "background": "blue", 
    //                         "top": "50%", 
    //                         "transform": "translateY(-50%)" 
    //                     }
    //                 }
    //             ],
    //             "style": { 
    //                 "width": 100, 
    //                 "height": 100, 
    //                 "backgroundColor": "lightgreen", 
    //                 "border": "1px solid black" 
    //             }
    //         }
    //     ],
    //     "edges": [
    //         {
    //             "id": "e1-2",
    //             "source": "1",
    //             "sourceHandle": "right-handle",
    //             "target": "2",
    //             "targetHandle": "left-handle",
    //             "animated": true,
    //             "type": "smoothstep",
    //             "style": { "stroke": "red", "strokeWidth": 2 }
    //         }
    //     ]
    // }

    const json = {
        "nodes": [
            {
                "id": "1",
                // "position": { "x": 230, "y": 180 },
                "position": { "x": 0, "y": 0 },
                "data": {
                    "label": "EC2 Instance"
                },
                "handles": [
                    {
                        "type": "source",
                        "position": "Right",
                        "id": "right-handle",
                        "style": {
                            "background": "red",
                            "top": "50%",
                            "transform": "translateY(-50%)"
                        }
                    }
                ],
                "style": {
                    "width": 100,
                    "height": 100,
                    "borderRadius": "50%"
                }
            },
            {
                "id": "2",
                // "position": { "x": 300, "y": 100 },
                "position": { "x": 400, "y": 0 },
                "data": {
                    "label": "S3 Bucket"
                },
                "handles": [
                    {
                        "type": "target",
                        "position": "Left",
                        "id": "left-handle",
                        "style": {
                            "background": "blue",
                            "top": "50%",
                            "transform": "translateY(-50%)"
                        }
                    }
                ],
                "style": {
                    "width": 60,
                    "height": 60,
                    "backgroundColor": "#00ff00"
                }
            }
        ],
        "edges": [
            {
                "id": "e1-2",   
                "source": "1",
                "sourceHandle": "right-handle",
                "target": "2",
                "targetHandle": "left-handle",
                "animated": true,
                "type": "smoothstep",
                "style": { "stroke": "red", "strokeWidth": 2 }
            }
        ]
    }

    const convertJsonToReactFlowFormat = (jsonData: any) => {

        const nodes = jsonData.nodes.map((node: any) => ({
            id: node.id,
            position: node.position,
            data: {
                label: (
                    // <div style={{...node.style }}>
                    <div>
                        {node?.data?.label}
                        {/* {node.handles?.map((handle: any) => (
                            <Handle
                                key={handle.id}
                                type={handle.type}
                                position={Position[handle.position as keyof typeof Position]}
                                id={handle.id}
                                style={handle.style}
                            />
                        ))} */}
                        {node.handles?.map((handle: any) => (
                            <Handle
                                key={handle.id}
                                type={handle.type}
                                position={Position[handle.position as keyof typeof Position] || Position.Right}
                                id={handle.id}
                                style={handle.style}
                            />
                        ))}
                    </div>
                    // </div>
                ),
            },
            style: node.style,
        }));

        const edges = jsonData.edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle,
            animated: edge.animated,
            type: edge.type,
            style: edge.style,
        }));

        return { nodes, edges };
    };



    console.log(convertJsonToReactFlowFormat(data));

    console.log(
        "=>=>",
        // initialNodes,
        "\n\n\n",
        convertJsonToReactFlowFormat(data)["nodes"]
    );


    // State management for nodes and edges
    const [nodes, setNodes] = useNodesState(convertJsonToReactFlowFormat(json)["nodes"]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(convertJsonToReactFlowFormat(json)["edges"]);


    
    useEffect(() => {
        console.log("Nodes:", nodes);
    }, [nodes]);

    // OnConnect event to handle adding edges
    const onConnect = useCallback(
        (connection: Connection) => {
            console.log("New connection:", connection);  // Debug
            setEdges((eds) =>
                addEdge(
                    { 
                        ...connection, 
                        animated: true, 
                        type: "smoothstep", 
                        style: { stroke: "red", strokeWidth: 2 } 
                    },
                    eds
                )
            );
        },
        [setEdges]
    );

    return (
        <ReactFlowProvider>
        <div style={{ width: "100vw", height: "100vh"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background style={{ background: "white" }} variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
        </ReactFlowProvider>
    );
};

// export default DynamicReactFlow;

// ✅ Wrap with ReactFlowProvider externally
const FlowWithProvider: React.FC = (props) => (
    <ReactFlowProvider>
        <DynamicReactFlow {...props} />
    </ReactFlowProvider>
);

export default FlowWithProvider;
