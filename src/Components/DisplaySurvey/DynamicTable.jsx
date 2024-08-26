import React, { useState } from 'react';

const DynamicTable = ({ options }) => {
  const [matrixData, setMatrixData] = useState(
    options.rows.map(() => Array(options.columns.length).fill(''))
  );

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newMatrixData = matrixData.map((row, rIndex) =>
      rIndex === rowIndex ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell)) : row
    );
    setMatrixData(newMatrixData);
  };

  return (
    <div className='radio-group'>
      <table>
        <thead>
          <tr>
            <th></th>
            {options.columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {options.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{row}</th>
              {matrixData[rowIndex].map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="radio"
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DynamicTable;
