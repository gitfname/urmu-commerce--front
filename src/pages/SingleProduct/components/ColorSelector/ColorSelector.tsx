import React from 'react';
import type { ColorOption } from '../../types/product';

interface ColorSelectorProps {
    colors: ColorOption[];
    selectedColorId: string;
    onColorSelect: (colorId: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColorId, onColorSelect }) => {
    return (
        <div className="lg:mt-8 lg:mb-8">
            <div className="text-zinc-700">
                رنگ:
            </div>
            <ul className="flex flex-wrap gap-2">
                {colors.map((color) => (
                    <li key={color.id}>
                        <input
                            type="radio"
                            id={color.id}
                            name="color"
                            value={color.id}
                            className="hidden peer"
                            checked={selectedColorId === color.id}
                            onChange={() => onColorSelect(color.id)}
                        />
                        <label
                            htmlFor={color.id}
                            className="inline-flex items-center justify-center px-2 py-3 text-gray-600 bg-white border border-gray-200 rounded-full cursor-pointer peer-checked:border-red-400 peer-checked:text-red-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <div className="flex gap-x-2">
                                <div className={`w-5 h-5 ${color.colorClass} rounded-full`}></div>
                                <div className="text-sm">{color.name}</div>
                            </div>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColorSelector;