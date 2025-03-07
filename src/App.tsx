import React, { useState, useEffect } from 'react';
import { Send, ChevronRight, ChevronLeft, Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ReactConfetti from 'react-confetti';
import { GoogleSheetsService } from './utils/googleSheets';
import type { FormData, Question } from './types';
import { Alert } from './components/Alert';
import Select from 'react-select';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    timestamp: '',
    compraPreferencia: '',
    ciudad: '',
    ciudadOtra: '',
    edad: '',
    whatsappNumber: '',
    ocupacion: '',
    estilo: '',
    estiloOtro: '',
    experiencia: '',
    recomendacion: '',
    sugerencia: '',
    aceptaTerminos: false
  });

  const questions: Question[] = [
    {
      id: 'welcome',
      type: 'welcome',
      content: (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Hola!</h2>
          <p className="text-gray-600 mb-4">
            En CHIVIS CLOTHES S.A.S. nos encantaría conocer un poco más sobre ti para seguir mejorando 
            y ofrecerte la mejor experiencia de compra posible.
          </p>
          <p className="text-gray-600 mb-4">
            Tu opinión es muy importante para nosotros, y por eso queremos invitarte a participar en 
            una breve encuesta. Como agradecimiento por tu tiempo, al finalizar recibirás un{' '}
            <span className="font-bold text-pink-600">10% de descuento</span> en tu próxima compra, 
            ¡y podrás disfrutarlo durante los próximos 30 días!
          </p>
          <p className="text-gray-600">
            Nos encantaría saber más sobre ti, así que, si tienes un momento, responde las siguientes preguntas.
          </p>
        </>
      )
    },
    {
      id: 'compraPreferencia',
      question: '¿Dónde sueles comprar ropa?',
      type: 'select',
      options: [
        { value: 'fisica', label: 'Tienda Física' },
        { value: 'virtual', label: 'Virtual' },
        { value: 'ambas', label: 'En ambas' }
      ]
    },
    {
      id: 'ciudad',
      question: '¿En qué ciudad te encuentras?',
      type: 'select',
      options: [
        { value: 'bogota', label: 'Bogotá' },
        { value: 'medellin', label: 'Medellín' },
        { value: 'cali', label: 'Cali' },
        { value: 'barranquilla', label: 'Barranquilla' },
        { value: 'cartagena', label: 'Cartagena' },
        { value: 'bucaramanga', label: 'Bucaramanga' },
        { value: 'cucuta', label: 'Cúcuta' },
        { value: 'ibague', label: 'Ibagué' },
        { value: 'manizales', label: 'Manizales' },
        { value: 'neiva', label: 'Neiva' },
        { value: 'pasto', label: 'Pasto' },
        { value: 'pereira', label: 'Pereira' },
        { value: 'popayan', label: 'Popayán' },
        { value: 'santaMarta', label: 'Santa Marta' },
        { value: 'valledupar', label: 'Valledupar' },
        { value: 'villavicencio', label: 'Villavicencio' },
        { value: 'otra', label: 'Otra ciudad' }
      ]
    },
    {
      id: 'edad',
      question: '¿Cuál es tu rango de edad?',
      type: 'select',
      options: [
        { value: 'menor18', label: 'Menos de 18 años' },
        { value: '18-24', label: '18-24 años' },
        { value: '25-34', label: '25-34 años' },
        { value: '35-44', label: '35-44 años' },
        { value: '45-54', label: '45-54 años' },
        { value: '55plus', label: '55 años o más' }
      ]
    },
    {
      id: 'whatsappNumber',
      question: '¿Cuál es tu número de WhatsApp?',
      type: 'phone',
      content: (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Cuál es tu número de WhatsApp?</h3>
          <input
            type="text"
            value={formData.whatsappNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, whatsappNumber: value });
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Ingresa tu número de WhatsApp"
            maxLength={10}
          />
        </div>
      )
    },
    {
      id: 'ocupacion',
      question: '¿Actualmente trabajas o estudias?',
      type: 'select',
      options: [
        { value: 'estudio', label: 'Estudio' },
        { value: 'trabajo', label: 'Trabajo' },
        { value: 'ambos', label: 'Estudio y trabajo' },
        { value: 'ninguno', label: 'Ninguna de las anteriores' }
      ]
    },
    {
      id: 'estilo',
      question: '¿Cómo describirías tu estilo?',
      type: 'select-other',
      options: [
        { value: 'elegante', label: 'Elegante' },
        { value: 'casual', label: 'Casual' },
        { value: 'oversize', label: 'Oversize' },
        { value: 'sport', label: 'Sport' },
        { value: 'otro', label: 'Otro' }
      ]
    },
    {
      id: 'experiencia',
      question: '¿Cómo calificarías tu experiencia de compra en CHIVIS Clothes S.A.S.?',
      type: 'select',
      options: [
        { value: 'excelente', label: 'Excelente' },
        { value: 'buena', label: 'Buena' },
        { value: 'regular', label: 'Regular' },
        { value: 'mala', label: 'Mala' },
        { value: 'muyMala', label: 'Muy mala' }
      ]
    },
    {
      id: 'recomendacion',
      question: '¿Nos recomendarías a tus amigos o familiares?',
      type: 'select',
      options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'sugerencia',
      type: 'textarea',
      question: '¿Tienes alguna sugerencia o algo que te gustaría contarnos?',
      description: 'Nos encantaría saber tu opinión para seguir mejorando.'
    },
    {
      id: 'terminos',
      type: 'terms',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Términos y Condiciones</h2>
          <div className="space-y-2">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.aceptaTerminos}
                onChange={(e) => setFormData({ ...formData, aceptaTerminos: e.target.checked })}
                className="mt-1"
                required
              />
              <span className="text-sm text-gray-600">
                Acepto el tratamiento de mis datos personales y autorizo a CHIVIS CLOTHES S.A.S. 
                para que los incluya en su base de datos de acuerdo con la política de tratamiento 
                de datos personales.
              </span>
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'thanks',
      type: 'thanks',
      content: (
        <>
          <div className="text-center">
            <div className="mb-6 text-green-600">
              <Send className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Gracias por ser parte de nuestra comunidad!</h2>
            <p className="text-gray-600 mb-6">
              Tu opinión nos ayuda a seguir mejorando y a ofrecerte lo mejor.
            </p>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
              <p className="text-pink-800 font-semibold">Tu código de descuento:</p>
              <p className="text-2xl font-bold text-pink-600 mt-2">CHIVIS10</p>
              <p className="text-sm text-pink-700 mt-2">
                Válido por 30 días en tu próxima compra
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              El 10% de descuento no aplica sobre prendas en promoción ni con otras ofertas vigentes. 
              ¡Aprovecha tu descuento en productos de colección exclusiva!
            </p>
            <p className="text-gray-600">
              ¡Te esperamos en CHIVIS CLOTHES S.A.S.!
            </p>
          </div>
        </>
      )
    }
  ];

  useEffect(() => {
    if (currentStep === questions.length - 1) {
      setShowConfetti(true);
      submitToGoogleSheets();
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentStep]);

  const submitToGoogleSheets = async () => {
    try {
      const googleSheetsService = new GoogleSheetsService();
      
      const dataToSubmit: FormData = {
        timestamp: new Date().toISOString(),
        compraPreferencia: formData.compraPreferencia,
        ciudad: formData.ciudad === 'otra' ? formData.ciudadOtra || '' : formData.ciudad,
        ciudadOtra: formData.ciudadOtra,
        edad: formData.edad,
        whatsappNumber: formData.whatsappNumber,
        ocupacion: formData.ocupacion,
        estilo: formData.estilo === 'otro' ? formData.estiloOtro || '' : formData.estilo,
        estiloOtro: formData.estiloOtro,
        experiencia: formData.experiencia,
        recomendacion: formData.recomendacion,
        sugerencia: formData.sugerencia,
        aceptaTerminos: formData.aceptaTerminos
      };

      await googleSheetsService.appendData(dataToSubmit);
      
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    if (currentQuestion.type === 'select' || currentQuestion.type === 'select-other') {
      const value = formData[currentQuestion.id as keyof FormData];
      
      if (currentQuestion.id === 'ciudad' && value === 'otra' && !formData.ciudadOtra) {
        setAlertMessage('Por favor, especifica tu ciudad');
        setShowAlert(true);
        return;
      }
      
      if (currentQuestion.id === 'estilo' && value === 'otro' && !formData.estiloOtro) {
        setAlertMessage('Por favor, especifica tu estilo');
        setShowAlert(true);
        return;
      }
      
      if (!value) {
        setAlertMessage('Por favor, selecciona una opción');
        setShowAlert(true);
        return;
      }
    }

    if (currentQuestion.type === 'phone') {
      const value = formData.whatsappNumber;
      if (!value || value.length < 10) {
        setAlertMessage('Por favor, ingresa un número de WhatsApp válido (10 dígitos)');
        setShowAlert(true);
        return;
      }
    }
    
    if (currentQuestion.type === 'terms' && !formData.aceptaTerminos) {
      setAlertMessage('Debes aceptar los términos y condiciones para continuar');
      setShowAlert(true);
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = Math.round((currentStep / (questions.length - 1)) * 100);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentStep];

    if (currentQuestion.type === 'welcome' || currentQuestion.type === 'thanks' || currentQuestion.type === 'terms') {
      return currentQuestion.content;
    }

    if (currentQuestion.type === 'phone') {
      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentQuestion.question}</h3>
          <input
            type="text"
            value={formData.whatsappNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, whatsappNumber: value });
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Ingresa tu número de WhatsApp"
            maxLength={10}
          />
        </div>
      );
    }

    if (currentQuestion.type === 'textarea') {
      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentQuestion.question}</h3>
          {currentQuestion.description && (
            <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
          )}
          <textarea
            value={formData[currentQuestion.id as keyof FormData] as string || ''}
            onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
            placeholder="Escribe tu respuesta aquí..."
          />
        </div>
      );
    }

    if (currentQuestion.type === 'select' || currentQuestion.type === 'select-other') {
      if (currentQuestion.id === 'ciudad') {
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
            <Select
              options={currentQuestion.options?.map(option => ({
                value: option.value,
                label: option.label
              }))}
              value={currentQuestion.options?.find(option => option.value === formData[currentQuestion.id as keyof FormData])}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setFormData({
                    ...formData,
                    [currentQuestion.id]: selectedOption.value,
                    ciudadOtra: selectedOption.value === 'otra' ? '' : formData.ciudadOtra
                  });
                }
              }}
              placeholder="Selecciona tu ciudad"
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#e5e7eb',
                  '&:hover': {
                    borderColor: '#ec4899'
                  },
                  boxShadow: 'none',
                  '&:focus-within': {
                    borderColor: '#ec4899',
                    boxShadow: '0 0 0 1px #ec4899'
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#ec4899' : state.isFocused ? '#fce7f3' : 'white',
                  '&:active': {
                    backgroundColor: '#ec4899'
                  }
                })
              }}
            />
            {formData[currentQuestion.id as keyof FormData] === 'otra' && (
              <input
                type="text"
                value={formData.ciudadOtra || ''}
                onChange={(e) => setFormData({ ...formData, ciudadOtra: e.target.value })}
                placeholder="Especifica tu ciudad"
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            )}
          </div>
        );
      }
      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={formData[currentQuestion.id as keyof FormData] === option.value}
                  onChange={(e) => setFormData({ ...formData, [currentQuestion.id]: e.target.value })}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {((currentQuestion.type as string) === 'select-other' && formData[currentQuestion.id as keyof FormData] === 'otro' && currentQuestion.id === 'estilo') && (
            <input
              type="text"
              value={formData.estiloOtro || ''}
              onChange={(e) => setFormData({ ...formData, estiloOtro: e.target.value })}
              placeholder="Especifica tu estilo"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4">
      {showConfetti && <ReactConfetti />}
      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      
      <div className="w-full max-w-md mb-8 mt-8">
        <img
          src="https://chivisclothes.com/wp-content/uploads/2023/11/LOGO-ALTA-CHIVIS.webp"
          alt="Chivis Clothes Logo"
          className="w-48 h-auto mx-auto"
        />
      </div>

      <div className="w-full max-w-md mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-pink-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mb-8">
        {renderQuestion()}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 
              ${currentStep === 0 ? 'invisible' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200
              ${currentStep === questions.length - 1 
                ? 'invisible'
                : 'bg-pink-600 text-white hover:bg-pink-700'}`}
          >
            {currentStep === questions.length - 2 ? 'Finalizar' : 'Siguiente'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <footer className="w-full max-w-md text-center pb-4">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://www.facebook.com/chivisclothes" target="_blank" rel="noopener noreferrer" 
             className="text-gray-600 hover:text-pink-600">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="https://instagram.com/chivis_clothes" target="_blank" rel="noopener noreferrer"
             className="text-gray-600 hover:text-pink-600">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="https://www.tiktok.com/@chivis_clothes" target="_blank" rel="noopener noreferrer"
             className="text-gray-600 hover:text-pink-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
          <a href="https://wa.me/message/A5I7G53I4GRXL1" target="_blank" rel="noopener noreferrer"
             className="text-gray-600 hover:text-pink-600">
            <FaWhatsapp className="w-6 h-6" />
          </a>
        </div>
        <p className="text-sm text-gray-600">
          © Chivis Clothes 2025. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;