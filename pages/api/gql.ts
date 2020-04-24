import { ApolloServer, gql } from "apollo-server-micro";
import "isomorphic-fetch";
import { Category, Clips, Clip } from "../../interfaces/clips";
const token = process.env.MEDAL_TV_KEY;
const typeDefs = gql`
  type Query {
    clip(contentId: String): Clip
    clips: [Clip]
    categories: [Category]
    lastUpdated: Date
  }

  scalar Date

  type Clip {
    contentId: String
    rawFileUrl: String
    rawFileUrlLowRes: String
    unbrandedFileUrl: String
    contentTitle: String
    contentViews: Int
    contentLikes: Int
    contentThumbnail: String
    categoryId: Int
    videoLengthSeconds: Int
    createdTimestamp: Int
    directClipUrl: String
    embedIframeCode: String
    credits: String
  }

  type Category   {
    categoryId: Int
    categoryName: String,
    alternativeName: String
  },
`;

let clips: Clip[] = [];
let categories: Category[] = [];
let lastUpdated = null;

const updateData = async (): Promise<void> => {
  // Check if last updated is greater than 10 minutes
  if (lastUpdated !== null && (new Date().getTime() - lastUpdated.getTime()) / 1000 < 600) return;
  const catData: Array<Category> = await fetch(
    `https://developers.medal.tv/v1/categories`,
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((data) => data.json());

  categories = catData.map((category: Category) => ({
    ...category,
  }));
  
  // TODO Get Clips
  const clipData: Clips = await fetch(
    `https://developers.medal.tv/v1/latest?userId=102296&limit=1000&offset=0`,
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((data) => data.json());

  clips = clipData.contentObjects.map((clip: Clip) => ({
    ...clip,
    createdTimestamp: clip.createdTimestamp / 1000,
  }));

  // Set last updated
  lastUpdated = new Date();
}
updateData();
	setInterval(async () => {
    await updateData();
	}, 1000 * 600);

const resolvers = {
  Query: {
    async categories(): Promise<Category[]> {
      await updateData();
      return categories;
    },
    // async category(_: any, { categoryId }: { categoryId: string }): Promise<Category> {
    //   await updateData();
    //   return categories.filter((category) => category.categoryId.toString() === categoryId)[0];
    // },
    async clips(): Promise<Clip[]> {
      await updateData();
      return clips;
    },
    async clip(_: any, { contentId }: { contentId: string }): Promise<Clip> {
      await updateData();
      return clips.filter((clip) => clip.contentId === contentId)[0];
    },
    async lastUpdated(): Promise<string | null> {
      return lastUpdated || new Date();
    },
  },
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground: false,
}).createHandler({ path: "/api/gql" });
