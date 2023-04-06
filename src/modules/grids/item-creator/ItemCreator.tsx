import React, {FC, ReactNode} from 'react';

interface IItemCreatorProps {
    children:ReactNode
}

const ItemCreator:FC<IItemCreatorProps> = ({children}) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default ItemCreator;
