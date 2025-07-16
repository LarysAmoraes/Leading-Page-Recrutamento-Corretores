document.addEventListener('DOMContentLoaded', function() {
  // Função para limpar placeholders
  function cleanPlaceholders() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
      input.placeholder = ' '; // Espaço vazio necessário para o CSS
      if (!input.value) input.value = ''; // Limpa valores residuais
    });
  }

  // Atualizar ano do copyright
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Formulário flutuante - Versão melhorada
  const openFormBtn = document.getElementById('openFormBtn');
  const formOverlay = document.getElementById('formOverlay');
  const formSection = document.getElementById('formulario');
  const closeFormBtn = formSection.querySelector('.close-form-btn');
  
  // Melhor controle de estado do formulário
  let isFormProcessing = false;
  
  function toggleForm() {
    if (isFormProcessing) return;
    
    formOverlay.classList.toggle('active');
    formSection.classList.toggle('active');
    document.body.style.overflow = formSection.classList.contains('active') ? 'hidden' : '';
    
    // Focar no primeiro campo quando abrir
    if (formSection.classList.contains('active')) {
      setTimeout(() => {
        cleanPlaceholders(); // Limpa placeholders ao abrir o formulário
        const firstInput = formSection.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 300);
    }
  }

  // Controles do formulário
  openFormBtn.addEventListener('click', toggleForm);
  closeFormBtn.addEventListener('click', toggleForm);
  formOverlay.addEventListener('click', toggleForm);
  
  // Fechar com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && formSection.classList.contains('active')) {
      toggleForm();
    }
  });

  // Máscara de telefone melhorada
  function formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    const length = numbers.length;
    
    if (length === 0) return '';
    
    let formatted = '';
    if (length < 3) {
      formatted = `(${numbers}`;
    } else if (length < 7) {
      formatted = `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else if (length < 11) {
      formatted = `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    } else {
      formatted = `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
    }
    
    return formatted;
  }

  function handlePhoneInput(e) {
    const input = e.target;
    const cursorPosition = input.selectionStart;
    const oldValue = input.value;
    
    input.value = formatPhoneNumber(input.value);
    
    // Manter cursor na posição correta
    if (oldValue.length < input.value.length && cursorPosition === oldValue.length) {
      input.setSelectionRange(input.value.length, input.value.length);
    } else {
      const diff = input.value.length - oldValue.length;
      input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    }
  }

  // Validação de e-mail
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Nova função de validação de campo individual
  const validateField = (field) => {
    const label = field.nextElementSibling;
    
    if (!field.value.trim()) {
      field.classList.add('error');
      if (label && label.tagName === 'LABEL' && label.dataset.originalText) {
        label.textContent = `Por favor, preencha ${label.dataset.originalText.toLowerCase()}`;
      }
      return false;
    }
    
    if (field.id === 'email' && !validateEmail(field.value.trim())) {
      field.classList.add('error');
      if (label) label.textContent = 'Por favor, insira um e-mail válido';
      return false;
    }
    
    if (field.id === 'telefone' && field.value.replace(/\D/g, '').length < 10) {
      field.classList.add('error');
      if (label) label.textContent = 'Por favor, insira um telefone válido';
      return false;
    }
    
    field.classList.remove('error');
    if (label && label.dataset.originalText) {
      label.textContent = label.dataset.originalText;
    }
    return true;
  };

  // Validação de formulário melhorada
  function validateForm(form) {
    let isValid = true;
    
    form.querySelectorAll('input, textarea').forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Envio do formulário
  async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (isFormProcessing) return;
    isFormProcessing = true;
    
    if (!validateForm(form)) {
      isFormProcessing = false;
      return;
    }
    
    // Animação de carregamento melhorada
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Enviando...
    `;
    
    try {
      // Coletar dados
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        telefone: form.telefone.value,
        message: form.message.value.trim(),
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      };
      
      // Enviar para o backend Flask
      const response = await fetch('/enviar-cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro no servidor');
      }
      
      // Feedback visual de sucesso melhorado
      const formContainer = form.closest('.form-container');
      formContainer.innerHTML = `
        <div class="form-success text-center py-4">
          <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h3 class="mt-3">Cadastro enviado com sucesso!</h3>
          <p class="text-muted">Nossa equipe entrará em contato em breve.</p>
          <button class="modern-btn secondary-btn mt-3" onclick="location.reload()">
            <i class="fas fa-redo"></i> Voltar
          </button>
        </div>
      `;
      
      // Enviar evento para o Google Analytics (se disponível)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'engagement',
          'event_label': 'Cadastro Parceiro'
        });
      }
      
    } catch (error) {
      console.error('Erro:', error);
      
      // Feedback de erro melhorado
      const errorElement = document.createElement('div');
      errorElement.className = 'alert alert-danger mt-3';
      errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Erro:</strong> ${error.message || 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.'}
      `;
      
      form.insertBefore(errorElement, form.lastElementChild);
      
      // Rolagem para o erro
      setTimeout(() => {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      
    } finally {
      isFormProcessing = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  }

  // Configuração dos labels flutuantes
  const setupFloatingLabels = () => {
    document.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, textarea');
      const label = group.querySelector('label');

      if (input && label) {
        // Armazena o texto original
        if (!label.dataset.originalText) {
          label.dataset.originalText = label.textContent;
        }

        // Verifica conteúdo inicial
        if (input.value.trim() !== '') {
          label.classList.add('floating');
        }

        // Atualiza ao interagir
        input.addEventListener('input', function() {
          if (this.value.trim() !== '') {
            label.classList.add('floating');
          } else {
            label.classList.remove('floating');
          }
        });

        input.addEventListener('focus', function() {
          label.classList.add('floating');
        });

        input.addEventListener('blur', function() {
          if (this.value.trim() === '') {
            label.classList.remove('floating');
          }
        });
      }
    });
  };

  // Inicializar máscara de telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', handlePhoneInput);
    telefoneInput.addEventListener('focus', function() {
      if (!this.value) this.value = '(';
    });
  }

  // Inicializar validação em tempo real
  const form = document.getElementById('recrutamentoForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
    
    // Configura labels flutuantes
    setupFloatingLabels();
    
    // Armazena textos originais e configura validação
    form.querySelectorAll('input, textarea').forEach(input => {
      if (input.nextElementSibling && input.nextElementSibling.tagName === 'LABEL' && 
          !input.nextElementSibling.dataset.originalText) {
        input.nextElementSibling.dataset.originalText = input.nextElementSibling.textContent;
      }
      
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  // Scroll suave para links - Versão melhorada
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.modern-nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Atualizar URL sem recarregar a página
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Animação ao scroll - Versão melhorada
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.benefit-card, .testimonial-card, .section-title, .section-divider');
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    
    elements.forEach(element => {
      const elementHeight = element.offsetHeight;
      const elementTop = element.getBoundingClientRect().top + scrollY;
      const elementVisible = 100;
      
      // Verificar se o elemento está na viewport
      if (scrollY > elementTop - windowHeight + elementVisible) {
        element.classList.add('animate-in');
      }
    });
  };
  
  // Otimização de performance com throttle
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(animateOnScroll, 50);
  }, { passive: true });
  
  // Executar uma vez ao carregar
  animateOnScroll();
  
  // Adicionar classe de carregamento completo
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 300);
});

// Função para reativar listeners após resetar o formulário
function initializeForm() {
  const form = document.getElementById('recrutamentoForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', handlePhoneInput);
  }
}