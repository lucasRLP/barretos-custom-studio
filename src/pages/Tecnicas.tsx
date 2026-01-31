import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { TechniqueCard } from "@/components/TechniqueCard";
import { Button } from "@/components/ui/button";
import { TECHNIQUES, generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import { Phone, ArrowRight, HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const quizQuestions = [
  {
    id: "quantity",
    question: "Qual a quantidade estimada?",
    options: [
      { value: "small", label: "1 a 20 peças", techniques: ["dtf", "transfer"] },
      { value: "medium", label: "21 a 100 peças", techniques: ["dtf", "silk-screen", "sublimacao"] },
      { value: "large", label: "100+ peças", techniques: ["silk-screen", "sublimacao", "bordado"] },
    ],
  },
  {
    id: "art",
    question: "Como é a sua arte/logo?",
    options: [
      { value: "photo", label: "Foto ou degradê", techniques: ["dtf", "sublimacao", "transfer"] },
      { value: "solid", label: "Cores chapadas (1-4 cores)", techniques: ["silk-screen", "bordado"] },
      { value: "complex", label: "Muitas cores e detalhes", techniques: ["dtf", "sublimacao"] },
    ],
  },
  {
    id: "fabric",
    question: "Qual o tipo de tecido principal?",
    options: [
      { value: "cotton", label: "Algodão", techniques: ["dtf", "silk-screen", "bordado", "transfer"] },
      { value: "polyester", label: "Poliéster / Dry Fit", techniques: ["sublimacao", "dtf"] },
      { value: "mixed", label: "Misto / Não sei", techniques: ["dtf", "silk-screen"] },
    ],
  },
];

export default function Tecnicas() {
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const scores: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = quizQuestions.find((q) => q.id === questionId);
      const option = question?.options.find((o) => o.value === answerValue);
      option?.techniques.forEach((tech) => {
        scores[tech] = (scores[tech] || 0) + 1;
      });
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "dtf";
  };

  const recommendedTechId = showResult ? getRecommendation() : null;
  const recommendedTech = TECHNIQUES.find((t) => t.id === recommendedTechId);

  const resetQuiz = () => {
    setQuizStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const handleQuizCTA = () => {
    if (recommendedTech) {
      trackWhatsAppClick(`Quiz - ${recommendedTech.name}`, "Técnicas", "quiz-result");
      window.open(
        generateWhatsAppLink(
          `Quiz - Técnica recomendada: ${recommendedTech.name}`,
          "Técnicas",
          "quiz-result"
        ),
        "_blank"
      );
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Técnicas de Personalização
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Conheça cada técnica em detalhes e descubra qual é a melhor para o seu projeto.
            Nossa equipe está pronta para ajudar na escolha.
          </p>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="card-elevated p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Qual técnica é melhor pra mim?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Responda 3 perguntas rápidas
                  </p>
                </div>
              </div>

              {!showResult ? (
                <>
                  {/* Progress */}
                  <div className="flex gap-2 mb-6">
                    {quizQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full ${
                          index <= quizStep ? "bg-secondary" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Question */}
                  <div>
                    <p className="font-semibold text-foreground mb-4">
                      {quizQuestions[quizStep].question}
                    </p>
                    <RadioGroup
                      value={answers[quizQuestions[quizStep].id] || ""}
                      onValueChange={(value) =>
                        handleAnswer(quizQuestions[quizStep].id, value)
                      }
                    >
                      {quizQuestions[quizStep].options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-secondary cursor-pointer transition-colors"
                          onClick={() =>
                            handleAnswer(quizQuestions[quizStep].id, option.value)
                          }
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <Label
                            htmlFor={option.value}
                            className="cursor-pointer flex-1"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              ) : (
                /* Result */
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Técnica recomendada:
                  </h3>
                  <p className="text-2xl font-extrabold text-secondary mb-2">
                    {recommendedTech?.name}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {recommendedTech?.fullName} - {recommendedTech?.idealFor}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="cta" onClick={handleQuizCTA} className="gap-2">
                      <Phone className="h-4 w-4" />
                      Orçamento com {recommendedTech?.name}
                    </Button>
                    <Button variant="outline" onClick={resetQuiz}>
                      Refazer quiz
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All Techniques */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Conheça todas as técnicas
          </h2>
          <div className="space-y-6">
            {TECHNIQUES.map((technique) => (
              <TechniqueCard key={technique.id} technique={technique} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
