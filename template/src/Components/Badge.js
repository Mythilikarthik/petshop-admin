import React from 'react';
import PropTypes from 'prop-types';
import './Css/badges.css';

const Badge = ({ type }) => {
    let badgeClass = '';

    switch (type) {
        case 'Top Rated':
            badgeClass = 'badge-top-rated';
            break;
        case 'Popular':
            badgeClass = 'badge-popular';
            break;
        case 'New':
            badgeClass = 'badge-new';
            break;
        default:
            badgeClass = '';
    }

    return <span className={`badge ${badgeClass}`}>{type}</span>;
};

Badge.propTypes = {
    type: PropTypes.oneOf(['Top Rated', 'Popular', 'New']).isRequired,
};

export default Badge;