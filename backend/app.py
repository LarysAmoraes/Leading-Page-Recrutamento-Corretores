from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__,
            template_folder='../frontend/templates',
            static_folder='../frontend/static')

# Configuração do Flask-Mail para Outlook
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('OUTLOOK_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('OUTLOOK_PASSWORD')
app.secret_key = os.getenv('FLASK_SECRET_KEY')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')  # Removido o parâmetro site_key

@app.route('/enviar-cadastro', methods=['POST'])
def enviar_cadastro():
    try:
        dados = request.get_json()
        
        # Validação simplificada (sem reCAPTCHA)
        required_fields = ['name', 'email', 'telefone', 'message']
        if not all(field in dados for field in required_fields):
            return jsonify({'success': False, 'message': 'Dados incompletos'}), 400
            
        if '@' not in dados['email'] or '.' not in dados['email']:
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        # Envio do email
        msg = Message(
            subject=f"Novo cadastro de {dados['name']} - EZTEC",
            recipients=[os.getenv('OUTLOOK_EMAIL')],
            body=f"""
            Novo cadastro recebido:
            
            Nome: {dados['name']}
            Email: {dados['email']}
            Telefone: {dados['telefone']}
            Mensagem: {dados['message']}
            
            Dados enviados através do formulário de parceiros.
            """
        )
        mail.send(msg)
        
        return jsonify({
            'success': True,
            'message': 'Cadastro enviado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao enviar cadastro: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)