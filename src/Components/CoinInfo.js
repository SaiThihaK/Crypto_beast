import {
  createTheme,
  ThemeProvider,
  CircularProgress,
  Container,
  makeStyles,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../Config/api";
import { CryptoState } from "../CryptoContent";
import axios from "axios";

const CoinInfo = ({ coin }) => {
  const { currency, symbol } = CryptoState();
  // useState
  const [historicalChartData, setHistoricalChartData] = useState([]);
  const [days, setDays] = useState(1);
  const [counter, setCounter] = useState(0);
  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalChartData(data.prices);
  };
  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);
  const classes = useStyles();
  console.log(historicalChartData);
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>{/* <Line /> */}</div>
    </ThemeProvider>
  );
};

export default CoinInfo;

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    mode: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));
