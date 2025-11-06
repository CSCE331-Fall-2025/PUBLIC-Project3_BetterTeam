import React from "react"

interface EntreeCardProps {
    name: string;
    price: number;
    imageUrl?: string;
    onSelect?: () => void;
}


export const EntreeCard: React.FC<EntreeCardProps> = ({name, price, imageUrl, onSelect}) => {
    return(
        <div className="flex flex-col items-center bg-white rounded-2xl  shadow-md p-4 hover:shadow-lg cursor-pointer transition"
        onClick={onSelect}
        >
            <img
            src={imageUrl || "/assets/images/panda.png"}
            alt={name}
            className="w-32 h-32 object-cover rounded-xl mb-2"
            />
            <h3 className="text-lg font-semibold text-gray-800 text-center">{name}</h3>
            <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
        </div>
    );
};