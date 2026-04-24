import { HomeContent } from "@/components/pages/HomeContent";

export const revalidate = 300;

export default async function Home() {
  return <HomeContent lang="en" />;
}
