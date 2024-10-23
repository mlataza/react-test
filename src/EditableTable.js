import { useState, useCallback, useEffect } from "react";

function EditableTable({ columns, initialData, actionsColumnName = 'actions', onUpdate }) {

    // Constants
    const tableStyle = {
        border: '1px solid black',
        borderCollapse: 'collapse',
        margin: '12px'
    };

    const cellStyle = {
        border: '1px solid black',
        borderCollapse: 'collapse',
        padding: '6px'
    };

    // Helper functions 

    // Generates an empty new row based on the columns
    function generateEmptyNewRow() {
        return Array.from(columns, () => '');
    }

    // Create a copy of a an array with one item changed
    function updateArray(array, index, value) {
        const updatedArray = [...array];
        updatedArray[index] = value;
        return updatedArray;
    }

    // Create a copy of an array with one item deleted
    function deleteArray(array, index) {
        const updatedArray = [...array];
        updatedArray.splice(index, 1);
        return updatedArray;
    }

    // Initialize all the states here
    const [data, setData] = useState(initialData);
    const [newRow, setNewRow] = useState(generateEmptyNewRow());
    const [isEditing, setIsEditing] = useState(Array.from(initialData, () => false));

    // Monitor changes in the data and call the event handler
    useEffect(() => {
        onUpdate(data);
    }, [onUpdate, data]);

    // Event handlers
    function handleNewRowCellOnChange(index, value) {
        setNewRow(updateArray(newRow, index, value));
    }

    // Handles onClick event for edit button on each row
    function handleEditOnClick(rowIndex) {
        setIsEditing(updateArray(isEditing, rowIndex, [...data[rowIndex]]));
    }

    // Handles onClick event for update button on each row
    function handleUpdateOnClick(rowIndex) {
        setData(updateArray(data, rowIndex, isEditing[rowIndex]));
        setIsEditing(updateArray(isEditing, rowIndex, false));
    }

    // Handles onChange event for each input cell
    function handleEditCellOnChange(rowIndex, cellIndex, value) {
        setIsEditing(updateArray(isEditing, rowIndex, updateArray(isEditing[rowIndex], cellIndex, value)));
    }

    // Handles onClick event for delete button on each row
    function handleDeleteOnClick(rowIndex) {
        if (window.confirm(`Do you want to delete row ${rowIndex}?`)) {
            setData(deleteArray(data, rowIndex));
            setIsEditing(deleteArray(isEditing, rowIndex));
        }
    }

    // Handles onClick event for add button
    function handleAddOnClick() {
        setData([...data, newRow]);
        setNewRow(generateEmptyNewRow());
        setIsEditing([...isEditing, false]);
    }

    // Handles onClick event for clear button
    function handleClearOnClick() {
        setNewRow(generateEmptyNewRow());
    }

    // Render the table here
    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th style={cellStyle} key={index}>{column}</th>
                    ))}

                    <th style={cellStyle}>{actionsColumnName}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td style={cellStyle} key={cellIndex}>
                                {
                                    isEditing[rowIndex] === false ?
                                        cell
                                        :
                                        <input value={isEditing[rowIndex][cellIndex]} onChange={(e) => handleEditCellOnChange(rowIndex, cellIndex, e.target.value)} />
                                }
                            </td>
                        ))}

                        <td style={cellStyle}>
                            {
                                isEditing[rowIndex] === false ?
                                    <button onClick={() => handleEditOnClick(rowIndex)}>Edit</button>
                                    :
                                    <button onClick={() => handleUpdateOnClick(rowIndex)}>Update</button>
                            }
                            &nbsp;
                            <button onClick={() => handleDeleteOnClick(rowIndex)}>Delete</button>
                        </td>
                    </tr>
                ))}

                <tr>
                    {newRow.map((newCell, index) => (
                        <td style={cellStyle} key={index}>
                            <input value={newCell} onChange={(e) => handleNewRowCellOnChange(index, e.target.value)} />
                        </td>
                    ))}
                    <td style={cellStyle}>
                        <button onClick={handleAddOnClick}>Add</button>
                        &nbsp;
                        <button onClick={handleClearOnClick}>Clear</button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default EditableTable;