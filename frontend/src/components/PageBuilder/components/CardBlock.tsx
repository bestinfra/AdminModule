import React from 'react';
import type { ComponentType } from '@components/PageBuilder/types';
import Card from '@components/global/Card'; 

interface CardBlockProps {
    component: ComponentType;
}

const CardBlock: React.FC<CardBlockProps> = ({ component }) => {
    return (
        <div className="hover:bg-white/50 rounded-md transition-all duration-200 border border-gray-200 hover:border-blue-300 group m-3">
            <Card
                title={component.props?.title || 'Card Title'}
                value={component.props?.value || '0'}
                icon={component.props?.icon || 'icons/default-card.svg'}
                showTrend={component.props?.showTrend}
                comparisonValue={component.props?.comparisonValue}
                subtitle1={component.props?.subtitle1}
                subtitle2={component.props?.subtitle2}
            />
        </div>
    );
};

export default CardBlock;
