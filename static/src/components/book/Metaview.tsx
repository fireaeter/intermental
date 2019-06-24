import React from "react";
import { History } from "history";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { idea } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { connect } from "react-redux";
import { IBook } from "../../reducers/book";
import { ITheme } from "../../reducers/theme";
import { IAppState } from "../../reducers";

import * as bookActions from "../../actions/book";

interface IPropsFromState {
  history: History;
  match: any;
  book: IBook[];
  theme: ITheme;
}
interface IPropsFromDispatch {
  getBook: (name: string) => void;
}

type AllProps = IPropsFromState & IPropsFromDispatch;

class Metaview extends React.Component<AllProps> {
  componentDidMount() {
    let book_name = this.props.match.params.name;
    this.props.getBook(book_name);
  }
  render() {
    if (this.props.book["book"].length !== 0) {
      let book = this.props.book["book"];
      return (
        <SyntaxHighlighter
          language="javascript"
          style={this.props.theme.theme == "light" ? idea : dark}
        >
          {JSON.stringify(
            JSON.parse(JSON.stringify(book["book"][0]["content"])),
            null,
            2
          )}
        </SyntaxHighlighter>
      );
    } else {
      console.log(this.props.book);
      return <h2>Metaview component</h2>;
    }
  }
}

// prettier-ignore
export default connect<any, any>(
  state => (state: IAppState) => ({
    book: state.bookState,
    theme: state.themeState
  }),
  dispatch => (dispatch: any): IPropsFromDispatch => ({
    getBook: (name: string) => dispatch(bookActions.getBook(name))
  })
)(Metaview);
