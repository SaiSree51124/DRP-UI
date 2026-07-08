import React from "react";
import { C, GRAD_H } from "../../utils/colors";

const Table = ({ title, data }) => {
  if (!data || data.length === 0)
    return <p className="text-gray-600">{title}: No interactions found</p>;
  const headers = Object.keys(data[0] || {});

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2" style={{ color: C.navy }}>
        {title}
      </h2>

      {/* Wrapper for Horizontal Scrolling */}
      <div className="bg-white p-4 rounded-md shadow-md border border-gray-300 overflow-x-auto">
        <table className="table-auto min-w-full border border-gray-300">
          <thead style={{color:"white"}}>
            <tr className="bg-white font-bold" style={{ background: GRAD_H}}>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row["@id"] || rowIndex} className="border-b">
                {headers.map((header, index) => (
                  <td key={index} className="px-4 py-2 border">
                    {row[header] !== undefined ? row[header] : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};


// **Styled Modal Component**
const MolecularInteractions = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="w-full overflow-auto">
  {Object.entries(data || {}).map(([key, value]) => (
    Array.isArray(value) && value.length > 0 && (
      <Table key={key} title={key.replace(/_/g, ' ')} data={value} />
    )
  ))}
</div>

  );
};

export default MolecularInteractions;
