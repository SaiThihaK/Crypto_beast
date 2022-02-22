import {
  createTheme,
  ThemeProvider,
  CircularProgress,
  Container,
  makeStyles,
  LinearProgress,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../Config/api";
import { CryptoState } from "../CryptoContent";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";

const CoinInfo = ({ coin }) => {
  const { currency } = CryptoState();
  // useState
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const [flag, setflag] = useState(false);
  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setflag(true);
    setHistoricData(data.prices);
  };
  // This is the dummy data for chart to test it out what is the real problem
  // what I tryinf to do is
  // const data ={
  //   labels:historicData.map((coin)=>{
  //   let date = new Date(coin[0]);
  //   let time = date.getHours()>12 ?
  //   `${date.getHours()-12}:${date.getMinutes()}PM`:
  //   `${date.getHours()}:${date.getMinutes()}AM`;
  //   return days===1 ? time : date.toLocaleDateString();
  // })
  // }
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774",
      },
    ],
  };

  console.log(coin.id);
  console.log(data);
  // I can console.log historicData but I get error when I map the historic data
  console.log({ historicData });
  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {historicData ? (
          <Line data={data} />
        ) : (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        )}
      </div>
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
