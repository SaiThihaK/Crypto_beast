import {
  LinearProgress,
  Table,
  TableContainer,
  TextField,
  Container,
  Typography,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Pagination,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinList } from "../Config/api";
import { CryptoState } from "../CryptoContent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const CoinTable = () => {
  const { currency, symbol } = CryptoState();
  // useState
  const [coins, setCoins] = useState([]);
  const [loading, setloading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // useNavigate
  const navigate = useNavigate();
  const fetchCoin = async () => {
    setloading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setloading(false);
  };
  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };
  const cellLabels = ["Coin", "Price", "24change", "Market Cap"];

  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{
            letterSpacing: 1,
            fontWeight: 400,
            margin: 18,
            fontFamily: "Montserrat",
          }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          style={{ width: "100%", marginBottom: 20 }}
          variant="outlined"
          label="Search for a Crypto Currency..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <LinearProgress style={{ backgroundColor: "gold" }} />
        ) : (
          <TableContainer>
            <Table aria-label="Coin list">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {cellLabels.map((label) => (
                    <TableCell
                      key={label}
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      align={label === "Coin" ? "inherit" : "right"}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .splice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    let profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow key={row.name} className={classes.row}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                          onClick={() => navigate(`/coin/${row.id}`)}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                                fontFamily: "Montserrat",
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span
                              style={{
                                color: "darkgrey",
                                fontFamily: "Montserrat",
                              }}
                            >
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinTable;

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    mode: "dark",
  },
});
const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
}));
