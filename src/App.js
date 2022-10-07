import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/1.png";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 860px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  @media (min-width: 700px) {
    width: 650px;
    height:650px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Pillars And Rings NFT Minter");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        // gasLimit: "285000",
        to: "0xBBD7402244a1A1af4ac06948e1Ce99a0F108DED5",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((6 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "You are now an owner of a Subtlemint.io Pillars and Rings NFT. Visit Opensea.io to view it."
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor:"#f8edeb" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
      <s.TextDescription style={{ color:`#000000`, fontSize: 20}}><a href="https://opensea.io/collection/pillars-and-rings">Visit the collection on OpenSea.io.</a></s.TextDescription>
        <s.TextTitle style={{ textAlign: "center", fontSize: 40, fontWeight: "bold", color: `#000000` }}>
            Pillars and Rings: NFT Minter
        </s.TextTitle>
        
        <s.TextTitle style={{ textAlign: "center", fontSize: 16, color: `#000000`
 }}>
Please make sure you are connected to (Polygon
            Mainnet) and the correct contract address. <a href="https://polygonscan.com/address/0xbbd7402244a1a1af4ac06948e1ce99a0f108ded5" >0xbbd7402244a1a1af4ac06948e1ce99a0f108ded5</a></s.TextTitle>
        <s.SpacerMedium />

        {/* <s.SpacerMedium /> */}
        <ResponsiveWrapper flex={1} style={{ padding: 24, backgroundColor: "#EED7D2" }}>
          
          <s.Container flex={1} jc={"center"} ai={"center"} >
          
         
            <StyledImg alt={"example"} src={i1} />
            <s.SpacerXSmall />

            <s.TextTitle 
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold"}} >
              {data.totalSupply}/1000 Minted
            </s.TextTitle>
  
          </s.Container>
          {/* <s.SpacerMedium /> */}
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ padding: 24 }}
          >
            {Number(data.totalSupply) === 1000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                  We are Sold Out! The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still Pillars And Rings on{" "}
                  <a
                    target={"_self"}
                    href={"https://opensea.io/collection/ringsandpillars"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : ( //
              <>
                <s.TextTitle style={{ textAlign: "center", fontSize: 35 }}>
                  1 PAR costs 6 MATIC.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center", fontSize: 20 }}>
                  Excluding gas fee.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" }}>
                     Remember: Connect to the POLYGON network
                    </s.TextDescription>
                    <s.SpacerSmall />

                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(1);
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "BUY 1"}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
            {/* Please make sure you are connected to the right network (Polygon
            Mainnet) and the correct address.  */}
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
            We have set the gas limit to 285000 for the contract to successfully
            mint your NFT. We recommend that you don't change the gas limit.
          </s.TextDescription> */}
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
