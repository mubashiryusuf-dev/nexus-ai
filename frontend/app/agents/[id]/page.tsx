import { AgentChatPage } from "@/components/pages/agent-chat-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentPage({ params }: Props): Promise<JSX.Element> {
  const { id } = await params;
  return <AgentChatPage agentId={id} />;
}
