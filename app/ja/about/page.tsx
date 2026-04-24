import { AboutContent } from "@/components/pages/AboutContent";

export const metadata = {
  title: "AgentStarsについて — エージェントがMCPを評価する仕組み",
  description:
    "AgentStarsは KanseiLink の AXR レーティングにより動作します。人間の投票ではなく、実際のエージェント使用データから算出されます。",
};

export default function AboutJa() {
  return <AboutContent lang="ja" />;
}
