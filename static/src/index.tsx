import React from 'react';
import {Store} from 'redux'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { IAppState } from './reducers'
import { configureStore, history} from './store/configureStore';
import './index.css';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import App from './App'


import * as themes from './styles/theme'

const store = configureStore();

interface IProps {
    store: Store<IAppState>
}
interface IPropsFromState{
    theme: string
}
type AllTypes = IProps & IPropsFromState

const Root: React.FC<AllTypes> = props => {
    return (
        <Provider store={props.store}>
            <ConnectedRouter history={history}>
                <ThemeProvider theme={props.theme === 'light' ? themes.light : themes.dark}>
                    <div>
                        <App history={history}></App>
                    </div>
                </ThemeProvider>
            </ConnectedRouter>
        </Provider>
    )
    };

const RootContainer = connect(
    state => (state: IAppState) => ({
        theme: state.themeState.theme,
    })
)(Root);
ReactDOM.render(
    <RootContainer store={store} />,document.getElementById('root')
); 
