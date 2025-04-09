// "use client";
// import React from "react";
// import CytoscapeComponent from "react-cytoscapejs";

// // You can dynamically build this based on your cloud scan data
// const elements = [
//   // VPCs
//   { data: { id: "vpc-1", label: "VPC 1" }, classes: "vpc" },

//   // Subnets
//   { data: { id: "subnet-a", label: "Subnet A" }, classes: "subnet" },
//   { data: { id: "subnet-b", label: "Subnet B" }, classes: "subnet" },

//   // EC2 Instances
//   {
//     data: { id: "ec2-1", label: "EC2 1 - 🔴 Critical" },
//     classes: "critical",
//   },
//   {
//     data: { id: "ec2-2", label: "EC2 2 - 🟡 Medium" },
//     classes: "medium",
//   },

//   // Edges / Relationships
//   { data: { source: "vpc-1", target: "subnet-a" } },
//   { data: { source: "vpc-1", target: "subnet-b" } },
//   { data: { source: "subnet-a", target: "ec2-1" } },
//   { data: { source: "subnet-b", target: "ec2-2" } },
// ];

// const stylesheet = [
//   {
//     selector: "node",
//     style: {
//       label: "data(label)",
//       "text-valign": "center",
//       "text-halign": "center",
//       "background-color": "#ddd",
//       shape: "round-rectangle",
//       width: "label",
//       padding: "10px",
//       "font-size": "10px",
//     },
//   },
//   { selector: ".vpc", style: { "background-color": "#00BFFF" } },
//   { selector: ".subnet", style: { "background-color": "#87CEFA" } },
//   { selector: ".critical", style: { "background-color": "#FF4C4C" } },
//   { selector: ".medium", style: { "background-color": "#FFD700" } },

//   // Edge Styling
//   {
//     selector: "edge",
//     style: {
//       width: 2,
//       "line-color": "#ccc",
//       "target-arrow-color": "#ccc",
//       "target-arrow-shape": "triangle",
//       "curve-style": "bezier",
//     },
//   },
// ];

// const layout = {
//   name: "breadthfirst", // or try "dagre", "grid", "cose", "fcose"
//   directed: true,
//   padding: 10,
//   spacingFactor: 1.5,
// };

// const CytoscapeCloudGraph: React.FC = () => {
//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <CytoscapeComponent
//         elements={elements}
//         stylesheet={stylesheet}
//         layout={layout}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// };

// export default CytoscapeCloudGraph;

"use client";
import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import cloudData from "@/utils/data/data.json"; // or wherever your data is


cytoscape.use(dagre);

export const convertCloudJsonToCytoscapeElements = (data: any) => {
    const elements: any[] = [];
    
    data.forEach(region => {
        region.VPCs.forEach(vpc => {
            const vpcId = vpc.VPC_ID;
            
            // VPC node
            elements.push({
                data: { id: vpcId, label: `VPC\n${vpcId}` },
                classes: "vpc",
            });
            
            // Internet Gateway
            if (vpc.Internet_Gateway) {
                const igw = vpc.Internet_Gateway;
                elements.push({
                    data: { id: igw.IGW_ID, label: `IGW\n${igw.IGW_ID}` },
                    classes: "igw",
                });
                elements.push({
                    data: {
                        source: igw.Attached_VPC,
                        target: igw.IGW_ID,
                        label: "Attached",
                    },
                });
            }
            
            // Subnets
            vpc.Subnets.forEach(subnet => {
                const subnetId = subnet.Subnet_ID;
                elements.push({
                    data: {
                        id: subnetId,
                        label: `Subnet\n${subnetId}`,
                        parent: vpcId,
                    },
                    classes: "subnet",
                });
                
                // NACL
                if (subnet.NACL) {
                    elements.push({
                        data: {
                            id: subnet.NACL.NACL_ID,
                            label: `NACL\n${subnet.NACL.NACL_ID}`,
                            parent: subnetId,
                        },
                        classes: "nacl",
                    });
                    elements.push({
                        data: {
                            source: subnetId,
                            target: subnet.NACL.NACL_ID,
                            label: "Uses NACL",
                        },
                    });
                }
                
                // Security Groups & EC2
                subnet.Security_Groups.forEach(sg => {
                    elements.push({
                        data: {
                            id: sg.SG_ID,
                            label: `SG\n${sg.SG_ID}`,
                            parent: subnetId,
                        },
                        classes: "sg",
                    });
                    
                    sg.EC2_Instances.forEach(ec2 => {
                        elements.push({
                            data: {
                                id: ec2.Instance_ID,
                                label: `EC2\n${ec2.Instance_ID}`,
                                parent: subnetId,
                            },
                            classes: "ec2",
                        });
                        
                        elements.push({
                            data: {
                                source: sg.SG_ID,
                                target: ec2.Instance_ID,
                                label: "Secures",
                            },
                        });
                    });
                });
            });
        });
    });
    
    return elements;
};

const elements = convertCloudJsonToCytoscapeElements(cloudData);

// const elements = [
//     // VPC
//     {
//         data: { id: "vpc-123abc", label: "VPC\nvpc-123abc" },
//         classes: "vpc",
//     },

//     // Subnet
//     {
//         data: { id: "subnet-aaa111", label: "Subnet\nsubnet-aaa111", parent: "vpc-123abc" },
//         classes: "subnet",
//     },

//     // Security Group inside Subnet
//     {
//         data: { id: "sg-abc123", label: "SG\nsg-abc123", parent: "subnet-aaa111" },
//         classes: "sg",
//     },

//     // EC2 inside Subnet
//     {
//         data: {
//             id: "i-1234567890abcdef",
//             label: "EC2\ni-1234567890abcdef",
//             parent: "subnet-aaa111",
//         },
//         classes: "ec2",
//     },

//     // Internet Gateway (external)
//     {
//         data: { id: "igw-456def", label: "IGW\nigw-456def" },
//         classes: "igw",
//     },

//     // NACL inside Subnet
//     {
//         data: { id: "acl-xyz123", label: "NACL\nacl-xyz123", parent: "subnet-aaa111" },
//         classes: "nacl",
//     },

//     // Edges
//     { data: { source: "vpc-123abc", target: "igw-456def", label: "Attached" } },
//     { data: { source: "sg-abc123", target: "i-1234567890abcdef", label: "Secures" } },
//     { data: { source: "subnet-aaa111", target: "acl-xyz123", label: "Uses NACL" } },
// ];

const layout = {
    name: "dagre", // For hierarchical layout
    rankDir: "TB",
    nodeSep: 50,
    edgeSep: 10,
    rankSep: 50,
    padding: 20,
};

const stylesheet = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            "text-wrap": "wrap",
            "text-valign": "center",
            "text-halign": "center",
            "background-color": "#ccc",
            shape: "round-rectangle",
            "font-size": "10px",
            padding: "8px",
        },
    },
    {
        selector: ":parent",
        style: {
            "background-opacity": 0.1,
            "border-width": 2,
            "border-color": "#888",
            "text-valign": "top",
            "text-halign": "center",
            "padding": 15,
            "font-weight": "bold",
        },
    },
    { selector: ".vpc", style: { "background-color": "#A0D2FF", "border-color": "#3399FF" } },
    { selector: ".subnet", style: { "background-color": "#D2F0FF", "border-color": "#33CCFF" } },
    { selector: ".sg", style: { "background-color": "#FFD700" } },
    { selector: ".ec2", style: { "background-color": "#FF6347" } },
    { selector: ".igw", style: { "background-color": "#90EE90" } },
    { selector: ".nacl", style: { "background-color": "#9370DB" } },

    //   {
    //     selector: "edge",
    //     style: {
    //       width: 2,
    //       "line-color": "#999",
    //       "target-arrow-color": "#999",
    //       "target-arrow-shape": "triangle",
    //       "curve-style": "bezier",
    //       label: "data(label)",
    //       "font-size": "8px",
    //       "text-rotation": "autorotate",
    //       "text-margin-y": -5,
    //     },
    //   },

    {
        selector: "edge",
        style: {
            width: 1,
            "line-color": "red",
            "target-arrow-color": "#aaa",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "line-style": "dashed",
            "line-dash-pattern": [6, 3],
            "line-dash-offset": 0,
        },
    },
];

const CytoscapeCloudGraph: React.FC = () => {


    const cyRef = useRef<any>(null);

    // Animate dashed lines
    useEffect(() => {
        const interval = setInterval(() => {
            if (cyRef.current) {
                cyRef.current.edges().forEach((edge: any) => {
                    const currentOffset = parseInt(edge.style("line-dash-offset")) || 0;
                    edge.style("line-dash-offset", (currentOffset - 1) % 20);
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%", background:"#1f1f1f" }}>
            <CytoscapeComponent
                cy={(cy) => {
                    cyRef.current = cy;
                }}
                elements={CytoscapeComponent.normalizeElements(elements)}
                layout={layout}
                stylesheet={stylesheet}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default CytoscapeCloudGraph;
