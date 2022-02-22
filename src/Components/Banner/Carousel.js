import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { CryptoState } from "../../CryptoContent";
import axios from "axios";
import { TrendingCoins } from "../../Config/api";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../CoinTable";

const Carousel = () => {
  const [trendingCoin, setTrendingCoin] = useState([]);
  const { currency, symbol } = CryptoState();
  const classes = useStyles();
  const fetchTrending = async () => {
    const { data } = await axios(TrendingCoins(currency));
    setTrendingCoin(data);
  };
  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const items = trendingCoin.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;
    return (
      <Link
        key={coin.id}
        to={`/coin/${coin.id}`}
        className={classes.carouselItems}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {" "}
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    640: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));
