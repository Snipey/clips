import { FunctionComponent } from "react";
import styled from "styled-components";
import Link from "next/link";
import Head from "next/head";

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <Body>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎥</text></svg>"
        />
        <meta name="twitter:creator" content="@SnipeyDev" />
        <meta name="twitter:site" content="@SnipeyDev" />
      </Head>
      <Header>
        <Brand className="image">
          <Link href="/">
            <a>
              <span title="rip">🎥</span>
            </a>
          </Link>
        </Brand>
        <Nav>
          <Button href="https://medal.tv/users/102296" target="_blank">
            <button>Go to medal.tv</button>
          </Button>
          <Button href="https://snipey.dev">
            <button className="accent">Go to snipey.dev</button>
          </Button>
        </Nav>
      </Header>
      <Content>
        {children}
      </Content>
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  background: ${(props) => props.theme.darker};
  border-bottom: 1px solid ${(props) => props.theme.accent};
`;

const Brand = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  padding: 8px 25px;
  flex: 1;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.color};
  }

  &.image {
    letter-spacing: 10px;

    img {
      vertical-align: middle;
      height: 25px;
      padding-bottom: 5px;
      padding-right: 15px;
    }
  }
`;

const Nav = styled.div`
  margin: 11px 15px;
`;

const Button = styled.a`
  text-decoration: none;
  margin-left: 15px;

  button {
    padding: 10px 25px;
    background: transparent;
    color: ${(props) => props.theme.accent};
    border: 1px solid ${(props) => props.theme.accent};
    border-radius: 6px;
    cursor: pointer;

    &:hover,
    &.accent {
      background: ${(props) => props.theme.accent};
      color: ${(props) => props.theme.background};
    }

    &.accent:hover {
      background: transparent;
      color: ${(props) => props.theme.accent};
    }
  }
`;

const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Footer = styled.div`
  color: ${(props) => props.theme.grey};
  text-align: center;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.accent};
    opacity: 0.75;

    &:hover {
      opacity: 1;
    }
  }
`;
