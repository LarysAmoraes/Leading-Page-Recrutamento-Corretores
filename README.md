📄 README.md
markdown
Copy
Edit
# 🌐 Site Jean - Formulário com Flask

Este é um projeto simples de site com front-end em HTML, CSS e JavaScript, integrado com um backend em Flask (Python). O objetivo é capturar dados de um formulário e processá-los de forma segura via API POST. Ideal para landing pages com captura de leads, formulários de contato, ou páginas institucionais.

---

## 📁 Estrutura do Projeto

SITE_JEAN/
│
├── backend/
│ ├── init.py
│ ├── app.py
│ ├── requirements.txt
│ ├── runtime.txt
│ ├── render.yaml
│ ├── start.sh
│ └── .env
│
├── frontend/
│ ├── static/
│ │ ├── css/
│ │ │ └── main.css
│ │ ├── img/
│ │ │ └── [imagens diversas]
│ │ └── js/
│ │ └── app.js
│ └── templates/
│ └── index.html
│
└── venv/ (virtualenv)

yaml
Copy
Edit

---

## 🚀 Como Rodar Localmente

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/site-jean.git
cd site-jean/backend
2. Crie e Ative o Ambiente Virtual
bash
Copy
Edit
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
3. Instale as Dependências
bash
Copy
Edit
pip install -r requirements.txt
4. Configure o Arquivo .env
Crie um arquivo chamado .env dentro da pasta backend/ com o seguinte conteúdo:

ini
Copy
Edit
FLASK_SECRET_KEY=sua_chave_super_secreta
5. Execute o Servidor Flask
bash
Copy
Edit
python app.py
Abra seu navegador em http://localhost:5000

🌍 Rotas da Aplicação
Rota	Método	Descrição
/	GET	Carrega o index.html do front-end
/enviar-cadastro	POST	Recebe JSON com name, email, telefone, message

📥 Exemplo de Envio POST
json
Copy
Edit
POST /enviar-cadastro
Content-Type: application/json

{
  "name": "Jean Silva",
  "email": "jean@email.com",
  "telefone": "11999999999",
  "message": "Gostaria de mais informações."
}
🛠 Tecnologias Utilizadas
Python 3.11+

Flask

HTML5

CSS3

JavaScript (vanilla)

dotenv

VS Code

☁️ Deploy com Render
Este projeto está pronto para ser hospedado gratuitamente na Render. Basta seguir os passos abaixo:

✅ Requisitos:
render.yaml configurado

start.sh para iniciar o app

Comandos da Render:
Start command:

bash
Copy
Edit
./start.sh
Build command:
(Deixe em branco ou use pip install -r backend/requirements.txt)

Runtime: Python 3.x

Variáveis de ambiente:

FLASK_SECRET_KEY

🙋‍♀️ Desenvolvedora
Feito com dedicação por Larissa Moraes
📧 Email: larissamoraes@email.com
💼 LinkedIn: linkedin.com/in/larissamoraes

📄 Licença
Distribuído sob a licença MIT.
Veja o arquivo LICENSE para mais detalhes.

yaml
Copy
Edit
