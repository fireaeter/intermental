import React from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import logo from './logo.jpg'
import * as searchActions from '../../actions/search'
import * as menuActions from '../../actions/menu'
import { connect } from 'react-redux';
import { IAppState } from '../../reducers'
import {History} from 'history';
import Input from './Input';

const styles = createStyles((theme: Theme) => ({
    
  }),
);

interface IPropsFromState{
    classes: any,
    history: History,
    loading: boolean,
}

interface IPropsFromDispatch {
    search: (query: string) => void,
    setName: (name: string) => void,
}

type AllProps = IPropsFromState & IPropsFromDispatch;

class Home extends React.Component<AllProps> {
    render() {
        return (
        <div>
            <div style={{paddingTop: "10%"}}>
                <img style={{textAlign: "center", paddingLeft: "20%", width: "60%"}} src={logo} alt=""></img>
                <div id="searchInput" style={{textAlign: "center", width: "60%", paddingLeft: "20%"}}>
                    <Input history={this.props.history} />
                </div>
            </div>
        </div>
        )
    }
}

// ThunkDispatch<IAppState, null, AnyAction>
export default connect<any,any>(
    state => (state: IAppState) => ({
     }),
     dispatch => (dispatch: any): IPropsFromDispatch => ({
         search: (query: string) => dispatch(searchActions.search(query)),
         setName: (name: string) => dispatch(menuActions.setName(name))
     })

)(withStyles(styles)(Home));