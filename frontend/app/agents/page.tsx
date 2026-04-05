import {
  BookIcon,
  ChartIcon,
  EyeIcon,
  ImageIcon,
  MicIcon,
  PaperclipIcon,
  RobotIcon,
  ScreenIcon,
  SearchIcon,
  SendIcon,
  SparkleIcon,
  VideoIcon
} from "@/components/shared/app-icons";

const taskList = [
  "Dashboard Layout Adju...",
  "Design agent system pr...",
  "Configure tool integrati..."
];

const tabs = [
  { label: "Use cases", icon: <SparkleIcon className="h-4 w-4" />, active: true },
  { label: "Build a business", icon: <BookIcon className="h-4 w-4" /> },
  { label: "Help me learn", icon: <BookIcon className="h-4 w-4" /> },
  { label: "Monitor the situation", icon: <EyeIcon className="h-4 w-4" /> },
  { label: "Research", icon: <SearchIcon className="h-4 w-4" /> },
  { label: "Create content", icon: <PaperclipIcon className="h-4 w-4" /> },
  { label: "Analyze & research", icon: <ChartIcon className="h-4 w-4" /> }
];

const suggestions = [
  { icon: <SparkleIcon className="h-5 w-5" />, label: "Build a space exploration timeline app" },
  { icon: <ChartIcon className="h-5 w-5" />, label: "Create a real-time stock market tracker" },
  { icon: <RobotIcon className="h-5 w-5" />, label: "Prototype an AI chatbot demo application" },
  { icon: <BookIcon className="h-5 w-5" />, label: "Create a project management Kanban board" }
];

export default function AgentsPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#26231f]">
      <div className="grid min-h-screen grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-[#e6ddd2] bg-white/65 px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#cb682b] text-white">
              <RobotIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-[2rem] font-semibold tracking-[-0.05em]">Agent Builder</h1>
              <p className="mt-1 text-[1.02rem] leading-7 text-[#6d645b]">
                Create powerful AI agents using any model. Pick a template or start from scratch.
              </p>
            </div>
          </div>

          <button className="mt-5 w-full rounded-full bg-[#cb682b] px-5 py-4 text-[1.05rem] font-semibold text-white" type="button">
            + New Agent
          </button>

          <div className="mt-5 rounded-[22px] border border-[#f0c5a6] bg-[#fff6f0] px-5 py-5">
            <p className="flex items-center gap-2 text-[1.25rem] font-semibold">✦ Not sure where to start?</p>
            <p className="mt-3 text-[1.02rem] leading-8 text-[#705f53]">
              Chat with our AI guide to describe what you want your agent to do and get a personalised setup plan.
            </p>
            <button className="mt-4 rounded-full border border-[#d7c2b3] bg-white px-5 py-3 text-[1.02rem] font-medium text-[#2a241e]" type="button">
              Ask the Hub →
            </button>
          </div>

          <button className="mt-6 w-full rounded-2xl border border-dashed border-[#d2c8bc] bg-[#faf7f2] px-5 py-4 text-left text-[1.05rem] font-semibold text-[#695f55]" type="button">
            + New Task
          </button>

          <div className="mt-3 divide-y divide-[#ece3d8]">
            {taskList.map((task) => (
              <div key={task} className="flex items-center gap-3 py-4 text-[1.03rem] text-[#2f2924]">
                <input type="checkbox" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="bg-white/35">
          <div className="border-b border-[#e6ddd2] px-6 py-8 text-center">
            <h2 className="text-[3.7rem] font-semibold tracking-[-0.07em] text-[#16120f]">
              Agent works <span className="text-[#cb682b]">for you.</span>
            </h2>
            <p className="mt-3 text-[1.18rem] text-[#6a6157]">
              Your AI agent takes care of everything, end to end.
            </p>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 rounded-[20px] border border-[#d7cec3] bg-[#faf7f2]">
                <div className="px-4 py-4 text-[1.08rem] text-[#7b7269]">What should we work on next?</div>
                <div className="flex items-center justify-between border-t border-[#e4dbcf] px-4 py-3">
                  <div className="flex items-center gap-2">
                    {[
                      { icon: <MicIcon className="h-4 w-4" />, tone: "bg-[#f4edff] text-[#8b5cf6]" },
                      { icon: <RobotIcon className="h-4 w-4" />, tone: "bg-[#fff6df] text-[#d28a09]" },
                      { icon: <VideoIcon className="h-4 w-4" />, tone: "bg-[#edf4ff] text-[#4a77ff]" },
                      { icon: <ScreenIcon className="h-4 w-4" />, tone: "bg-[#eaf8f0] text-[#1f8d67]" },
                      { icon: <PaperclipIcon className="h-4 w-4" />, tone: "bg-[#fff0f4] text-[#da4e79]" },
                      { icon: <ImageIcon className="h-4 w-4" />, tone: "bg-[#eafaf1] text-[#2aa56d]" },
                      { icon: <SparkleIcon className="h-4 w-4" />, tone: "text-[#bbb2a8]" }
                    ].map((item, index) => (
                      <button
                        key={index}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.tone}`}
                        type="button"
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-[#9b9085]">Agent</span>
                </div>
              </div>
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cb682b] text-white" type="button">
                <SendIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[1.02rem] font-medium ${
                    tab.active
                      ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                      : "border-[#d8d0c5] bg-white text-[#554d44]"
                  }`}
                  type="button"
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-[18px] border border-[#ece3d8] bg-white/50">
              {suggestions.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    index < suggestions.length - 1 ? "border-b border-[#ece3d8]" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ddd4ca] bg-[#faf7f2]">
                    {item.icon}
                  </div>
                  <p className="text-[1.06rem] text-[#5d544b]">{item.label}</p>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-[#ece3d8] px-5 py-4">
                <button className="text-[1.02rem] text-[#675e54]" type="button">
                  View all suggestions →
                </button>
                <button className="text-[1.02rem] text-[#675e54]" type="button">
                  ↗ Shuffle
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#a59a8e]">
              Agent templates <span className="rounded-md bg-[#f1ece6] px-2 py-1">6</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
