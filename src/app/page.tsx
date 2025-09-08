
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const questions = [
    "¿Qué día de la semana es hoy?",
    "¿Qué hora es (aproximadamente)?",
    "¿Cuántas lunas tiene la Tierra?",
    "¿Cuántas capas tiene la Tierra?", // Esta es la clave
    "¿Cuál es el color del caballo blanco de Napoleón?",
    "¿Cuántos continentes hay en el mundo?",
    "¿Cuántos planetas tiene el sistema solar?",
    "¿Cuál es el animal nacional de Australia?",
    "¿Cuál es la capital de Mongolia?",
    "¿Cuántos elementos tiene la tabla periódica?",
  ];

  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""));
  const [block, setBlock] = useState(0); // 0 a 1
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<null | "positivo" | "negativo">(null);

  useEffect(() => {
    if (finished && result === null) {
      if (typeof window !== "undefined") {
        const alreadyTested = localStorage.getItem("drugTested");
        // Si es la primera vez, siempre positivo
        if (!alreadyTested) {
          setResult("positivo");
          localStorage.setItem("drugTested", "1");
        } else {
          // La respuesta a la pregunta 3 (índice 3) decide el resultado
          const capas = answers[3]?.trim().replace(/[^0-9]/g, "");
          if (capas === "3") {
            setResult("negativo");
          } else if (capas === "5") {
            setResult("positivo");
          } else {
            setResult(Math.random() > 0.5 ? "positivo" : "negativo");
          }
        }
      }
    }
  }, [finished, result, answers]);

  const handleAnswer = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if ((block + 1) * 5 < questions.length) {
      setBlock(block + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setAnswers(Array(10).fill(""));
    setBlock(0);
    setFinished(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 text-gray-900">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Test de Drogas Online</h1>
        {!finished ? (
          <div className="w-full flex flex-col gap-6 mb-6">
            {questions.slice(block * 5, block * 5 + 5).map((q, i) => (
              <div key={block * 5 + i} className="flex flex-col">
                <span className="mb-2 font-medium">{block * 5 + i + 1}. {q}</span>
                <input
                  className="py-2 px-4 rounded border w-full"
                  type="text"
                  value={answers[block * 5 + i]}
                  onChange={e => handleAnswer(block * 5 + i, e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition self-end"
              onClick={handleNext}
              disabled={questions.slice(block * 5, block * 5 + 5).some((_, i) => !answers[block * 5 + i].trim())}
            >
              {block === 1 ? "Finalizar" : "Siguiente"}
            </button>
          </div>
        ) : (
          <div className="text-center mt-4">
            <span className={`text-lg font-bold ${result === "positivo" ? "text-red-600" : "text-green-600"}`}>
              Resultado: {result === "positivo" ? "Positivo" : "Negativo"}
            </span>
            <div className="mt-4 text-gray-700 text-sm">
              {result === "positivo" && answers[3]?.trim().replace(/[^0-9]/g, "") === "3" && (
                <>Respuesta errada. La Tierra tiene 5 capas: corteza, manto, núcleo externo, núcleo interno y litosfera.</>
              )}
              {result === "negativo" && answers[3]?.trim().replace(/[^0-9]/g, "") === "5" && (
                <>Respuesta errada. La Tierra tiene 3 capas: corteza, manto y núcleo.</>
              )}
              {result !== null && !["3","5"].includes(answers[3]?.trim().replace(/[^0-9]/g, "")) && (
                (() => {
                  const opciones = [
                    {n: 4, capas: "corteza, manto, núcleo externo y núcleo interno"},
                    {n: 2, capas: "superficie y núcleo"},
                    {n: 6, capas: "corteza, manto superior, manto inferior, núcleo externo, núcleo interno y astenosfera"},
                  ];
                  const aleatoria = opciones[Math.floor(Math.random()*opciones.length)];
                  return <>Respuesta errada. La Tierra tiene {aleatoria.n} capas: {aleatoria.capas}.</>;
                })()
              )}
            </div>
            <div className="mt-4">
              <button
                className="text-blue-600 underline text-sm"
                onClick={handleRestart}
              >
                Volver a realizar el test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
