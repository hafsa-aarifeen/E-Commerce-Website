import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function FontAwesomeCom({icon,size, className}) {
    const text =icon.split(" ");
    const prefix = text[0];
    const iconName= text[1].replace('fa-','');
    return (
        <FontAwesomeIcon className={className && className} icon={[`${prefix}`,`${iconName}`] }/>
    );
}

export default FontAwesomeCom;