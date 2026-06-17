import React, { useState, useEffect } from "react";

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const wsUrl = "ws://20.84.78.153:8080/api/v1/ws-process-protein/";
    const proteinRecords = [
        {
          "protein_name": "HKATPase",
          "pdb_file_path": "/home/azureuser/innoddapi/app/data/protein_structures/HKATPase_6ABJ.pdb",
          "top_n_affinity_records": null,
          "status": null,
          "time_taken": null,
          "task_id": null
        }
      ];
    
    useEffect(() => {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send(JSON.stringify(proteinRecords));
        };

        ws.onmessage = (event) => {
            try {
                const responseData = JSON.parse(event.data);
                const enhancedData = [...responseData, ...responseData];
                setMessages((prevMessages) => [...prevMessages, enhancedData]);
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold mb-4">WebSocket Messages</h1>
            <ul className="bg-white p-4 rounded shadow-md">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <li key={index} className="p-2 border-b">
                            {JSON.stringify(msg)}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">Waiting for messages...</li>
                )}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
