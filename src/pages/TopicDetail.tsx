import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PageHeader, Tabs, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { getTopicBySlug } from "@/data/mockTopics";
import { isTopicSaved as isTopicSavedStorage, saveTopic as saveTopicStorage } from '@/lib/mockStorage';
import { toast } from 'sonner';
import { ReadTab } from "./topic/ReadTab";
import { VocabularyTab } from "./topic/VocabularyTab";
import { SentenceTab } from "./topic/SentenceTab";
import { SpeakTab } from "./topic/SpeakTab";
import { InterviewTab } from "./topic/InterviewTab";
import { ArrowRight, Target, Sparkles, MessageSquare, Mic } from "lucide-react";

const tabKeys = ["Read", "Vocabulary", "Sentence", "Speak", "Interview"];

const outcomeKeys: Record<string, string> = {
  Read: "topic.outcomeRead",
  Vocabulary: "topic.outcomeVocabulary",
  Sentence: "topic.outcomeSentence",
  Speak: "topic.outcomeSpeak",
  Interview: "topic.outcomeInterview",
};



function TopicDetailContent({ topic }: { topic: NonNullable<ReturnType<typeof getTopicBySlug>> }) {
  const { t } = useI18n();
  const [tab, setTab] = useState("Read");
  const [topicSaved, setTopicSaved] = useState(() => isTopicSavedStorage(topic.slug));

  const tabLabels = tabKeys.map((k) => t('topic.tab' + k));

  const handleSaveTopic = () => {
    if (topicSaved) {
      toast.info(t('topic.topicAlreadySaved'));
    } else {
      saveTopicStorage(topic.slug);
      setTopicSaved(true);
      toast.success(t('topic.topicSaved'));
    }
  };

  const previewItems = [
    { tabKey: "Vocabulary", icon: Sparkles, label: topic.vocabulary[0]?.term ?? '', body: topic.vocabulary[0]?.definitionEn ?? '' },
    { tabKey: "Sentence", icon: MessageSquare, label: t('sentence.pattern'), body: topic.sentencePatterns[0]?.pattern ?? '' },
    { tabKey: "Speak", icon: Mic, label: t('speak.prompt'), body: topic.speakingPrompt.prompt.slice(0, 60) + '…' },
    { tabKey: "Interview", icon: MessageSquare, label: t('interview.question'), body: topic.interviewQuestion.question.slice(0, 60) + '…' },
  ];

  const currentTabLabel = tabLabels[tabKeys.indexOf(tab)];

  return (
    <div>
      <PageHeader
        title={`${topic.title}${topic.titleZh ? ` · ${topic.titleZh}` : ''}`}
        subtitle={topic.explainGoal}
        actions={
          <>
            <span className="chip">{topic.level} · {t('unit.unit')} {topic.unit}{t('unit.of')}{topic.totalUnits}</span>
            <Button variant="outline" size="md" onClick={handleSaveTopic}>
              {topicSaved ? t('common.saved') : t('common.save')}
            </Button>
            <Link to="/technical-english">
              <Button>{t('common.back')} <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </>
        }
      />

      <div className="panel">
        <Tabs
          tabs={tabLabels}
          active={currentTabLabel}
          onChange={(label) => {
            const idx = tabLabels.indexOf(label);
            if (idx >= 0) setTab(tabKeys[idx]);
          }}
        />

        <div className="px-6 py-3 border-b border-border bg-accent/40 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('topic.learningOutcome')}</span>
          <span className="text-sm text-foreground">{t(outcomeKeys[tab] ?? '')}</span>
        </div>

        <div className="p-6">
          {tab === "Read" && <ReadTab key={topic.slug} topic={topic} />}
          {tab === "Vocabulary" && <VocabularyTab key={topic.slug} topic={topic} />}
          {tab === "Sentence" && <SentenceTab key={topic.slug} topic={topic} />}
          {tab === "Speak" && <SpeakTab key={topic.slug} topic={topic} />}
          {tab === "Interview" && <InterviewTab key={topic.slug} topic={topic} />}
        </div>

        <div className="border-t border-border bg-background/50 p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 px-1">
            {t('topic.previewOtherTabs')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {previewItems.map((item) => {
              const itemLabel = tabLabels[tabKeys.indexOf(item.tabKey)];
              return (
                <button
                  key={item.tabKey}
                  onClick={() => setTab(item.tabKey)}
                  className="panel p-3 text-left hover:border-primary/40 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary font-semibold">
                    <item.icon className="w-3 h-3" /> {itemLabel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.body}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopicDetailRoute() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;

  if (!topic) {
    return <Navigate to="/technical-english" replace />;
  }

  return <TopicDetailContent key={topic.slug} topic={topic} />;
}
