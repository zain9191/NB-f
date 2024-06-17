import React from "react";
import homeBackground from "../assets/imgs/Home-main.png";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const HomeBackgroundImg = styled.img`
  width: 100%;
  height: auto;
`;
const HomeMainDiv = styled.div`
  position: relative;
  width: 100%;
`;
const TitleDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 10px;
  border-radius: 50px;
  font-size: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 25px;
  overflow: hidden;
  width: fit-content;
  margin-top: 10px;
`;
const Input = styled.input`
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  outline: none;
  flex: 1;

  &::placeholder {
    color: #bbb;
  }
`;
const HomeFindButton = styled.button`
  background-color: #dc143c;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 15px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #a00016;
  }
`;
const Icon = styled.div`
  padding: 10px;
  font-size: 20px;
  color: #bbb;
`;

const ZipCodeInput = () => {
  return (
    <Container>
      <Icon>
        <FontAwesomeIcon icon={faLocationDot} />{" "}
      </Icon>
      <Input type="text" placeholder="Enter your ZIP code" />
      <HomeFindButton>Find Meals</HomeFindButton>
    </Container>
  );
};

const Home = () => (
  <HomeMainDiv>
    <div>
      <HomeBackgroundImg src={homeBackground}></HomeBackgroundImg>
    </div>
    <TitleDiv>
      <h1>Gourmet dishes created by talented local chefs</h1>
      <p>Discover nutritious, premium meals in your neighborhood.</p>
      <ZipCodeInput />
    </TitleDiv>
  </HomeMainDiv>
);

export default Home;
