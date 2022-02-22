import {
  createTheme,
  ThemeProvider,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../Config/api";
import { CryptoState } from "../CryptoContent";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";
import { chartDays } from "../Config/data";
import SelectButton from "./SelectButton";

const CoinInfo = ({ coin }) => {
  const { currency } = CryptoState();
  // useState
  const [historicData, setHistoricData] = useState([]);
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
  const data = {
    labels: historicData.map((coin) => {
      let date = new Date(coin[0]);
      let time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()}PM`
          : `${date.getHours()}:${date.getMinutes()}AM`;
      return days === 1 ? time : date.toLocaleDateString();
    }),
    datasets: [
      {
        data: historicData.map((coin) => coin[1]),
        label: `Price ( Past ${days} Days ) in ${currency}`,
        borderColor: "#EEBC1D",
      },
    ],
  };

  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {historicData | (flag === true) ? (
          <>
            <Line
              data={data}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays?.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
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
