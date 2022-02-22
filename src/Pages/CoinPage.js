import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SingleCoin } from "../Config/api";
import axios from "axios";
import parse from "html-react-parser";
import { CryptoState } from "../CryptoContent";
import CoinInfo from "../Components/CoinInfo";
import { numberWithCommas } from "../Components/CoinTable";
import {
  ThemeProvider,
  createTheme,
  makeStyles,
  Container,
  LinearProgress,
  Typography,
} from "@material-ui/core";

const CoinPage = () => {
  const { id } = useParams();
  const { currency, symbol } = CryptoState();
  const [coin, setCoin] = useState(null);

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;
  return (
    <ThemeProvider theme={theme}>
      <Container className={classes.container}>
        <div
          className={classes.sidebar}
          style={{ borderRight: "2px solid grey" }}
        >
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height={200}
            style={{ merginBottom: 20 }}
          />
          <Typography variant="h3" className={classes.heading}>
            {coin?.name}
          </Typography>
          <Typography variant="subtitle1" className={classes.descrption}>
            {parse(coin?.description.en.split(". ")[0])}.
          </Typography>
          <div className={classes.marketData} style={{ marginTop: 30 }}>
            <span style={{ display: "flex", marginBottom: 10 }}>
              <Typography variant="h5" className={classes.heading}>
                Rank:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {numberWithCommas(coin?.market_cap_rank)}
              </Typography>
            </span>

            <span style={{ display: "flex", marginBottom: 10 }}>
              <Typography variant="h5" className={classes.heading}>
                Current Price:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </span>
            <span style={{ display: "flex", marginBottom: 10 }}>
              <Typography variant="h5" className={classes.heading}>
                Market Cap:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)
                )}
                M
              </Typography>
            </span>
          </div>
        </div>
        <CoinInfo coin={coin} />
      </Container>
    </ThemeProvider>
  );
};

export default CoinPage;
const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));
