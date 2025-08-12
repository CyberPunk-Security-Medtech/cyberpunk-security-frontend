import React from "react";

interface DataCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    highlight?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({ title, value, subtitle, highlight }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col justify-between">
            <h4 className="text-gray-500 text-sm">{title}</h4>
            <div className={`text-2xl font-semibold ${highlight ? "text-primary-600" : "text-gray-900"}`}>
                {value}
            </div>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
    );
};

export default DataCard;
