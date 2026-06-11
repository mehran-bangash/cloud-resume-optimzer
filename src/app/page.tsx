"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useResumeForm, CVTemplate } from "@/viewmodels/useResumeForm";
import CVPreview from "@/components/CVPreview";
import AppHeader from "@/components/app/AppHeader";
import LeftPanel from "@/components/app/LeftPanel";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const { data: session } = useSession();
  const [showApp, setShowApp] = useState(false);

  if (showApp || session) {
    return <AppView onBack={() => setShowApp(false)} />;
  }
  return <LandingPage onGetStarted={() => setShowApp(true)} />;
}

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

function AppView({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();
  
  const {
    resume, isGenerating, isCheckingATS, atsMessage,
    selectedTemplate, setSelectedTemplate,
    setJobDescription, updateField, optimize, checkATS,
    keywordGap, isAnalyzingKeywords, jobDescription,
    addKeyword, addAllKeywords,
    isUploadingCV, setIsUploadingCV, handleParsedCV,
    coverLetter, isGeneratingCoverLetter, generateCoverLetter,
    loadVersion,
  } = useResumeForm();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader
        onBack={onBack}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
      <div className="flex flex-col lg:grid lg:grid-cols-[344px_1fr] min-h-[calc(100vh-57px)]">
        <LeftPanel
          atsScore={resume.atsScore ?? 82}
          isGenerating={isGenerating}
          isAnalyzingKeywords={isAnalyzingKeywords}
          keywordGap={keywordGap}
          hasJobDescription={jobDescription.trim().length > 0}
          onOptimize={optimize}
          onJobDescriptionChange={setJobDescription}
          onAddKeyword={addKeyword}
          onAddAllKeywords={addAllKeywords}
          isUploadingCV={isUploadingCV}
          setIsUploadingCV={setIsUploadingCV}
          onParsedCV={handleParsedCV}
          coverLetter={coverLetter}
          isGeneratingCoverLetter={isGeneratingCoverLetter}
          onGenerateCoverLetter={generateCoverLetter}
          currentResume={resume}
          isLoggedIn={!!session}
          onLoadVersion={loadVersion}
        />
        <div className="overflow-y-auto bg-slate-950 p-4 md:p-8">
          <div id="cv-preview-container">
            <CVPreview
              resume={resume}
              updateField={updateField}
              onCheckATS={checkATS}
              isCheckingATS={isCheckingATS}
              atsMessage={atsMessage}
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}