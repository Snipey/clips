//Next Imports
import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import styled from "styled-components";

// Util/Lib imports
import { fetcher } from "../lib/fetcher";
import { timeSince } from "../lib/timeSince";
import { rgba } from "polished";

// Interfaces
import { Clip, Category, Categories } from '../interfaces/clips';

// Components
import ErrorPage from "./_error";
import { ClipsBody } from "../components/clips";
import { Heading } from '../components/layout';

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

const ClipsIndex: NextPage<Props> = ({ categories, clips, lastUpdated, error }) => {
  if (error) return <ErrorPage err={error} statusCode={500} />;

  function getCategory(id: number){
    return categories.filter(cat => cat.categoryId == id)
  }
  return (
    <ClipsBody>
      <Head>
        <title>Snipey's Medal TV Clips</title>
      </Head>

      {/* Start Latest Clips section */}
      <Heading>
        <h1>Latest Clips</h1>
      </Heading>
      <ClipsContainer>
        {/*  TODO Limit the results to 5 */}
        {clips.map((clip: Clip) => (
          <Link key={clip.contentId} href="/[clip]" as={`/${clip.contentId.replace("cid", "")}`}>
          {/* TODO Create Clip template */}
            <a>
              <div className="clip" key={clip.contentId}>
                <div className="meta">
                  <img src={clip.contentThumbnail} />
                  {/* <ClipMeta horizontal="right" vertical="bottom">
                    {clip.contentViews} views
                  </ClipMeta>
                  <ClipMeta horizontal="left" vertical="bottom">
                    {sec2time(clip.videoLengthSeconds)}
                  </ClipMeta> */}
                </div>
                <p>{clip.contentTitle}</p>
                {/* <ClipInfo>
                  <InfoItem>
                    {getCategory(clip.categoryId).map((category: Category) => (
                      category.categoryName
                    ))}
                  </InfoItem>
                  <InfoItem>
                    {timeSince(clip.createdTimestamp * 1000)}
                  </InfoItem>
                </ClipInfo> */}
              </div>
            </a>
          </Link>
        ))}
      </ClipsContainer>
      {/* End Latest Clips */}

      {/* Start Categories */}

      {/* End Categories */}
    </ClipsBody>
  );
};

ClipsIndex.getInitialProps = async () => {
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

export default ClipsIndex;



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
    color: white;
    fon
  }

  div.clip {
    background: ${(props) => props.theme.darker};
    margin: 10px;
    display: flex;
    border-radius: 10px;
    flex-direction: column;
    cursor: pointer;

    div.published {
      position: relative;
    }

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
        border-radius: 10px 10px 0px 0px;
      }
    }
  }
`;

// const ClipMeta = styled.div<{
//   horizontal: "left" | "right";
//   vertical: "top" | "bottom";
// }>`
//   position: absolute;
//   color: ${(props) => props.theme.color};
//   background: ${(props: any) => rgba(props.theme.darker, 0.75)};
//   padding: 0 10px;
//   font-size: 0.8rem;

//   ${(props) => props.horizontal}: 0;
//   ${(props) => props.vertical}: 0;
// `;