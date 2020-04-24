import { NextPage } from "next";
import { fetcher } from "../lib/fetcher";
import { Clip, Category, Categories } from '../interfaces/clips';
import ErrorPage from "./_error";
import styled from "styled-components";
import { timeSince } from "../lib/timeSince";
import { rgba } from "polished";
import { ClipsBody, Heading } from "../components/clips";
import Link from "next/link";
import Head from "next/head";

const clipsQuery = `
query {
  lastUpdated
  clips {
    contentId
    categoryId
    directClipUrl
    contentTitle
    contentViews
    contentThumbnail
    createdTimestamp
    videoLengthSeconds
  }
  categories {
    categoryId
    categoryName
    alternativeName
  }
}
`;

interface Props {
  categories?: Category[];
  clips?: Clip[];
  lastUpdated?: string;
  error?: string;
}
function sec2time(timeInSeconds: number) {
  let pad = function(num, size) { return ('000' + num).slice(size * -1); };
  let time: number = timeInSeconds;
  let minutes = Math.floor(time / 60) % 60;
  let seconds = Math.floor(time - minutes * 60);

  return pad(minutes, 2) + ':' + pad(seconds, 2);
}
const ClipsPage: NextPage<Props> = ({ categories, clips, lastUpdated, error }) => {
  if (error) return <ErrorPage err={error} statusCode={500} />;

  function getCategory(id: number){
    return categories.filter(cat => cat.categoryId == id)
  }
  return (
    <ClipsBody>
      <Head>
        <title>Snipey's Medal TV Clips</title>
      </Head>
      <Heading>
        <h1>Latest Clips</h1>
        <p>Last Updated: {lastUpdated}</p>
      </Heading>
        {/* 
        // TODO Show game categories
        // TODO Show latest clips */}
      <ClipsContainer>
        {clips.map((clip: Clip) => (
          <Link key={clip.contentId} href="/[clip]" as={`/${clip.contentId.replace("cid", "")}`}>
            <a>
              <div className="clip" key={clip.contentId}>
                <div className="meta">
                  <img src={clip.contentThumbnail} />
                  <ClipMeta horizontal="right" vertical="bottom">
                    {clip.contentViews} views
                  </ClipMeta>
                  <ClipMeta horizontal="left" vertical="bottom">
                    {sec2time(clip.videoLengthSeconds)}
                  </ClipMeta>
                </div>
                <p>{clip.contentTitle}</p>
                <ClipInfo>
                  <InfoItem>
                    {getCategory(clip.categoryId).map((category: Category) => (
                      category.categoryName
                    ))}
                  </InfoItem>
                  <InfoItem>
                    {timeSince(clip.createdTimestamp * 1000)}
                  </InfoItem>
                </ClipInfo>
              </div>
            </a>
          </Link>
        ))}
      </ClipsContainer>
    </ClipsBody>
  );
};

ClipsPage.getInitialProps = async () => {
  try {
    const { data, errors } = await fetcher(clipsQuery).then((data) =>
      data.json()
    );

    return {
      clips: data?.clips,
      categories: data?.categories,
      lastUpdated: data?.lastUpdated ? timeSince(data.lastUpdated) : null,
      error: errors && errors[0]?.message,
    };
  } catch (e) {
    return { error: "Failed to load clips" };
  }
};

export default ClipsPage;

const ClipsContainer = styled.div`
  display: grid;
  margin-top: 15px;
  grid-template-columns: 100%;

  @media only screen and (min-width: 850px) {
    grid-template-columns: 50% 50%;
  }
  @media only screen and (min-width: 1000px) {
    grid-template-columns: 33.333% 33.333% 33.333%;
  }
  @media only screen and (min-width: 1300px) {
    grid-template-columns: 25% 25% 25% 25%;
  }

  @media only screen and (min-width: 1500px) {
    grid-template-columns: 20% 20% 20% 20% 20%;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.color};
  }

  div.clip {
    background: ${(props) => props.theme.darker};
    margin: 10px;
    display: flex;
    border-radius: 25px;
    flex-direction: column;
    cursor: pointer;

    &:hover {
      background: ${(props) => props.theme.accent};
      color: ${(props) => props.theme.darker};
    }

    p {
      margin: 10px 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    div.meta {
      position: relative;
      display: flex;

      img {
        width: 100%;
        border-radius: 25px 25px 0px 0px;
      }
    }
  }
`;

const ClipMeta = styled.div<{
  horizontal: "left" | "right";
  vertical: "top" | "bottom";
}>`
  position: absolute;
  color: ${(props) => props.theme.color};
  background: ${(props: any) => rgba(props.theme.darker, 0.75)};
  padding: 0 10px;
  font-size: 0.8rem;

  ${(props) => props.horizontal}: 0;
  ${(props) => props.vertical}: 0;
`;

const ClipInfo = styled.ul`
  display: flex;
  align-items: stretch; /* Default */
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const InfoItem = styled.li`
  display: block;
  flex: 0 1 auto; /* Default */
  list-style-type: none;
  font-size: 0.8em;
  color: lightgrey;
  padding: 2px 15px 2px 15px;
`;