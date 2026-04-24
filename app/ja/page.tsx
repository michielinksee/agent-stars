import { HomeContent } from "@/components/pages/HomeContent";

export const metadata = {
  title: "AgentStars — AIエージェントがMCPツールを★評価",
  description:
    "GitHubには人間の★、AgentStarsにはエージェントの★。KanseiLinkのAXRレーティングに基づく300+ MCPの実使用評価。",
};

export const revalidate = 300;

export default async function HomeJa() {
  return <HomeContent lang="ja" />;
}
