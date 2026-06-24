import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import TechnicalEnglish from "./pages/TechnicalEnglish";
import TopicDetail from "./pages/TopicDetail";
import InterviewEnglish from "./pages/InterviewEnglish";
import WorkplaceEnglish from "./pages/WorkplaceEnglish";
import AIInterviewLobby from "./pages/AIInterviewLobby";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewReport from "./pages/InterviewReport";
import ReportPractice from "./pages/ReportPractice";import Review from "./pages/Review";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";import SearchResults from "./pages/SearchResults";
import TechnicalPathDetail from "./pages/TechnicalPathDetail";
import NotFound from "./pages/NotFound";
import LearningPathDetail from "./pages/LearningPathDetail";
import ReviewSession from "./pages/ReviewSession";
import TechnicalPlan from "./pages/TechnicalPlan";
import InterviewScenarioDetail from "./pages/InterviewScenarioDetail";
import InterviewQuestionBankDetail from "./pages/InterviewQuestionBankDetail";
import StarExamples from "./pages/StarExamples";
import Notifications from "./pages/Notifications";
import WorkplaceScenarioDetail from "./pages/WorkplaceScenarioDetail";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
            <Route path="/technical-english" element={<TechnicalEnglish />} />
            <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            <Route path="/technical-english/paths/:pathSlug" element={<TechnicalPathDetail />} />
            <Route path="/technical-english/:topicSlug" element={<TopicDetail />} />
            <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            <Route path="/interview-english/question-banks/:bankSlug" element={<InterviewQuestionBankDetail />} />
            <Route path="/interview-english/star-examples" element={<StarExamples />} />
            <Route path="/interview-english" element={<InterviewEnglish />} />
            <Route path="/workplace-english" element={<WorkplaceEnglish />} />
            <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />            <Route path="/ai-interview" element={<AIInterviewLobby />} />
            <Route path="/ai-interview/room" element={<InterviewRoom />} />
            <Route path="/ai-interview/report" element={<InterviewReport />} />
            <Route path="/ai-interview/report/:reportId" element={<InterviewReport />} />
            <Route path="/ai-interview/report/:reportId/practice" element={<ReportPractice />} />            <Route path="/review/session" element={<ReviewSession />} />
            <Route path="/review" element={<Review />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />            <Route path="/notifications" element={<Notifications />} />            <Route path="/search" element={<SearchResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
