/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
"use client";
import { NextPage } from "next";
import { motion } from "framer-motion";
import styled from "styled-components";
import Head from "next/head";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: "Roboto", sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 800px;
  width: 100%;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  text-align: center;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 18px;
  text-align: justify;
  font-weight: 400;
`;

const Technologies = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const TechItem = styled(motion.a)<{ color: string }>`
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;

  img {
    width: 50px;
    height: 50px;
    filter: grayscale(100%);
    transition: all 0.3s ease-in-out;
  }

  span {
    margin-top: 5px;
    font-size: 12px;
    color: ${(props) => props.color};
    text-align: center;
    white-space: nowrap;
    font-weight: 500;
  }

  &:hover {
    border-color: ${(props) => props.color};

    img {
      filter: none;
    }

    span {
      color: ${(props) => props.color};
    }
  }
`;

const About: NextPage = () => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Container>
        <Card>
          <Section>
            <Title>TicketX Project</Title>
          </Section>
          <Section>
            <Description>
              TicketX Project is a small website project which allow customers
              inspect and evaluate events and buy ticket.
              <br />
              <br />
              Here is used technologies for this project:
            </Description>
          </Section>
          <Section>
            <Technologies>
              <TechItem
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                color="#61DAFB"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                  alt="React"
                />
                <span>React</span>
              </TechItem>
              <TechItem
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                color="#000"
              >
                <img
                  src="https://cdn.worldvectorlogo.com/logos/next-js.svg"
                  alt="NextJS"
                />
                <span>NextJS</span>
              </TechItem>
              <TechItem
                href="https://www.framer.com/motion/"
                target="_blank"
                rel="noopener noreferrer"
                color="#0055FF"
              >
                <img
                  src="https://cdn.worldvectorlogo.com/logos/framer-motion.svg"
                  alt="Framer Motion"
                />
                <span>Framer Motion</span>
              </TechItem>
              <TechItem
                href="https://www.mysql.com/"
                target="_blank"
                rel="noopener noreferrer"
                color="#4479A1"
              >
                <img
                  src="https://www.svgrepo.com/show/303251/mysql-logo.svg"
                  alt="MySQL"
                />
                <span>MySQL</span>
              </TechItem>
              <TechItem
                href="https://zod.dev/"
                target="_blank"
                rel="noopener noreferrer"
                color="#FF5733"
              >
                <img src="/icons/zod.svg" alt="Zod" />
                <span>Zod</span>
              </TechItem>
              <TechItem
                href="https://fkhadra.github.io/react-toastify/"
                target="_blank"
                rel="noopener noreferrer"
                color="#FFCC00"
              >
                <img src="/icons/toast.svg" alt="Toast" />
                <span>Toast</span>
              </TechItem>
              <TechItem
                href="https://styled-components.com/"
                target="_blank"
                rel="noopener noreferrer"
                color="#DB7093"
              >
                <img
                  src="https://cdn.worldvectorlogo.com/logos/styled-components-1.svg"
                  alt="styled-components"
                />
                <span>styled-components</span>
              </TechItem>
              <TechItem
                href="https://axios-http.com/"
                target="_blank"
                rel="noopener noreferrer"
                color="#5A29E4"
              >
                <img src="/icons/axios.svg" alt="axios" />
                <span>axios</span>
              </TechItem>
              <TechItem
                href="https://ant.design/"
                target="_blank"
                rel="noopener noreferrer"
                color="#0170FE"
              >
                <img src="/icons/antd.svg" alt="antd" />
                <span>antd</span>
              </TechItem>
              <TechItem
                href="https://date-fns.org/"
                target="_blank"
                rel="noopener noreferrer"
                color="#0070f3"
              >
                <img src="/icons/date-fns.png" alt="date-fns" />
                <span>date-fns</span>
              </TechItem>
              <TechItem
                href="https://www.chartjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                color="#FF6384"
              >
                <img
                  src="https://www.chartjs.org/img/chartjs-logo.svg"
                  alt="Chart.js"
                />
                <span>Chart.js</span>
              </TechItem>
            </Technologies>
          </Section>
        </Card>
      </Container>
    </>
  );
};

export default About;
