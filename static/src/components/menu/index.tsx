import React from 'react'
import MenuBar from './Menu'
import {History} from 'history';

interface IPropsFromState{
    history: History
}

class Menu extends React.Component<IPropsFromState> {
    render() {
        return (
            <MenuBar history={this.props.history['history']} />
        )
    }
}

export default Menu;