from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__,
            template_folder='../frontend/templates',
            static_folder='../frontend/static')

app.secret_key = os.getenv('FLASK_SECRET_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar-cadastro', methods=['POST'])
def enviar_cadastro():
    try:
        dados = request.get_json()
        
        # Validação dos campos
        required_fields = ['name', 'email', 'telefone', 'message']
        if not all(field in dados for field in required_fields):
            return jsonify({'success': False, 'message': 'Dados incompletos'}), 400
            
        if '@' not in dados['email'] or '.' not in dados['email']:
            return jsonify({'success': False, 'message': 'Email inválido'}), 400

        # Aqui você pode adicionar lógica alternativa como:
        # - Salvar em um banco de dados
        # - Enviar para uma API externa
        # - Registrar em um arquivo de log
        
        return jsonify({
            'success': True,
            'message': 'Cadastro recebido com sucesso!',
            'dados': dados  # Opcional: retorna os dados recebidos
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao processar cadastro: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run()