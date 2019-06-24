import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Paper from "@material-ui/core/Paper";
import { History } from "history";
import Moment from "moment";

interface IPropsFromState {
  history: History;
}

interface IProps {
  data: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto"
    },
    table: {
      minWidth: 650
    }
  })
);

type AllTypes = IPropsFromState & IProps;

function ResultsTable(props: AllTypes) {
  const classes = useStyles();
  console.log(props);
  if(props.data.length !== 0) {
    return (
      <Paper className={classes.root}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Book name</TableCell>
              <TableCell align="right">Author</TableCell>
              <TableCell align="right">Created</TableCell>
              {/* <TableCell align="right">Keywords</TableCell> */}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((item, key) => {
              var created_date = Moment.unix(item[0].content.created).format(
                "DD/MM/YYYY HH:mm"
              );
              return (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {item[0].content.name}
                  </TableCell>
                  <TableCell align="right">{item[0].content.author}</TableCell>
                  <TableCell align="right">{created_date}</TableCell>
                  {/* <TableCell align="right"></TableCell> */}
                  <TableCell align="right">
                    {" "}
                    <IconButton
                      onClick={() => {
                        props.history.push("/book/" + item[0].content.name);
                      }}
                    >
                      <ArrowForwardIcon fontSize="small" />
                    </IconButton>{" "}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }else {
    return <h3>There is nothing was found by your query</h3>
  }
}

export default ResultsTable;
