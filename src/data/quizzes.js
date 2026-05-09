// Quiz questions per article id. Each quiz has 5 questions.
export const quizzes = {
  '1': [
    {
      type: 'Vocabulario',
      question: '¿Qué significa "batería" en este contexto?',
      options: [
        'Un grupo de músicos',
        'Un dispositivo que almacena energía',
        'Una serie de exámenes',
        'Un instrumento de percusión',
      ],
      correctIndex: 1,
    },
    {
      type: 'Vocabulario',
      question: 'La palabra "fabricante" se refiere a...',
      options: [
        'Una persona que vende productos',
        'Una empresa que produce algo',
        'Un cliente que compra coches',
        'Un técnico que repara máquinas',
      ],
      correctIndex: 1,
    },
    {
      type: 'Comprensión',
      question: '¿Dónde tiene su sede la empresa StoreDot?',
      options: ['En Madrid', 'En Jerusalén', 'En Tel Aviv', 'En Barcelona'],
      correctIndex: 2,
    },
    {
      type: 'Comprensión',
      question: '¿Cuánto tiempo tarda en cargarse la nueva batería?',
      options: ['Treinta minutos', 'Una hora', 'Diez minutos', 'Cinco minutos'],
      correctIndex: 3,
    },
    {
      type: 'Gramática',
      question: 'Completa: "La producción ___ el próximo año."',
      options: ['comenzará', 'comenzaba', 'comenzaría', 'ha comenzado'],
      correctIndex: 0,
    },
  ],
}

export const getQuizForArticle = (id) => quizzes[id] || quizzes['1']
