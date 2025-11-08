import React from 'react';
import './Table.css';

export interface ColumnDefinition<T> {
    header: string;
    
    // Tells you how to get the data from a cell. Defines the accessor function as a type T that returns a ReactNode which can basically be like anything
    accessor: (data:T) => React.ReactNode;
}

interface TableProps<T>{
    data: T[];
    columns: ColumnDefinition<T>[];
}

const Table = <T,>({data, columns}:  TableProps<T>) => {
    return (
        <table>
            <thead>
                <tr>
                    {/* This is a map function like from 314, we need a header for every col */}
                    {columns.map((column, index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* This map creates a table row for every data row... */}
                {data.map((rowItem, rowIndex) => (
                    <tr key={rowIndex}>
                        {/* For the row that was just created, fill out its columns with the actual data, gotten by the accessor function */}
                        {columns.map((column, cellIndex) => (
                            <td key={cellIndex}>
                                {column.accessor(rowItem)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;