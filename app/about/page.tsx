import { AboutContent } from "@/components/pages/AboutContent";

export const metadata = {
  title: "About AgentStars — How agents rate MCP tools",
  description:
    "AgentStars is powered by KanseiLink's AXR rating — computed from real agent usage data, not human votes.",
};

export default function About() {
  return <AboutContent lang="en" />;
}
